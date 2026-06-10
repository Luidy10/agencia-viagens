require("dotenv").config()

  const bcrypt = require("bcryptjs")
  const Destino = require("./models/Destino")
  const express = require("express")
  const mongoose = require("mongoose")
  const cors = require("cors")
  const multer = require("multer")
  const path = require("path")
  const fs = require("fs")
  const nodemailer = require("nodemailer")
  const axios = require("axios")
  const {
    notificarContaCriada,
    notificarContaExcluida,
    notificarSenhaAlterada,
    notificarComentarioCriado,
    notificarViagemAgendada,
    notificarViagemCancelada,
    notificarDestinoCriado,
    notificarDestinoExcluido
  } = require("./utils/notificacoes")

  const app = express()

  const allowedOrigins = [
    "https://agencia-viagens-2g7y.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173"
  ]

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Origem não permitida pelo CORS: " + origin))
      }
    },
    credentials: true
  }))
  app.use(express.json())

  app.use("/uploads", express.static("uploads"))

  if (!fs.existsSync("uploads")) fs.mkdirSync("uploads")
  if (!fs.existsSync("uploads/perfis")) fs.mkdirSync("uploads/perfis")
  if (!fs.existsSync("uploads/destinos")) fs.mkdirSync("uploads/destinos")

  mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agencia_viagens")
    .then(() => console.log("✅ Mongo conectado"))
    .catch(err => console.log(err))

  const Usuario    = require("./models/User")
  const Viagem     = require("./models/Viagem")
  const Comentario = require("./models/Comentario")

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const enviarEmail = async (opcoes) => {
    try {
      await transporter.sendMail(opcoes)
    } catch (err) {
      console.warn("[Email] Falha ao enviar:", err.message)
    }
  }

  // ─── Normaliza número para E.164 ────────────────────────────────────────────
  function normalizarTelefone(telefone) {
    let to = telefone.replace(/^whatsapp:/, "").trim()
    to = to.replace(/[^\d+]/g, "")
    if (!to.startsWith("+")) to = "+" + to
    return to
  }

  // ─── Twilio ──────────────────────────────────────────────────────────────────
  async function enviarSMSTwilio(to, mensagem) {
    const accountSid = process.env.TWILIO_SID
    const authToken  = process.env.TWILIO_TOKEN
    const from       = process.env.TWILIO_SMS_FROM
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64")
    const resp = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({ To: to, From: from, Body: mensagem }).toString(),
      { headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" } }
    )
    console.log("[SMS/Twilio] Enviado para:", to, "| SID:", resp.data.sid)
  }

  // ─── Vonage ──────────────────────────────────────────────────────────────────
  async function enviarSMSVonage(to, mensagem) {
    const apiKey    = process.env.VONAGE_API_KEY
    const apiSecret = process.env.VONAGE_API_SECRET
    const from      = process.env.VONAGE_FROM || "ViaPlan"
    const toVonage  = to.replace("+", "")
    const resp = await axios.post(
      "https://rest.nexmo.com/sms/json",
      { api_key: apiKey, api_secret: apiSecret, to: toVonage, from, text: mensagem },
      { headers: { "Content-Type": "application/json" } }
    )
    const msg = resp.data.messages?.[0]
    if (msg?.status !== "0") throw new Error(`Vonage erro: ${msg?.["error-text"]}`)
    console.log("[SMS/Vonage] Enviado para:", to, "| ID:", msg["message-id"])
  }

  // ─── Zenvia (Brasil) ─────────────────────────────────────────────────────────
  async function enviarSMSZenvia(to, mensagem) {
    const token    = process.env.ZENVIA_TOKEN
    const from     = process.env.ZENVIA_FROM || "ViaPlan"
    const toZenvia = to.replace("+", "")
    const resp = await axios.post(
      "https://api.zenvia.com/v2/channels/sms/messages",
      {
        from: { type: "number", number: from },
        to:   { type: "number", number: toZenvia },
        contents: [{ type: "text", text: mensagem }]
      },
      { headers: { "X-API-Token": token, "Content-Type": "application/json" } }
    )
    console.log("[SMS/Zenvia] Enviado para:", to, "| ID:", resp.data.id)
  }

  // ─── Wrapper principal — detecta provedor automaticamente ────────────────────
  const enviarSMS = async (telefone, mensagem) => {
    const to = normalizarTelefone(telefone)

    const twilioOk = process.env.TWILIO_SID &&
                     !process.env.TWILIO_SID.includes("xxx") &&
                     process.env.TWILIO_TOKEN !== "your_auth_token"
    if (twilioOk) { await enviarSMSTwilio(to, mensagem); return }

    const vonageOk = process.env.VONAGE_API_KEY &&
                     !process.env.VONAGE_API_KEY.includes("xxx")
    if (vonageOk) { await enviarSMSVonage(to, mensagem); return }

    const zenviaOk = process.env.ZENVIA_TOKEN &&
                     !process.env.ZENVIA_TOKEN.includes("xxx")
    if (zenviaOk) { await enviarSMSZenvia(to, mensagem); return }

    // Modo desenvolvimento — mostra código no console
    const codigo = (mensagem.match(/\b(\d{6})\b/) || [])[1] || "N/A"
    console.log("\n" + "═".repeat(55))
    console.log("  📱  SMS NÃO ENVIADO — MODO DESENVOLVIMENTO")
    console.log("  Para:", to)
    console.log(`  CÓDIGO: ${codigo}`)
    console.log("  Mensagem:", mensagem)
    console.log("═".repeat(55) + "\n")
  }

  const notificarSeguro = async (fn, ...args) => {
    try {
      await fn(...args)
    } catch (err) {
      console.warn("[Notificacao] Falha:", err.message)
    }
  }

  // =====================================================
  // ARMAZENAMENTO TEMPORÁRIO DE CÓDIGOS (MongoDB)
  // =====================================================

  const CodigoPendenteSchema = new mongoose.Schema({
    chave:    { type: String, required: true, unique: true },
    codigo:   { type: String, required: true },
    expira:   { type: Date,   required: true },
    novoEmail: { type: String, default: null }
  })
  CodigoPendenteSchema.index({ expira: 1 }, { expireAfterSeconds: 0 })
  const CodigoPendente = mongoose.model('CodigoPendente', CodigoPendenteSchema)

  const codigosPendentes = {
    async set(chave, { codigo, expira, novoEmail }) {
      await CodigoPendente.findOneAndUpdate(
        { chave },
        { codigo, expira: new Date(expira), novoEmail: novoEmail || null },
        { upsert: true, new: true }
      )
    },
    async get(chave) {
      return await CodigoPendente.findOne({ chave })
    },
    async delete(chave) {
      await CodigoPendente.deleteOne({ chave })
    }
  }

  function gerarCodigo() {
    return String(Math.floor(100000 + Math.random() * 900000))
  }

  function templateEmail(titulo, subtitulo, nome, codigo, rodape = "") {
    return `
      <div style="background:#0d0f14;padding:40px 20px;font-family:'Segoe UI',sans-serif;min-height:100vh">
        <div style="max-width:480px;margin:0 auto;background:#111318;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px;box-shadow:0 32px 80px rgba(0,0,0,.5)">
          <div style="text-align:center;margin-bottom:32px">
            <div style="font-size:28px;color:#c49b50;margin-bottom:8px">✦</div>
            <h1 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:0 0 6px">Via<em style="font-style:italic;color:#c49b50">Plan</em></h1>
            <p style="color:#475569;font-size:14px;margin:0">${subtitulo}</p>
          </div>
          <p style="color:#94a3b8;font-size:15px;margin:0 0 8px">Olá, <strong style="color:#e2e8f0">${nome}</strong> 👋</p>
          <p style="color:#64748b;font-size:14px;margin:0 0 32px">${titulo} Ele expira em <strong style="color:#94a3b8">10 minutos</strong>.</p>
          <div style="background:#0d0f14;border:1px solid rgba(196,155,80,.25);border-radius:14px;padding:28px;text-align:center;margin-bottom:32px">
            <p style="color:#475569;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 12px">Código de verificação</p>
            <span style="font-size:42px;font-weight:800;letter-spacing:10px;color:#c49b50;font-family:'Courier New',monospace">${codigo}</span>
          </div>
          <p style="color:#334155;font-size:12px;text-align:center;margin:0">${rodape || "Se você não solicitou este código, ignore este email com segurança."}</p>
        </div>
      </div>
    `
  }

  // ================= MIDDLEWARE ADMIN
  async function verificarAdmin(req, res, next) {
    try {
      const userId = req.headers.userid
      if (!userId) return res.status(401).json({ msg: "Não autorizado" })
      const usuario = await Usuario.findById(userId)
      if (!usuario || !usuario.admin) return res.status(403).json({ msg: "Acesso negado (somente admin)" })
      next()
    } catch (e) {
      res.status(500).json({ erro: "Erro na autenticação" })
    }
  }

  // ================= MULTER PERFIL
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/perfis"),
    filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  })
  const upload = multer({ storage })

  // ================= MULTER DESTINOS
  const storageDestinos = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/destinos"),
    filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  })
  const uploadDestinos = multer({ storage: storageDestinos })

  // =====================================================
  // CADASTRO — VERIFICAÇÃO DE EMAIL
  // =====================================================

  app.post("/usuarios/enviar-codigo", async (req, res) => {
    try {
      const { email, nome } = req.body
      if (!email || !nome) return res.status(400).json({ erro: "Email e nome são obrigatórios." })

      const existente = await Usuario.findOne({ email })
      if (existente) return res.status(409).json({ erro: "Este email já está cadastrado." })

      const codigo = gerarCodigo()
      await codigosPendentes.set(`cadastro:${email}`, {
        codigo,
        expira: Date.now() + 10 * 60 * 1000
      })

      await enviarEmail({
        from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔐 Seu código de verificação — ViaPlan",
        html: templateEmail(
          "Use o código abaixo para confirmar seu cadastro.",
          "Verificação de email",
          nome,
          codigo
        )
      })

      res.json({ msg: "Código enviado com sucesso." })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao enviar código. Tente novamente." })
    }
  })

  app.post("/usuarios/verificar-codigo", async (req, res) => {
    try {
      const { email, codigo, nome, senha, telefone } = req.body
      if (!email || !codigo || !nome || !senha) return res.status(400).json({ erro: "Dados incompletos." })

      const chave = `cadastro:${email}`
      const pendente = await codigosPendentes.get(chave)
      if (!pendente) return res.status(400).json({ erro: "Nenhum código pendente para este email. Solicite um novo." })
      if (Date.now() > pendente.expira) { await codigosPendentes.delete(chave); return res.status(400).json({ erro: "Código expirado. Solicite um novo." }) }
      if (pendente.codigo !== codigo) return res.status(400).json({ erro: "Código incorreto." })

      const existente = await Usuario.findOne({ email })
      if (existente) { await codigosPendentes.delete(chave); return res.status(409).json({ erro: "Este email já está cadastrado." }) }

      const senhaHash = await bcrypt.hash(senha, 10)
      const usuario = new Usuario({ nome, email, senha: senhaHash, telefone: telefone || "" })
      await usuario.save()
      await codigosPendentes.delete(chave)

      await enviarEmail({
        from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "✅ Cadastro confirmado — ViaPlan",
        html: `
          <div style="background:#0d0f14;padding:40px 20px;font-family:'Segoe UI',sans-serif">
            <div style="max-width:480px;margin:0 auto;background:#111318;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px">
              <div style="text-align:center;margin-bottom:24px">
                <div style="font-size:28px;color:#c49b50">✦</div>
                <h1 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:8px 0 0">Bem-vindo à Via<em style="font-style:italic;color:#c49b50">Plan</em>!</h1>
              </div>
              <p style="color:#94a3b8;font-size:15px;text-align:center">Olá, <strong style="color:#e2e8f0">${nome}</strong>! Sua conta foi criada com sucesso. ✈️</p>
            </div>
          </div>
        `
      }).catch(() => {})

      res.json({ msg: "Usuário criado com sucesso!", usuario })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao criar conta. Tente novamente." })
    }
  })

  // =====================================================
  // TROCAR SENHA — com senha antiga
  // =====================================================

  app.put("/usuarios/:id/trocar-senha", async (req, res) => {
    try {
      const { senhaAtual, novaSenha } = req.body
      if (!senhaAtual || !novaSenha) return res.status(400).json({ erro: "Preencha todos os campos." })

      const usuario = await Usuario.findById(req.params.id)
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado." })
      const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha)
      if (!senhaCorreta) return res.status(401).json({ erro: "Senha atual incorreta." })

      usuario.senha = await bcrypt.hash(novaSenha, 10)
      await usuario.save()

      await notificarSeguro(notificarSenhaAlterada, transporter, usuario)

      res.json({ msg: "Senha alterada com sucesso!" })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao alterar senha." })
    }
  })

  // =====================================================
  // TROCAR SENHA — esqueci minha senha (por código)
  // =====================================================

  app.post("/usuarios/recuperar-senha/enviar", async (req, res) => {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ erro: "Email obrigatório." })

      const usuario = await Usuario.findOne({ email })
      if (!usuario) return res.json({ msg: "Se este email estiver cadastrado, você receberá o código." })

      const codigo = gerarCodigo()
      await codigosPendentes.set(`senha:${usuario._id}`, {
        codigo,
        expira: Date.now() + 10 * 60 * 1000
      })

      await enviarEmail({
        from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔑 Recuperação de senha — ViaPlan",
        html: templateEmail(
          "Use o código abaixo para redefinir sua senha.",
          "Recuperação de senha",
          usuario.nome,
          codigo,
          "Se você não solicitou a troca de senha, ignore este email. Sua senha permanece a mesma."
        )
      })

      res.json({ msg: "Se este email estiver cadastrado, você receberá o código.", userId: usuario._id })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao enviar código." })
    }
  })

  app.put("/usuarios/:id/recuperar-senha/confirmar", async (req, res) => {
    try {
      const { codigo, novaSenha } = req.body
      if (!codigo || !novaSenha) return res.status(400).json({ erro: "Dados incompletos." })

      const chave = `senha:${req.params.id}`
      const pendente = await codigosPendentes.get(chave)
      if (!pendente) return res.status(400).json({ erro: "Nenhum código pendente. Solicite um novo." })
      if (Date.now() > pendente.expira) { await codigosPendentes.delete(chave); return res.status(400).json({ erro: "Código expirado. Solicite um novo." }) }
      if (pendente.codigo !== codigo) return res.status(400).json({ erro: "Código incorreto." })

      const usuario = await Usuario.findById(req.params.id)
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado." })

      const igualAtual = await bcrypt.compare(novaSenha, usuario.senha)
      if (igualAtual) return res.status(400).json({ erro: "A nova senha não pode ser igual à senha atual." })

      const historicoSenhas = usuario.historicoSenhas || []
      for (const hashAntigo of historicoSenhas) {
        const igualAnterior = await bcrypt.compare(novaSenha, hashAntigo)
        if (igualAnterior) return res.status(400).json({ erro: "A nova senha não pode ser igual a uma senha usada anteriormente." })
      }

      const senhaHash = await bcrypt.hash(novaSenha, 10)
      const novoHistorico = [usuario.senha, ...historicoSenhas].slice(0, 5)

      await Usuario.findByIdAndUpdate(req.params.id, {
        senha: senhaHash,
        historicoSenhas: novoHistorico
      }, { new: true })

      await codigosPendentes.delete(chave)

      res.json({ msg: "Senha redefinida com sucesso!" })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao redefinir senha." })
    }
  })

  // =====================================================
  // TROCAR EMAIL — código enviado via SMS
  // =====================================================

  app.post("/usuarios/:id/trocar-email/enviar", async (req, res) => {
    try {
      const { novoEmail } = req.body
      if (!novoEmail) return res.status(400).json({ erro: "Novo email obrigatório." })

      const usuario = await Usuario.findById(req.params.id)
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado." })

      const emailEmUso = await Usuario.findOne({ email: novoEmail })
      if (emailEmUso) return res.status(409).json({ erro: "Este email já está em uso por outra conta." })

      const codigo = gerarCodigo()
      await codigosPendentes.set(`email:${req.params.id}`, {
        codigo,
        novoEmail,
        expira: Date.now() + 10 * 60 * 1000
      })

      await enviarEmail({
        from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
        to: usuario.email,
        subject: "📧 Troca de e-mail — ViaPlan",
        html: templateEmail(
          "Use o código abaixo para confirmar a troca do seu e-mail.",
          "Troca de e-mail",
          usuario.nome,
          codigo,
          `Seu e-mail será alterado para: ${novoEmail}. Se você não solicitou esta troca, ignore este e-mail.`
        )
      })

      res.json({ msg: "Código enviado para o e-mail atual." })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao enviar código." })
    }
  })

  app.put("/usuarios/:id/trocar-email/confirmar", async (req, res) => {
    try {
      const { codigo } = req.body
      if (!codigo) return res.status(400).json({ erro: "Código obrigatório." })

      const chave = `email:${req.params.id}`
      const pendente = await codigosPendentes.get(chave)
      if (!pendente) return res.status(400).json({ erro: "Nenhum código pendente. Solicite um novo." })
      if (Date.now() > pendente.expira) { await codigosPendentes.delete(chave); return res.status(400).json({ erro: "Código expirado. Solicite um novo." }) }
      if (pendente.codigo !== codigo) return res.status(400).json({ erro: "Código incorreto." })

      const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        { email: pendente.novoEmail },
        { new: true }
      )
      await codigosPendentes.delete(chave)

      res.json({ msg: "Email atualizado com sucesso!", usuario })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao atualizar email." })
    }
  })

  // =====================================================
  // PASSAGEIROS — Verificacao de identidade no checkout
  // =====================================================

  app.post("/passageiros/enviar-codigo", async (req, res) => {
    try {
      const { nome, email, celular } = req.body
      const contato = email || celular
      if (!contato || !nome) return res.status(400).json({ erro: "Nome e contato sao obrigatorios." })

      const codigo = gerarCodigo()
      const chave = `passageiro:${contato}`
      await codigosPendentes.set(chave, { codigo, expira: Date.now() + 10 * 60 * 1000 })

      if (email) {
        await enviarEmail({
          from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Confirmacao de embarque — ViaPlan",
          html: templateEmail(
            "Use o codigo abaixo para confirmar sua identidade na reserva.",
            "Verificacao de passageiro",
            nome,
            codigo
          )
        })
      }

      if (process.env.NODE_ENV !== "production") {
        console.log(`Codigo para ${contato}: ${codigo}`)
      }

      res.json({ msg: "Codigo enviado com sucesso." })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao enviar codigo." })
    }
  })

  app.post("/passageiros/verificar-codigo", async (req, res) => {
    try {
      const { email, celular, codigo } = req.body
      const contato = email || celular
      if (!contato || !codigo) return res.status(400).json({ erro: "Dados incompletos." })

      const chave = `passageiro:${contato}`
      const pendente = await codigosPendentes.get(chave)
      if (!pendente) return res.status(400).json({ erro: "Nenhum codigo pendente. Solicite um novo." })
      if (Date.now() > pendente.expira) {
        await codigosPendentes.delete(chave)
        return res.status(400).json({ erro: "Codigo expirado. Solicite um novo." })
      }
      if (pendente.codigo !== codigo) return res.status(400).json({ erro: "Codigo incorreto." })

      await codigosPendentes.delete(chave)
      res.json({ msg: "Verificado com sucesso!" })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao verificar codigo." })
    }
  })

  // =====================================================
  // USUÁRIOS
  // =====================================================

  app.post("/usuarios", async (req, res) => {
    try {
      const usuario = new Usuario(req.body)
      await usuario.save()
      await notificarSeguro(notificarContaCriada, transporter, usuario)
      res.json(usuario)
    } catch (e) { res.status(500).json(e) }
  })

  app.get("/usuarios", async (req, res) => {
    try {
      const usuarios = await Usuario.find()
      res.json(usuarios)
    } catch (e) { res.status(500).json({ erro: "Erro ao buscar usuários" }) }
  })

  app.get("/usuarios/:id", async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.params.id)
      res.json(usuario)
    } catch (e) { res.status(500).json({ erro: "Erro ao buscar usuário" }) }
  })

  app.get("/usuarios/:id/perfil-completo", async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.params.id)
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" })

      const viagens = await Viagem.find({ email: usuario.email }).sort({ createdAt: -1 })
      const comentarios = await Comentario.find({ usuarioId: usuario._id }).sort({ data: -1 })

      res.json({ usuario, viagens, comentarios })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao buscar perfil completo" })
    }
  })

  app.put("/usuarios/foto/:id", upload.single("foto"), async (req, res) => {
    try {
      const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        { foto: `/uploads/perfis/${req.file.filename}` },
        { new: true }
      )
      res.json(usuario)
    } catch (e) { res.status(500).json({ erro: "Erro ao salvar foto" }) }
  })

  app.put("/usuarios/:id", async (req, res) => {
    try {
      const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true })
      res.json(usuario)
    } catch (e) { res.status(500).json({ erro: "Erro ao atualizar usuário" }) }
  })

  app.delete("/usuarios/:id", async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.params.id)
      if (usuario) {
        await notificarSeguro(notificarContaExcluida, transporter, usuario)
      }
      await Usuario.findByIdAndDelete(req.params.id)
      res.json({ msg: "Usuário excluído" })
    } catch (e) { res.status(500).json({ erro: "Erro ao excluir usuário" }) }
  })

  // =====================================================
  // LOGIN
  // =====================================================

  app.post("/login", async (req, res) => {
    try {
      const { email, senha } = req.body
      const usuario = await Usuario.findOne({ email })
      if (!usuario) return res.status(401).json({ msg: "Dados inválidos" })
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
      if (!senhaCorreta) return res.status(401).json({ msg: "Dados inválidos" })

      const token = `token-${usuario._id}-${Date.now()}`
      res.json({ usuario, token })
    } catch (e) {
      res.status(500).json({ erro: "Erro no login" })
    }
  })

  // =====================================================
  // VIAGENS
  // =====================================================

  app.post("/viagens", async (req, res) => {
    try {
      const { destino, pessoas } = req.body
      // Normaliza assentos: o frontend envia strings simples ("1A", "3C"),
      // mas o schema espera objetos { numero, tipo, precoExtra }
      let assentos = Array.isArray(req.body.assentos) ? req.body.assentos.map(a => {
        if (typeof a === "string") {
          const row = parseInt(a)
          const tipo = row <= 2 ? "first-class" : row <= 5 ? "business" : "economy"
          return { numero: a, tipo, precoExtra: 0 }
        }
        return a
      }) : []

      let extra = assentos.reduce((acc, a) => acc + (a.precoExtra || 0), 0)
      const destinoDB = await Destino.findOne({ nome: destino })
      const precoBase = destinoDB ? destinoDB.preco : 0
      const precoTotal = (precoBase * pessoas) + extra

      // Garante que nome/email no raiz venham do primeiro passageiro (titular)
      // ou, como fallback definitivo, do usuário logado via userid no header
      const passageiros = Array.isArray(req.body.passageiros) ? req.body.passageiros : []
      const titular = passageiros[0] || {}

      let emailFinal = req.body.email || titular.email || ""
      let nomeFinal  = req.body.nome  || titular.nome  || ""

      // Sempre sobrescreve com o email/nome da conta logada (mais confiável)
      // Garante que a viagem seja encontrada pelo perfil do usuário
      if (req.headers.userid) {
        try {
          const usuarioLogado = await Usuario.findById(req.headers.userid).lean()
          if (usuarioLogado?.email) emailFinal = usuarioLogado.email
          if (usuarioLogado?.nome) nomeFinal = usuarioLogado.nome
        } catch {}
      }

      const nome  = nomeFinal
      const email = emailFinal

      // ── Verifica conflito de assentos ──────────────────────────────────────
      // Antes de salvar, busca viagens existentes para o mesmo voo e rejeita
      // se algum assento escolhido já estiver ocupado.
      const numerosEscolhidos = assentos.map(a => a.numero)
      if (numerosEscolhidos.length > 0) {
        const viagensExistentes = await Viagem.find({
          destino,
          dataIda: req.body.dataIda,
          status: { $ne: "cancelada" }
        }).lean()

        const ocupados = []
        viagensExistentes.forEach(v => {
          if (Array.isArray(v.assentos)) {
            v.assentos.forEach(a => {
              const num = typeof a === "string" ? a : a?.numero
              if (num) ocupados.push(num)
            })
          }
        })

        const conflitos = numerosEscolhidos.filter(n => ocupados.includes(n))
        if (conflitos.length > 0) {
          return res.status(409).json({
            erro: `Assento(s) já reservado(s): ${conflitos.join(", ")}. Por favor, escolha outro(s).`,
            conflitos
          })
        }
      }
      // ───────────────────────────────────────────────────────────────────────

      const viagem = new Viagem({ ...req.body, nome, email, passageiros, assentos, precoTotal, status: "aguardando" })
      await viagem.save()
      console.log(`[POST /viagens] salvo _id=${viagem._id} destino="${viagem.destino}" dataIda="${viagem.dataIda}" assentos=`, JSON.stringify(viagem.assentos))

      await enviarEmail({
        from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
        to: viagem.email,
        subject: "⏳ Pagamento pendente",
        html: `<h2>Pagamento pendente</h2><p>Destino: <b>${viagem.destino}</b></p><p>Total: <b>R$ ${precoTotal}</b></p>`
      })

      await notificarSeguro(notificarViagemAgendada, transporter, viagem)

      res.json({ msg: "Viagem criada", viagem })
    } catch (e) {
      console.log(e)
      res.status(500).json({ erro: "Erro ao salvar viagem" })
    }
  })

  app.post("/viagens/pagar/:id", async (req, res) => {
    try {
      const viagem = await Viagem.findById(req.params.id)
      if (!viagem) return res.status(404).json({ erro: "Viagem não encontrada" })
      if (viagem.status === "pago") return res.status(400).json({ erro: "Essa viagem já foi paga" })

      const body = req.body || {}
      if (body.passageiros && Array.isArray(body.passageiros)) {
        viagem.passageiros = body.passageiros
      }
      // Só sobrescreve assentos se o body enviar um array NÃO-vazio.
      // Isso evita que o Pagamentos.vue apague os assentos já reservados.
      if (body.assentos && Array.isArray(body.assentos) && body.assentos.length > 0) {
        viagem.assentos = body.assentos
      }

      viagem.status = "pago"
      await viagem.save()

      await enviarEmail({
        from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
        to: viagem.email,
        subject: "✅ Pagamento confirmado",
        html: `<h2>Pagamento confirmado</h2><p>Destino: <b>${viagem.destino}</b></p>`
      })

      res.json({ msg: "Pagamento confirmado", viagem })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao pagar", detalhe: e.message })
    }
  })

  app.put("/viagens/:id/cancelar", async (req, res) => {
    try {
      const viagem = await Viagem.findById(req.params.id)
      if (!viagem) return res.status(404).json({ erro: "Viagem não encontrada" })
      if (viagem.status !== "aguardando") return res.status(400).json({ erro: "Só é possível cancelar viagens pendentes" })

      viagem.status = "cancelado"
      await viagem.save()

      await enviarEmail({
        from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
        to: viagem.email,
        subject: "❌ Reserva cancelada — ViaPlan",
        html: `
          <div style="background:#0d0f14;padding:40px 20px;font-family:'Segoe UI',sans-serif">
            <div style="max-width:480px;margin:0 auto;background:#111318;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px">
              <p style="color:#94a3b8;font-size:15px">Sua reserva para <strong style="color:#e2e8f0">${viagem.destino}</strong> foi cancelada com sucesso.</p>
            </div>
          </div>
        `
      }).catch(() => {})

      await notificarSeguro(notificarViagemCancelada, transporter, viagem)

      res.json({ msg: "Viagem cancelada com sucesso", viagem })
    } catch (e) {
      console.log(e)
      res.status(500).json({ erro: "Erro ao cancelar viagem" })
    }
  })

  app.put("/viagens/:id/reagendar", async (req, res) => {
    try {
      const { dataIda, dataVolta } = req.body
      if (!dataIda || !dataVolta) return res.status(400).json({ erro: "Datas de ida e volta são obrigatórias." })

      const viagem = await Viagem.findById(req.params.id)
      if (!viagem) return res.status(404).json({ erro: "Viagem não encontrada." })
      if (viagem.status !== "pago") return res.status(400).json({ erro: "Só é possível reagendar viagens confirmadas." })

      viagem.dataIda   = dataIda
      viagem.dataVolta = dataVolta
      await viagem.save()

      await enviarEmail({
        from: `"ViaPlan ✈️" <${process.env.EMAIL_USER}>`,
        to: viagem.email,
        subject: "📅 Viagem reagendada — ViaPlan",
        html: `
          <div style="background:#0d0f14;padding:40px 20px;font-family:'Segoe UI',sans-serif">
            <div style="max-width:480px;margin:0 auto;background:#111318;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px">
              <p style="color:#94a3b8;font-size:15px">Sua viagem para <strong style="color:#e2e8f0">${viagem.destino}</strong> foi reagendada!</p>
              <p style="color:#c49b50;font-size:16px;font-weight:700;margin-top:16px">
                ${dataIda.split('-').reverse().join('/')} → ${dataVolta.split('-').reverse().join('/')}
              </p>
            </div>
          </div>
        `
      }).catch(() => {})

      res.json({ msg: "Viagem reagendada com sucesso.", viagem })
    } catch (e) {
      console.log(e)
      res.status(500).json({ erro: "Erro ao reagendar viagem." })
    }
  })

  app.get("/viagens", async (req, res) => {
    try {
      const { email, admin } = req.query
      const userid = req.headers.userid

      // Se ?admin=true, valida que o usuário é admin e retorna todas as viagens
      if (admin === "true" && userid) {
        try {
          const usuarioReq = await Usuario.findById(userid).lean()
          if (usuarioReq?.admin) {
            const viagens = await Viagem.find().sort({ createdAt: -1 })
            return res.json(viagens)
          }
        } catch {}
      }

      // Tenta resolver email pelo userid do header
      let emailUsuario = email || null
      if (userid) {
        try {
          const usuario = await Usuario.findById(userid).lean()
          if (usuario?.email) emailUsuario = usuario.email
        } catch {}
      }

      // Busca por email do usuário logado: campo raiz OU qualquer passageiro
      if (emailUsuario) {
        const viagens = await Viagem.find({
          $or: [
            { email: emailUsuario },
            { "passageiros.email": emailUsuario }
          ]
        }).sort({ createdAt: -1 })
        return res.json(viagens)
      }

      // Sem filtro: retorna todas (fallback)
      const viagens = await Viagem.find().sort({ createdAt: -1 })
      res.json(viagens)
    } catch (e) { res.status(500).json({ erro: "Erro ao buscar viagens" }) }
  })

  app.get("/viagens/:id", async (req, res) => {
    try {
      const viagem = await Viagem.findById(req.params.id)
      res.json(viagem)
    } catch (e) { res.status(500).json({ erro: "Erro ao buscar viagem" }) }
  })

  app.delete("/viagens/:id", verificarAdmin, async (req, res) => {
    try {
      await Viagem.findByIdAndDelete(req.params.id)
      res.json({ msg: "Viagem excluída" })
    } catch (e) { res.status(500).json({ erro: "Erro ao excluir viagem" }) }
  })

  // =====================================================
  // COMENTÁRIOS
  // =====================================================

  app.post("/comentarios", async (req, res) => {
    try {
      const comentario = new Comentario(req.body)
      await comentario.save()
      const usuario = await Usuario.findById(comentario.usuarioId)
      await notificarSeguro(notificarComentarioCriado, transporter, comentario, usuario)
      res.json({ msg: "Comentário salvo", comentario })
    } catch (e) { res.status(500).json({ erro: "Erro ao salvar comentário" }) }
  })

  app.get("/comentarios", async (req, res) => {
    try {
      const comentarios = await Comentario.find().sort({ data: -1 })
      res.json(comentarios)
    } catch (e) { res.status(500).json({ erro: "Erro ao buscar comentários" }) }
  })

  app.delete("/comentarios/:id", async (req, res) => {
    try {
      const userId = req.headers.userid
      if (!userId) return res.status(401).json({ msg: "Não autorizado" })

      const comentario = await Comentario.findById(req.params.id)
      if (!comentario) return res.status(404).json({ msg: "Comentário não encontrado" })

      const usuario = await Usuario.findById(userId)
      if (!usuario) return res.status(401).json({ msg: "Usuário não encontrado" })

      const isAdmin = usuario.admin === true
      const isOwner = String(comentario.usuarioId) === String(userId)

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ msg: "Você não tem permissão para excluir este comentário" })
      }

      await Comentario.findByIdAndDelete(req.params.id)
      res.json({ msg: "Comentário excluído com sucesso" })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao excluir comentário" })
    }
  })

  // =====================================================
  // DESTINOS
  // =====================================================

  app.post("/destinos", verificarAdmin, uploadDestinos.single("imagem"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ erro: "Imagem obrigatória" })

      let itensInclusos = []
      if (req.body.itensInclusos) {
        try { itensInclusos = JSON.parse(req.body.itensInclusos) } catch (e) { itensInclusos = [] }
      }

      const destino = new Destino({
        nome:               req.body.nome || "",
        descricao:          req.body.descricao || "",
        preco:              Number(req.body.preco) || 0,
        aeroporto:          req.body.aeroporto || "",
        imagem:             `/uploads/destinos/${req.file.filename}`,
        hotelIncluso:       req.body.hotelIncluso === "true" || req.body.hotelIncluso === true,
        cafeDaManhaIncluso: req.body.cafeDaManhaIncluso === "true" || req.body.cafeDaManhaIncluso === true,
        itensInclusos,
        duracaoDias:        Number(req.body.duracaoDias) || 1,
        categoria:          req.body.categoria || "nacional"
      })

      await destino.save()
      await notificarSeguro(notificarDestinoCriado, transporter, destino)

      res.json({ msg: "Destino criado com sucesso", destino })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao criar destino" })
    }
  })

  app.get("/destinos", async (req, res) => {
    try {
      const destinos = await Destino.find()
      res.json(destinos)
    } catch (e) { res.status(500).json({ erro: "Erro ao buscar destinos" }) }
  })

  app.get("/destinos/:id", async (req, res) => {
    try {
      const destino = await Destino.findById(req.params.id)
      if (!destino) return res.status(404).json({ erro: "Destino não encontrado" })
      res.json(destino)
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao buscar destino" })
    }
  })

  app.put("/destinos/:id", verificarAdmin, uploadDestinos.single("imagem"), async (req, res) => {
    try {
      const { id } = req.params
      const destinoExistente = await Destino.findById(id)
      if (!destinoExistente) return res.status(404).json({ erro: "Destino não encontrado" })

      const dadosAtualizacao = {
        nome:      req.body.nome      || destinoExistente.nome,
        descricao: req.body.descricao || destinoExistente.descricao,
        preco:     Number(req.body.preco) || destinoExistente.preco,
        aeroporto: req.body.aeroporto || destinoExistente.aeroporto
      }

      if (req.file) {
        dadosAtualizacao.imagem = `/uploads/destinos/${req.file.filename}`
        const imagemAntiga = destinoExistente.imagem
        if (imagemAntiga && imagemAntiga.startsWith("/uploads/")) {
          const caminhoAntigo = path.join(__dirname, imagemAntiga)
          if (fs.existsSync(caminhoAntigo)) fs.unlinkSync(caminhoAntigo)
        }
      }

      const destinoAtualizado = await Destino.findByIdAndUpdate(id, dadosAtualizacao, { new: true })
      res.json({ msg: "Destino atualizado com sucesso", destino: destinoAtualizado })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao atualizar destino" })
    }
  })

  app.delete("/destinos/:id", verificarAdmin, async (req, res) => {
    try {
      const destino = await Destino.findById(req.params.id)
      if (destino) {
        await notificarSeguro(notificarDestinoExcluido, transporter, destino)
      }
      await Destino.findByIdAndDelete(req.params.id)
      res.json({ msg: "Destino removido" })
    } catch (e) { res.status(500).json({ erro: "Erro ao remover destino" }) }
  })

  // =====================================================
  // CHATBOT — Proxy para API Groq
  // =====================================================

  app.post("/chatbot", async (req, res) => {
    try {
      const { messages } = req.body
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ erro: "Mensagens inválidas." })
      }

      const destinos = await Destino.find().lean()

      // Detecta preço máximo mencionado na mensagem do usuário
      const ultimaMensagem = [...messages].reverse().find(m => m.role === 'user')?.content?.toLowerCase() || ''
      const matchPreco = ultimaMensagem.match(/(\d[\d.,]*)/g)
      const precoMax = matchPreco ? Math.max(...matchPreco.map(v => parseFloat(v.replace(/\./g, '').replace(',', '.')))) : null

      // Filtra destinos por preço se mencionado, senão usa os 15 primeiros
      let destinosFiltrados = precoMax && precoMax > 100
        ? destinos.filter(d => Number(d.preco) <= precoMax)
        : destinos
      destinosFiltrados = destinosFiltrados.slice(0, 15)

      // Formato compacto para economizar tokens
      const destinosTexto = destinosFiltrados.map(function(d) {
        return d.nome + '|R$' + Number(d.preco) + '|' + d.duracaoDias + 'd|' + d.categoria +
          '|hotel:' + (d.hotelIncluso ? 'sim' : 'nao') + '|av:' + d.avaliacao
      }).join('\n')

      const systemPrompt = 'Assistente da ViaPlan (agencia BR). Responda em portugues, curto e direto.\n\n' +
        'DESTINOS:\n' + destinosTexto + '\n\n' +
        'REGRAS: use so os dados acima; valores em R$; para reservas diga para acessar /Destinos; max 4 linhas; nunca invente.'

      // Garante alternância estrita user/assistant começando com 'user'
      const filtered = messages.filter(m => m.role !== 'system')
      const apiMessages = []
      let lastRole = null
      for (const msg of filtered) {
        if (msg.role === lastRole) continue
        if (apiMessages.length === 0 && msg.role !== 'user') continue
        apiMessages.push({ role: msg.role, content: msg.content })
        lastRole = msg.role
      }
      while (apiMessages.length > 0 && apiMessages[apiMessages.length - 1].role === 'assistant') {
        apiMessages.pop()
      }
      const finalMessages = apiMessages.slice(-6)

      const groqKey = process.env.GROQ_API_KEY
      if (!groqKey) throw new Error("GROQ_API_KEY não configurada no .env")

      console.log("🤖 Chamando Groq com", apiMessages.length, "mensagens")

      const groqResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          max_tokens: 800,
          messages: [
            { role: "system", content: systemPrompt },
            ...finalMessages
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          timeout: 15000
        }
      )

      const reply = groqResponse.data.choices?.[0]?.message?.content
      res.json({ reply: reply || "Desculpe, não consegui processar sua pergunta." })

    } catch (e) {
      const erroDetalhe = e?.response?.data || e.message
      console.error("❌ Erro no chatbot:", JSON.stringify(erroDetalhe, null, 2))
      console.error("❌ Status Groq:", e?.response?.status)
      res.status(500).json({ erro: "Erro ao processar mensagem do chatbot.", detalhe: erroDetalhe })
    }
  })

  // =====================================================
  // ASSENTOS OCUPADOS — Retorna assentos reais do banco
  // =====================================================

  /**
   * GET /assentos-ocupados?destino=Paris, França&dataIda=2026-07-15
   *
   * Busca todas as viagens (status != 'cancelada') para o destino + dataIda
   * informados e devolve a lista de números de assento já reservados,
   * impedindo que outro usuário escolha o mesmo lugar.
   */
  app.get("/assentos-ocupados", async (req, res) => {
    try {
      const destino = (req.query.destino || "").trim()
      const dataIda  = (req.query.dataIda  || "").trim()

      if (!destino || !dataIda) {
        return res.status(400).json({ erro: "Informe destino e dataIda" })
      }

      // Busca todas as viagens não-canceladas para este destino + data
      const viagens = await Viagem.find({
        destino: { $regex: new RegExp("^" + destino.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i") },
        dataIda:  dataIda,
        status:  { $ne: "cancelada" }
      }).lean()

      console.log(`[assentos-ocupados] destino="${destino}" dataIda="${dataIda}" => ${viagens.length} viagem(ns) encontrada(s)`)
      viagens.forEach(v => {
        console.log(`  viagem _id=${v._id} status=${v.status} assentos=`, JSON.stringify(v.assentos))
      })

      // Coleta todos os números de assento reservados nesse voo
      const ocupados = []
      viagens.forEach(v => {
        if (Array.isArray(v.assentos)) {
          v.assentos.forEach(a => {
            const num = typeof a === "string" ? a : a?.numero
            if (num) ocupados.push(num)
          })
        }
      })

      console.log(`[assentos-ocupados] ocupados:`, ocupados)
      res.json({ ocupados })
    } catch (e) {
      console.error("Erro ao buscar assentos ocupados:", e)
      res.status(500).json({ erro: "Erro ao buscar assentos ocupados" })
    }
  })

  // =====================================================
  // CUPONS
  // =====================================================

  const CupomUsuario = require("./models/Cupom")

  // Catálogo de cupons disponíveis para resgate
  const CUPONS_DISPONIVEIS = [
    {
      codigo:    "VIAPLAN10",
      nome:      "Desconto de Boas-Vindas",
      desconto:  10,
      descricao: "10% de desconto em qualquer viagem"
    },
    {
      codigo:    "VIAJANTE5",
      nome:      "Desconto Explorador",
      desconto:  5,
      descricao: "5% de desconto para quem está começando a explorar o mundo"
    },
    {
      codigo:    "FERIAS15",
      nome:      "Promoção Férias",
      desconto:  15,
      descricao: "15% de desconto especial para a temporada de férias"
    },
    {
      codigo:    "PRIMEIRA8",
      nome:      "Primeira Aventura",
      desconto:  8,
      descricao: "8% de desconto na sua primeira reserva conosco"
    },
    {
      codigo:    "FIDELIDADE12",
      nome:      "Programa Fidelidade",
      desconto:  12,
      descricao: "12% de desconto para clientes fiéis da ViaPlan"
    },
    {
      codigo:    "VERAO20",
      nome:      "Especial Verão",
      desconto:  20,
      descricao: "20% de desconto para viagens no verão — aproveite!"
    },
    {
      codigo:    "SONHO7",
      nome:      "Viagem dos Sonhos",
      desconto:  7,
      descricao: "7% de desconto para tornar sua viagem dos sonhos realidade"
    },
    {
      codigo:    "CASAL18",
      nome:      "Escapada a Dois",
      desconto:  18,
      descricao: "18% de desconto para viagens em dupla — romance garantido"
    },
    {
      codigo:    "FAMILIA10",
      nome:      "Desconto Família",
      desconto:  10,
      descricao: "10% de desconto para viagens em família — quanto mais, melhor!"
    },
    {
      codigo:    "ANIVER25",
      nome:      "Aniversário ViaPlan",
      desconto:  25,
      descricao: "25% de desconto comemorativo — oferta por tempo limitado!"
    }
  ]

  // GET /cupons/disponiveis — lista cupons que o usuário ainda pode resgatar
  app.get("/cupons/disponiveis", async (req, res) => {
    try {
      const userId = req.headers.userid
      if (!userId) return res.status(401).json({ erro: "Não autorizado" })

      // Busca quais cupons este usuário já resgatou
      const jaResgatados = await CupomUsuario.find({ usuarioId: userId }).lean()
      const codigosResgatados = jaResgatados.map(c => c.codigo)

      const disponiveis = CUPONS_DISPONIVEIS.filter(c => !codigosResgatados.includes(c.codigo))
      res.json(disponiveis)
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao buscar cupons" })
    }
  })

  // GET /cupons/meus — lista cupons já resgatados pelo usuário
  app.get("/cupons/meus", async (req, res) => {
    try {
      const userId = req.headers.userid
      if (!userId) return res.status(401).json({ erro: "Não autorizado" })

      const cupons = await CupomUsuario.find({ usuarioId: userId }).sort({ resgatadoEm: -1 })
      res.json(cupons)
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao buscar cupons" })
    }
  })

  // POST /cupons/resgatar — resgata um cupom para a conta do usuário
  app.post("/cupons/resgatar", async (req, res) => {
    try {
      const userId = req.headers.userid
      if (!userId) return res.status(401).json({ erro: "Não autorizado" })

      const { codigo } = req.body
      if (!codigo) return res.status(400).json({ erro: "Código do cupom obrigatório" })

      const cupomBase = CUPONS_DISPONIVEIS.find(c => c.codigo === codigo.trim().toUpperCase())
      if (!cupomBase) return res.status(404).json({ erro: "Cupom não encontrado" })

      const existente = await CupomUsuario.findOne({ usuarioId: userId, codigo: cupomBase.codigo })
      if (existente) return res.status(409).json({ erro: "Você já resgatou este cupom" })

      const cupom = new CupomUsuario({
        usuarioId:  userId,
        codigo:     cupomBase.codigo,
        nome:       cupomBase.nome,
        desconto:   cupomBase.desconto,
        status:     "disponivel"
      })
      await cupom.save()

      res.json({ msg: "Cupom resgatado com sucesso!", cupom })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao resgatar cupom" })
    }
  })

  // POST /cupons/validar — valida e retorna dados do cupom para uso no pagamento
  app.post("/cupons/validar", async (req, res) => {
    try {
      const userId = req.headers.userid
      if (!userId) return res.status(401).json({ erro: "Não autorizado" })

      const { codigo } = req.body
      if (!codigo) return res.status(400).json({ erro: "Código obrigatório" })

      const cupom = await CupomUsuario.findOne({
        usuarioId: userId,
        codigo:    codigo.trim().toUpperCase(),
        status:    "disponivel"
      })

      if (!cupom) return res.status(404).json({ erro: "Cupom inválido ou já utilizado" })

      res.json({ valido: true, cupom })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao validar cupom" })
    }
  })

  // POST /cupons/utilizar/:id — marca cupom como utilizado após pagamento confirmado
  app.post("/cupons/utilizar/:id", async (req, res) => {
    try {
      const userId = req.headers.userid
      if (!userId) return res.status(401).json({ erro: "Não autorizado" })

      const cupom = await CupomUsuario.findOne({ _id: req.params.id, usuarioId: userId })
      if (!cupom) return res.status(404).json({ erro: "Cupom não encontrado" })
      if (cupom.status === "utilizado") return res.status(400).json({ erro: "Cupom já utilizado" })

      cupom.status = "utilizado"
      cupom.utilizadoEm = new Date()
      await cupom.save()

      res.json({ msg: "Cupom marcado como utilizado", cupom })
    } catch (e) {
      console.error(e)
      res.status(500).json({ erro: "Erro ao utilizar cupom" })
    }
  })

  // =====================================================

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
  })