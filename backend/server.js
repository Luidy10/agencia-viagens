require("dotenv").config()

const Destino = require("./models/Destino")
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { Resend } = require("resend")
const axios = require("axios")

const resend = new Resend(process.env.RESEND_API_KEY)

const app = express()

app.use(cors())
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

// =====================================================
// ARMAZENAMENTO TEMPORÁRIO DE CÓDIGOS
// =====================================================
const codigosPendentes = new Map()

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
    codigosPendentes.set(`cadastro:${email}`, {
      codigo,
      nome,
      expira: Date.now() + 10 * 60 * 1000
    })

    await resend.emails.send({
      from: "ViaPlan <onboarding@resend.dev>",
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
    const { email, codigo, nome, senha } = req.body
    if (!email || !codigo || !nome || !senha) return res.status(400).json({ erro: "Dados incompletos." })

    const chave = `cadastro:${email}`
    const pendente = codigosPendentes.get(chave)
    if (!pendente) return res.status(400).json({ erro: "Nenhum código pendente para este email. Solicite um novo." })
    if (Date.now() > pendente.expira) { codigosPendentes.delete(chave); return res.status(400).json({ erro: "Código expirado. Solicite um novo." }) }
    if (pendente.codigo !== codigo) return res.status(400).json({ erro: "Código incorreto." })

    const existente = await Usuario.findOne({ email })
    if (existente) { codigosPendentes.delete(chave); return res.status(409).json({ erro: "Este email já está cadastrado." }) }

    const usuario = new Usuario({ nome, email, senha })
    await usuario.save()
    codigosPendentes.delete(chave)

    resend.emails.send({
      from: "ViaPlan <onboarding@resend.dev>",
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
    if (usuario.senha !== senhaAtual) return res.status(401).json({ erro: "Senha atual incorreta." })

    usuario.senha = novaSenha
    await usuario.save()

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
    codigosPendentes.set(`senha:${usuario._id}`, {
      codigo,
      expira: Date.now() + 10 * 60 * 1000
    })

    await resend.emails.send({
      from: "ViaPlan <onboarding@resend.dev>",
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
    const pendente = codigosPendentes.get(chave)
    if (!pendente) return res.status(400).json({ erro: "Nenhum código pendente. Solicite um novo." })
    if (Date.now() > pendente.expira) { codigosPendentes.delete(chave); return res.status(400).json({ erro: "Código expirado. Solicite um novo." }) }
    if (pendente.codigo !== codigo) return res.status(400).json({ erro: "Código incorreto." })

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, { senha: novaSenha }, { new: true })
    codigosPendentes.delete(chave)

    res.json({ msg: "Senha redefinida com sucesso!", usuario })
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao redefinir senha." })
  }
})

// =====================================================
// TROCAR EMAIL — por código enviado ao email atual
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
    codigosPendentes.set(`email:${req.params.id}`, {
      codigo,
      novoEmail,
      expira: Date.now() + 10 * 60 * 1000
    })

    await resend.emails.send({
      from: "ViaPlan <onboarding@resend.dev>",
      to: usuario.email,
      subject: "📧 Confirmação de troca de email — ViaPlan",
      html: templateEmail(
        `Use o código abaixo para confirmar a troca para <strong style="color:#c49b50">${novoEmail}</strong>.`,
        "Troca de email",
        usuario.nome,
        codigo,
        "Se você não solicitou a troca de email, sua conta pode estar em risco. Entre em contato conosco."
      )
    })

    res.json({ msg: "Código enviado para seu email atual." })
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
    const pendente = codigosPendentes.get(chave)
    if (!pendente) return res.status(400).json({ erro: "Nenhum código pendente. Solicite um novo." })
    if (Date.now() > pendente.expira) { codigosPendentes.delete(chave); return res.status(400).json({ erro: "Código expirado. Solicite um novo." }) }
    if (pendente.codigo !== codigo) return res.status(400).json({ erro: "Código incorreto." })

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { email: pendente.novoEmail },
      { new: true }
    )
    codigosPendentes.delete(chave)

    res.json({ msg: "Email atualizado com sucesso!", usuario })
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao atualizar email." })
  }
})

// =====================================================
// USUÁRIOS
// =====================================================

app.post("/usuarios", async (req, res) => {
  try {
    const usuario = new Usuario(req.body)
    await usuario.save()
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
    const usuario = await Usuario.findOne({ email, senha })
    if (!usuario) return res.status(401).json({ msg: "Dados inválidos" })

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
    const { assentos, destino, pessoas } = req.body
    let extra = 0
    if (assentos && assentos.length) {
      extra = assentos.reduce((acc, a) => acc + (a.precoExtra || 0), 0)
    }
    const destinoDB = await Destino.findOne({ nome: destino })
    const precoBase = destinoDB ? destinoDB.preco : 0
    const precoTotal = (precoBase * pessoas) + extra

    const viagem = new Viagem({ ...req.body, precoTotal, status: "aguardando" })
    await viagem.save()

    resend.emails.send({
      from: "ViaPlan <onboarding@resend.dev>",
      to: viagem.email,
      subject: "⏳ Pagamento pendente",
      html: `<h2>Pagamento pendente</h2><p>Destino: <b>${viagem.destino}</b></p><p>Total: <b>R$ ${precoTotal}</b></p>`
    }).catch(() => {})

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

    viagem.status = "pago"
    await viagem.save()

    resend.emails.send({
      from: "ViaPlan <onboarding@resend.dev>",
      to: viagem.email,
      subject: "✅ Pagamento confirmado",
      html: `<h2>Pagamento confirmado</h2><p>Destino: <b>${viagem.destino}</b></p>`
    }).catch(() => {})

    res.json({ msg: "Pagamento confirmado", viagem })
  } catch (e) {
    console.log(e)
    res.status(500).json({ erro: "Erro ao pagar" })
  }
})

