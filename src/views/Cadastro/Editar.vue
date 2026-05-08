<template>
  <div class="login-page">
    <div class="bg-grid"></div>

    <div class="login-card">

      <div class="card-header">
        <span class="logo-icon">⬡</span>
        <div class="header-text">
          <h1>Bem-vindo</h1>
          <p>Acesse sua conta para continuar</p>
        </div>
      </div>

      <form @submit.prevent="loginUsuario">

        <div class="field">
          <label>Email</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </span>
            <input v-model="form.email" type="email" placeholder="seu@email.com" required autocomplete="email" />
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
              placeholder="Sua senha"
              required
              autocomplete="current-password"
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
        </div>

        <button type="submit" class="btn-entrar" :disabled="entrando">
          <span v-if="entrando" class="spinner"></span>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          {{ entrando ? 'Entrando...' : 'Entrar' }}
        </button>

      </form>

      <transition name="fade">
        <div v-if="mensagem" :class="['toast', mensagem.tipo]">
          {{ mensagem.texto }}
        </div>
      </transition>

      <router-link to="/cadastro" class="link-cadastro">
        Ainda não tem conta?
        <span>Cadastrar</span>
      </router-link>

    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      form: { email: "", senha: "" },
      mostrarSenha: false,
      entrando: false,
      mensagem: null,
    };
  },

  methods: {
    async loginUsuario() {
      this.entrando = true;
      this.mensagem = null;

      try {
        const res = await api.post("/login", this.form);
        
        console.log('Resposta login:', res.data) // DEBUG

        // Salva USUÁRIO e TOKEN (os dois são necessários!)
        const usuario = res.data.usuario || res.data;
        const token = res.data.token || 'token-' + Date.now();

        sessionStorage.setItem("usuario", JSON.stringify(usuario));
        sessionStorage.setItem("authToken", token);

        console.log('Salvo no sessionStorage:', {
          usuario: sessionStorage.getItem('usuario'),
          token: sessionStorage.getItem('authToken')?.substring(0, 20) + '...'
        })

        this.mostrarMensagem("Login realizado com sucesso!", "sucesso");
        
        // REDIRECIONAMENTO INTELIGENTE
        setTimeout(() => {
          const redirect = this.$route.query.redirect;
          console.log('Redirect para:', redirect || '/perfil')
          
          if (redirect) {
            this.$router.push(redirect);
          } else {
            this.$router.push("/perfil");
          }
        }, 800);

      } catch (err) {
        console.error('Erro login:', err)
        this.mostrarMensagem("Email ou senha incorretos.", "erro");
      } finally {
        this.entrando = false;
      }
    },

    mostrarMensagem(texto, tipo) {
      this.mensagem = { texto, tipo };
      setTimeout(() => (this.mensagem = null), 3000);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.login-page {
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

/* Card */
.login-card {
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

/* Header */
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

/* Fields */
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
  width: 17px;
  height: 17px;
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

/* Botão */
.btn-entrar {
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

.btn-entrar:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(99,102,241,.4);
}

.btn-entrar:disabled { opacity: .6; cursor: not-allowed; }
.btn-entrar svg { width: 16px; height: 16px; }

/* Spinner */
.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Toast */
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

/* Link */
.link-cadastro {
  display: block;
  text-align: center;
  margin-top: 22px;
  font-size: 13.5px;
  color: #475569;
  text-decoration: none;
  transition: color .15s;
}

.link-cadastro:hover { color: #94a3b8; }

.link-cadastro span {
  color: #818cf8;
  font-weight: 600;
  margin-left: 4px;
}

.link-cadastro:hover span { color: #a5b4fc; }

/* Fade */
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>