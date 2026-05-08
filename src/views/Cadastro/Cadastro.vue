<template>
  <div class="cadastro-page">
    <div class="bg-grid"></div>

    <!-- ═══════════════════════════════════════════════════
         ETAPA 1 — FORMULÁRIO DE CADASTRO
    ════════════════════════════════════════════════════ -->
    <div v-if="etapa === 1" class="cadastro-card">

      <div class="card-header">
        <span class="logo-icon">⬡</span>
        <div class="header-text">
          <h1>Criar conta</h1>
          <p>Preencha os dados para se cadastrar</p>
        </div>
      </div>

      <form @submit.prevent="enviarCodigo">

        <div class="field">
          <label>Nome</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input v-model="form.nome" placeholder="Seu nome completo" required autocomplete="name"/>
          </div>
        </div>

        <div class="field">
          <label>Email</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </span>
            <input v-model="form.email" type="email" placeholder="seu@email.com" required autocomplete="email"/>
          </div>
        </div>

        <div class="field">
          <label>Senha</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              v-model="form.senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="Crie uma senha"
              required
              autocomplete="new-password"
            />
            <button type="button" class="toggle-senha" @click="mostrarSenha = !mostrarSenha" tabindex="-1">
              <svg v-if="!mostrarSenha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>

          <div v-if="form.senha.length > 0" class="senha-strength">
            <div class="strength-bars">
              <div
                v-for="i in 4" :key="i"
                class="strength-bar"
                :class="{ active: i <= forcaNivel, [`nivel-${forcaNivel}`]: i <= forcaNivel }"
              ></div>
            </div>
            <span class="strength-label" :class="`label-${forcaNivel}`">
              <span class="strength-dot" :class="`dot-${forcaNivel}`"></span>
              {{ forcaTexto }}
            </span>
          </div>

          <div v-if="form.senha.length > 0" class="senha-requisitos">
            <div class="req" :class="{ ok: req8chars }">
              <span class="req-icon">{{ req8chars ? '✓' : '·' }}</span>
              Mínimo 8 caracteres
            </div>
            <div class="req" :class="{ ok: reqMaiuscula }">
              <span class="req-icon">{{ reqMaiuscula ? '✓' : '·' }}</span>
              Letra maiúscula
            </div>
            <div class="req" :class="{ ok: reqNumero }">
              <span class="req-icon">{{ reqNumero ? '✓' : '·' }}</span>
              Um número
            </div>
            <div class="req" :class="{ ok: reqEspecial }">
              <span class="req-icon">{{ reqEspecial ? '✓' : '·' }}</span>
              Caractere especial
            </div>
          </div>

          <span v-if="form.senha.length > 0 && forcaNivel < 4" class="field-hint error senha-hint">
            A senha precisa atingir nível <strong>Muito forte</strong> para cadastrar.
          </span>
        </div>

        <div class="field">
          <label>Confirmar Senha</label>
          <div class="input-wrapper" :class="{ 'input-error': senhasDiferentes }">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <input
              v-model="form.confirmar"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="Repita a senha"
              required
              autocomplete="new-password"
              @input="senhasDiferentes = false"
            />
          </div>
          <span v-if="senhasDiferentes" class="field-hint error">As senhas não coincidem</span>
        </div>

        <button type="submit" class="btn-cadastrar" :disabled="enviando || forcaNivel < 4">
          <span v-if="enviando" class="spinner"></span>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 7l10 7 10-7"/>
          </svg>
          {{ enviando ? 'Enviando código...' : 'Enviar código de verificação' }}
        </button>

      </form>

      <transition name="fade">
        <div v-if="mensagem" :class="['toast', mensagem.tipo]">{{ mensagem.texto }}</div>
      </transition>

      <router-link to="/entrar" class="link-entrar">
        Já possui conta? <span>Entrar</span>
      </router-link>

    </div>

    <!-- ═══════════════════════════════════════════════════
         ETAPA 2 — VERIFICAÇÃO DO CÓDIGO
    ════════════════════════════════════════════════════ -->
    <div v-else-if="etapa === 2" class="cadastro-card verificacao-card">

      <div class="card-header">
        <div class="email-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 7l10 7 10-7"/>
          </svg>
        </div>
        <div class="header-text">
          <h1>Verifique seu email</h1>
          <p>Código enviado para <strong>{{ form.email }}</strong></p>
        </div>
      </div>

      <!-- INPUTS DO CÓDIGO -->
      <div class="codigo-wrap">
        <div class="codigo-inputs">
          <input
            v-for="(_, i) in codigoDigitos"
            :key="i"
            :ref="el => codigoRefs[i] = el"
            v-model="codigoDigitos[i]"
            class="codigo-input"
            :class="{
              filled: codigoDigitos[i],
              erro: codigoErro,
              sucesso: codigoSucesso
            }"
            maxlength="1"
            inputmode="numeric"
            pattern="[0-9]"
            autocomplete="off"
            @input="onDigitoInput(i, $event)"
            @keydown="onDigitoKeydown(i, $event)"
            @paste="onCodigoPaste($event)"
          />
        </div>

        <transition name="fade">
          <p v-if="codigoErro" class="codigo-erro-msg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Código incorreto. Tente novamente.
          </p>
        </transition>

        <transition name="fade">
          <p v-if="codigoSucesso" class="codigo-sucesso-msg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Código correto! Criando sua conta...
          </p>
        </transition>
      </div>

      <button
        class="btn-cadastrar"
        :disabled="salvando || codigoCompleto.length < 6"
        @click="confirmarCodigo"
      >
        <span v-if="salvando" class="spinner"></span>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ salvando ? 'Verificando...' : 'Confirmar código' }}
      </button>

      <!-- REENVIAR -->
      <div class="reenviar-wrap">
        <span class="reenviar-text">Não recebeu?</span>
        <button
          class="btn-reenviar"
          :disabled="cooldown > 0"
          @click="reenviarCodigo"
        >
          {{ cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código' }}
        </button>
      </div>

      <button class="btn-voltar" @click="voltarEtapa1">
        ← Voltar e corrigir dados
      </button>

      <transition name="fade">
        <div v-if="mensagem" :class="['toast', mensagem.tipo]">{{ mensagem.texto }}</div>
      </transition>

    </div>

  </div>
</template>

<script>
import api from "@/services/api"

export default {
  data() {
    return {
      etapa: 1,

      form: {
        nome: "",
        email: "",
        senha: "",
        confirmar: ""
      },

      mostrarSenha: false,
      senhasDiferentes: false,
      enviando: false,
      salvando: false,
      mensagem: null,

      // Verificação
      codigoDigitos: ["", "", "", "", "", ""],
      codigoRefs: [],
      codigoErro: false,
      codigoSucesso: false,
      cooldown: 0,
      cooldownTimer: null,
    }
  },

  computed: {
    req8chars()    { return this.form.senha.length >= 8 },
    reqMaiuscula() { return /[A-Z]/.test(this.form.senha) },
    reqNumero()    { return /[0-9]/.test(this.form.senha) },
    reqEspecial()  { return /[^A-Za-z0-9]/.test(this.form.senha) },

    forcaNivel() {
      const pts = [this.req8chars, this.reqMaiuscula, this.reqNumero, this.reqEspecial].filter(Boolean).length
      if (pts <= 1) return 1
      if (pts === 2) return 2
      if (pts === 3) return 3
      return 4
    },

    forcaTexto() {
      return ['', 'Fraca', 'Média', 'Forte', 'Muito forte'][this.forcaNivel]
    },

    codigoCompleto() {
      return this.codigoDigitos.join("")
    }
  },

  beforeUnmount() {
    clearInterval(this.cooldownTimer)
  },

  methods: {

    // ── ETAPA 1: envia o código pro email ──────────────
    async enviarCodigo() {
      if (this.forcaNivel < 4) {
        this.mostrarMensagem("A senha deve ser muito forte para continuar.", "erro")
        return
      }
      if (this.form.senha !== this.form.confirmar) {
        this.senhasDiferentes = true
        this.mostrarMensagem("As senhas não coincidem.", "erro")
        return
      }

      this.enviando = true
      try {
        await api.post("/usuarios/enviar-codigo", { email: this.form.email, nome: this.form.nome })
        this.etapa = 2
        this.iniciarCooldown()
        this.$nextTick(() => {
          this.codigoRefs[0]?.focus()
        })
      } catch (e) {
        const msg = e.response?.data?.erro || "Erro ao enviar código. Tente novamente."
        this.mostrarMensagem(msg, "erro")
      } finally {
        this.enviando = false
      }
    },

    // ── ETAPA 2: confirma o código e cria a conta ──────
    async confirmarCodigo() {
      if (this.codigoCompleto.length < 6) return

      this.codigoErro = false
      this.salvando = true

      try {
        const res = await api.post("/usuarios/verificar-codigo", {
          email:  this.form.email,
          codigo: this.codigoCompleto,
          nome:   this.form.nome,
          senha:  this.form.senha
        })

        if (res.data.token) {
          sessionStorage.setItem("authToken", res.data.token)
          sessionStorage.setItem("usuario", JSON.stringify(res.data.usuario || res.data))
        }

        this.codigoSucesso = true

        setTimeout(() => {
          const redirect = this.$route.query.redirect
          this.$router.push(redirect || "/entrar")
        }, 1400)

      } catch (e) {
        this.codigoErro = true
        this.codigoDigitos = ["", "", "", "", "", ""]
        this.$nextTick(() => this.codigoRefs[0]?.focus())
        const msg = e.response?.data?.erro || "Código incorreto."
        this.mostrarMensagem(msg, "erro")
      } finally {
        this.salvando = false
      }
    },

    // ── Reenviar ───────────────────────────────────────
    async reenviarCodigo() {
      if (this.cooldown > 0) return
      try {
        await api.post("/usuarios/enviar-codigo", { email: this.form.email, nome: this.form.nome })
        this.mostrarMensagem("Novo código enviado!", "sucesso")
        this.codigoDigitos = ["", "", "", "", "", ""]
        this.codigoErro = false
        this.iniciarCooldown()
        this.$nextTick(() => this.codigoRefs[0]?.focus())
      } catch {
        this.mostrarMensagem("Erro ao reenviar código.", "erro")
      }
    },

    voltarEtapa1() {
      this.etapa = 1
      this.codigoDigitos = ["", "", "", "", "", ""]
      this.codigoErro = false
      this.codigoSucesso = false
      clearInterval(this.cooldownTimer)
      this.cooldown = 0
    },

    // ── Cooldown timer ─────────────────────────────────
    iniciarCooldown() {
      this.cooldown = 60
      clearInterval(this.cooldownTimer)
      this.cooldownTimer = setInterval(() => {
        this.cooldown--
        if (this.cooldown <= 0) clearInterval(this.cooldownTimer)
      }, 1000)
    },

    // ── Controle dos inputs do código ──────────────────
    onDigitoInput(i, e) {
      const val = e.target.value.replace(/\D/g, "").slice(-1)
      this.codigoDigitos[i] = val
      this.codigoErro = false
      if (val && i < 5) {
        this.$nextTick(() => this.codigoRefs[i + 1]?.focus())
      }
      if (this.codigoCompleto.length === 6) {
        this.$nextTick(() => this.confirmarCodigo())
      }
    },

    onDigitoKeydown(i, e) {
      if (e.key === "Backspace" && !this.codigoDigitos[i] && i > 0) {
        this.$nextTick(() => this.codigoRefs[i - 1]?.focus())
      }
    },

    onCodigoPaste(e) {
      e.preventDefault()
      const texto = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6)
      texto.split("").forEach((c, i) => { this.codigoDigitos[i] = c })
      this.$nextTick(() => {
        const foco = Math.min(texto.length, 5)
        this.codigoRefs[foco]?.focus()
        if (texto.length === 6) this.confirmarCodigo()
      })
    },

    mostrarMensagem(texto, tipo) {
      this.mensagem = { texto, tipo }
      setTimeout(() => (this.mensagem = null), 3500)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.cadastro-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0d0f14;
  font-family: 'DM Sans', sans-serif;
  padding: 40px 16px;
  position: relative;
  overflow: hidden;
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.cadastro-card {
  background: #111318;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px;
  width: 100%;
  max-width: 440px;
  padding: 40px;
  box-shadow: 0 32px 80px rgba(0,0,0,.5);
  position: relative;
  z-index: 1;
}

/* ─── HEADER ────────────────────────────────────────── */
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.logo-icon {
  font-size: 28px;
  color: #6366f1;
  line-height: 1;
  flex-shrink: 0;
}

.email-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(99,102,241,0.12);
  border: 1px solid rgba(99,102,241,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #818cf8;
  flex-shrink: 0;
}
.email-icon-wrap svg { width: 20px; height: 20px; }

.header-text h1 {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -.02em;
}
.header-text p {
  font-size: 13px;
  color: #475569;
  margin-top: 3px;
}
.header-text p strong { color: #94a3b8; font-weight: 600; }

/* ─── FIELDS ────────────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 18px;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 17px; height: 17px;
  color: #475569;
  display: flex;
  align-items: center;
  pointer-events: none;
}
.input-icon svg { width: 100%; height: 100%; }

input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: #0d0f14;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 11px;
  color: #e2e8f0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  transition: border-color .2s, box-shadow .2s;
  outline: none;
}
input::placeholder { color: #334155; }
input:focus {
  border-color: rgba(99,102,241,.5);
  box-shadow: 0 0 0 3px rgba(99,102,241,.1);
}

.input-wrapper.input-error input {
  border-color: rgba(239,68,68,.5);
  box-shadow: 0 0 0 3px rgba(239,68,68,.08);
}

.toggle-senha {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #475569;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color .15s;
}
.toggle-senha:hover { color: #94a3b8; }
.toggle-senha svg { width: 16px; height: 16px; }

.field-hint { font-size: 11.5px; color: #334155; }
.field-hint.error { color: #f87171; }
.senha-hint strong { font-weight: 700; }

/* ─── FORÇA DA SENHA ────────────────────────────────── */
.senha-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
}
.strength-bars { display: flex; gap: 4px; flex: 1; }
.strength-bar {
  flex: 1; height: 4px;
  border-radius: 100px;
  background: rgba(255,255,255,0.06);
  transition: background 0.3s ease;
}
.strength-bar.active.nivel-1 { background: #ef4444; }
.strength-bar.active.nivel-2 { background: #f97316; }
.strength-bar.active.nivel-3 { background: #84cc16; }
.strength-bar.active.nivel-4 { background: #22c55e; }

.strength-label {
  font-size: 11.5px; font-weight: 600;
  white-space: nowrap;
  display: flex; align-items: center; gap: 5px;
  transition: color 0.3s;
}
.strength-dot {
  width: 6px; height: 6px;
  border-radius: 50%; flex-shrink: 0;
  transition: background 0.3s;
}
.label-1 { color: #ef4444; } .dot-1 { background: #ef4444; }
.label-2 { color: #f97316; } .dot-2 { background: #f97316; }
.label-3 { color: #84cc16; } .dot-3 { background: #84cc16; }
.label-4 { color: #22c55e; } .dot-4 { background: #22c55e; }

/* ─── REQUISITOS ────────────────────────────────────── */
.senha-requisitos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
  margin-top: 4px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px;
  animation: fadeSlide 0.2s ease;
}
@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.req {
  display: flex; align-items: center; gap: 6px;
  font-size: 11.5px; font-weight: 500;
  color: #475569; transition: color 0.25s;
}
.req.ok { color: #4ade80; }
.req-icon {
  font-size: 11px; font-weight: 700;
  width: 14px; text-align: center;
  color: #334155; transition: color 0.25s;
}
.req.ok .req-icon { color: #4ade80; }

/* ─── BOTÃO PRINCIPAL ───────────────────────────────── */
.btn-cadastrar {
  width: 100%;
  margin-top: 8px;
  padding: 13px 20px;
  background: #6366f1;
  border: none;
  border-radius: 11px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all .18s;
  box-shadow: 0 4px 20px rgba(99,102,241,.3);
}
.btn-cadastrar:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(99,102,241,.4);
}
.btn-cadastrar:disabled { opacity: .5; cursor: not-allowed; }

.spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── TOAST ─────────────────────────────────────────── */
.toast {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: center;
}
.toast.sucesso {
  background: rgba(34,197,94,.12);
  color: #4ade80;
  border: 1px solid rgba(34,197,94,.2);
}
.toast.erro {
  background: rgba(239,68,68,.12);
  color: #f87171;
  border: 1px solid rgba(239,68,68,.2);
}

/* ─── LINK ENTRAR ───────────────────────────────────── */
.link-entrar {
  display: block;
  text-align: center;
  margin-top: 22px;
  font-size: 13.5px;
  color: #475569;
  text-decoration: none;
  transition: color .15s;
}
.link-entrar:hover { color: #94a3b8; }
.link-entrar span {
  color: #818cf8;
  font-weight: 600;
  margin-left: 4px;
}
.link-entrar:hover span { color: #a5b4fc; }

/* ─── VERIFICAÇÃO: INPUTS DO CÓDIGO ─────────────────── */
.verificacao-card { max-width: 420px; }

.codigo-wrap {
  margin: 8px 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.codigo-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.codigo-input {
  width: 48px;
  height: 58px;
  padding: 0;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #f1f5f9;
  background: #0d0f14;
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  outline: none;
  caret-color: #6366f1;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  letter-spacing: 0;
}

.codigo-input:focus {
  border-color: rgba(99,102,241,0.7);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  transform: scale(1.05);
}

.codigo-input.filled {
  border-color: rgba(99,102,241,0.4);
  background: rgba(99,102,241,0.06);
}

.codigo-input.erro {
  border-color: rgba(239,68,68,0.6);
  box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
  animation: shake 0.35s ease;
}

.codigo-input.sucesso {
  border-color: rgba(34,197,94,0.6);
  box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-5px); }
  40%       { transform: translateX(5px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

.codigo-erro-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #f87171;
}

.codigo-sucesso-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #4ade80;
}

/* ─── REENVIAR ──────────────────────────────────────── */
.reenviar-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 18px;
}
.reenviar-text {
  font-size: 13px;
  color: #475569;
}
.btn-reenviar {
  font-size: 13px;
  font-weight: 600;
  color: #818cf8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
  font-family: 'DM Sans', sans-serif;
}
.btn-reenviar:hover:not(:disabled) { color: #a5b4fc; }
.btn-reenviar:disabled { color: #334155; cursor: not-allowed; }

/* ─── VOLTAR ────────────────────────────────────────── */
.btn-voltar {
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  color: #475569;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-voltar:hover {
  color: #94a3b8;
  border-color: rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.03);
}

.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>