app.put("/viagens/:id/cancelar", async (req, res) => {
  try {
    const viagem = await Viagem.findById(req.params.id)
    if (!viagem) return res.status(404).json({ erro: "Viagem não encontrada" })
    if (viagem.status !== "aguardando") return res.status(400).json({ erro: "Só é possível cancelar viagens pendentes" })

    viagem.status = "cancelado"
    await viagem.save()

    resend.emails.send({
      from: "ViaPlan <onboarding@resend.dev>",
      to: viagem.email,
      subject: "❌ Reserva cancelada — ViaPlan",
      html: `
        <div style="background:#0d0f14;padding:40px 20px;font-family:'Segoe UI',sans-serif">
          <div style="max-width:480px;margin:0 auto;background:#111318;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px">
            <div style="text-align:center;margin-bottom:24px">
              <div style="font-size:28px;color:#c49b50">✦</div>
              <h1 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:8px 0 0">Via<em style="font-style:italic;color:#c49b50">Plan</em></h1>
            </div>
            <p style="color:#94a3b8;font-size:15px">Sua reserva para <strong style="color:#e2e8f0">${viagem.destino}</strong> foi cancelada com sucesso.</p>
            <p style="color:#64748b;font-size:13px;margin-top:12px">Se foi um engano, entre em contato com nosso suporte.</p>
          </div>
        </div>
      `
    }).catch(() => {})

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

    viagem.dataIda  = dataIda
    viagem.dataVolta = dataVolta
    await viagem.save()

    resend.emails.send({
      from: "ViaPlan <onboarding@resend.dev>",
      to: viagem.email,
      subject: "📅 Viagem reagendada — ViaPlan",
      html: `
        <div style="background:#0d0f14;padding:40px 20px;font-family:'Segoe UI',sans-serif">
          <div style="max-width:480px;margin:0 auto;background:#111318;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px">
            <div style="text-align:center;margin-bottom:24px">
              <div style="font-size:28px;color:#c49b50">✦</div>
              <h1 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:8px 0 0">Via<em style="font-style:italic;color:#c49b50">Plan</em></h1>
            </div>
            <p style="color:#94a3b8;font-size:15px">Sua viagem para <strong style="color:#e2e8f0">${viagem.destino}</strong> foi reagendada com sucesso!</p>
            <div style="margin-top:20px;padding:16px;background:#0d0f14;border:1px solid rgba(196,155,80,.2);border-radius:12px">
              <p style="color:#475569;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 10px">Novas datas</p>
              <p style="color:#c49b50;font-size:16px;font-weight:700;margin:0">
                ${dataIda.split('-').reverse().join('/')} → ${dataVolta.split('-').reverse().join('/')}
              </p>
            </div>
            <p style="color:#64748b;font-size:13px;margin-top:16px">Se não foi você, entre em contato com nosso suporte.</p>
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
    const viagens = await Viagem.find()
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
    await Destino.findByIdAndDelete(req.params.id)
    res.json({ msg: "Destino removido" })
  } catch (e) { res.status(500).json({ erro: "Erro ao remover destino" }) }
})

// =====================================================
// CHATBOT
// =====================================================

app.post("/chatbot", async (req, res) => {
  try {
    const { messages } = req.body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ erro: "Mensagens inválidas." })
    }

    const apiKey = process.env.GROQ_API_KEY
    console.log("🔑 Groq Key:", apiKey ? apiKey.substring(0, 12) + "..." : "❌ NÃO ENCONTRADA NO .ENV")

    const destinos = await Destino.find().lean()
    const destinosInfo = destinos.map(d => ({
      nome: d.nome,
      descricao: d.descricao,
      preco: d.preco,
      categoria: d.categoria,
      aeroporto: d.aeroporto,
      duracaoDias: d.duracaoDias,
      hotelIncluso: d.hotelIncluso,
      cafeDaManhaIncluso: d.cafeDaManhaIncluso,
      itensInclusos: d.itensInclusos,
      avaliacao: d.avaliacao
    }))

    const systemPrompt = `Você é o assistente virtual da ViaPlan, uma agência de viagens brasileira. Responda sempre em português, de forma amigável, clara e direta.\n\nDESTINOS DISPONÍVEIS ATUALMENTE:\n${JSON.stringify(destinosInfo, null, 2)}\n\nINFORMAÇÕES DA AGÊNCIA:\n- Nome: ViaPlan\n- Especialidade: Pacotes de viagem nacionais e internacionais\n- Para reservar: o usuário precisa estar logado e acessar a página de Destinos\n- Pagamento: realizado dentro da plataforma na finalização da reserva\n- Suporte: disponível via página de Contato\n\nINSTRUÇÕES:\n- Use os dados de destinos acima para responder perguntas sobre preços, locais, categorias, etc.\n- Formate valores em Reais: R$ X.XXX\n- Para reservas, direcione o usuário para a página /Destinos\n- Seja conciso: respostas entre 2-5 linhas quando possível\n- Use emojis com moderação\n- Nunca invente informações que não estão nos dados fornecidos`

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        max_tokens: 1000,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        }
      }
    )

    const reply = response.data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua pergunta."
    res.json({ reply })

  } catch (e) {
    const erroDetalhe = e?.response?.data || e.message
    console.error("❌ Erro no chatbot:", JSON.stringify(erroDetalhe, null, 2))
    res.status(500).json({ erro: "Erro ao processar mensagem do chatbot.", detalhe: erroDetalhe })
  }
})

// =====================================================

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})