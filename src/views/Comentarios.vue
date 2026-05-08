<template>
  <div class="comentarios-page">

    <!-- ─── HEADER ────────────────────────────────────── -->
    <div class="page-header">
      <span class="section-tag">Comunidade</span>
      <h2>Deixe seu <em>depoimento</em></h2>
      <p>Compartilhe sua experiência e inspire outros viajantes</p>
    </div>

    <div class="comentarios-layout">

      <!-- ─── FORMULÁRIO (logado) ────────────────────── -->
      <div class="form-card" v-if="usuarioLogado">
        <div class="form-card-header">
          <div class="form-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span>Novo comentário</span>
        </div>

        <div class="form-body">
          <!-- Nome pré-preenchido -->
          <div class="field-group">
            <label>Comentando como</label>
            <div class="usuario-badge">
              <div class="usuario-avatar">
                <img
                  v-if="usuarioLogado.foto"
                  :src="apiUrl + usuarioLogado.foto"
                  :alt="usuarioLogado.nome"
                  class="avatar-img"
                />
                <span v-else>{{ usuarioLogado.nome?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <span>{{ usuarioLogado.nome }}</span>
            </div>
          </div>

          <!-- Comentário -->
          <div class="field-group">
            <label>Comentário</label>
            <textarea
              v-model="form.comentario"
              placeholder="Conte sua experiência com a ViaPlan..."
              rows="4"
            ></textarea>
          </div>

          <!-- Nota com estrelas clicáveis -->
          <div class="field-group">
            <label>Sua avaliação</label>
            <div class="star-picker">
              <button
                v-for="n in 5"
                :key="n"
                class="star-btn"
                :class="{ active: n <= (hoverNota || form.nota) }"
                @mouseenter="hoverNota = n"
                @mouseleave="hoverNota = 0"
                @click="form.nota = n"
                type="button"
              >★</button>
              <span class="nota-label" v-if="form.nota">
                {{ notaLabel[form.nota] }}
              </span>
            </div>
          </div>

          <button class="btn-enviar" @click="enviarComentario" :disabled="enviando">
            <span v-if="!enviando">
              Publicar comentário
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </span>
            <span v-else class="loading-dots">
              <span></span><span></span><span></span>
            </span>
          </button>

          <transition name="fade">
            <div class="sucesso-msg" v-if="enviado">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Comentário publicado com sucesso!
            </div>
          </transition>
        </div>
      </div>

      <!-- ─── BLOQUEIO (não logado) ──────────────────── -->
      <div class="form-card bloqueado" v-else>
        <div class="bloqueio-content">
          <div class="bloqueio-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3>Faça login para comentar</h3>
          <p>Apenas viajantes com conta podem deixar depoimentos. É rápido e gratuito!</p>
          <router-link to="/entrar" class="btn-login">
            Entrar na conta
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <router-link to="/cadastro" class="btn-cadastro">
            Criar conta grátis
          </router-link>
        </div>
      </div>

      <!-- ─── LISTA ───────────────────────────────────── -->
      <div class="lista">
        <div class="lista-header">
          <span class="lista-count">{{ comentarios.length }} depoimento{{ comentarios.length !== 1 ? 's' : '' }}</span>
          <div class="lista-divider"></div>
        </div>

        <transition-group name="card" tag="div" class="lista-grid">
          <div
            class="comentario-card"
            v-for="(c, i) in comentarios"
            :key="c._id"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <div class="card-top">
              <!-- Avatar: foto real ou inicial -->
              <div class="avatar">
                <img
                  v-if="c.foto"
                  :src="apiUrl + c.foto"
                  :alt="c.nome"
                  class="avatar-img"
                />
                <span v-else>{{ c.nome?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <div class="card-meta">
                <p class="card-nome">{{ c.nome }}</p>
                <div class="card-stars">
                  <span v-for="s in 5" :key="s" :class="['star', { active: s <= c.nota }]">★</span>
                </div>
              </div>
              <div class="card-actions">
                <span class="card-data">{{ formatarData(c.data) }}</span>
                <!-- BOTÃO EXCLUIR — visível apenas para dono ou admin -->
                <button
                  v-if="podeExcluir(c)"
                  class="btn-excluir"
                  @click="excluirComentario(c._id)"
                  title="Excluir comentário"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  </svg>
                </button>
              </div>
            </div>

            <p class="card-texto">{{ c.comentario }}</p>

            <div class="card-footer">
              <div class="verificado">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Viajante verificado
              </div>
            </div>
          </div>
        </transition-group>

        <div v-if="!comentarios.length" class="vazio">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p>Seja o primeiro a comentar!</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default {
  data() {
    return {
      apiUrl: API_URL,
      usuarioLogado: null,
      comentarios: [],
      form: { comentario: "", nota: "" },
      hoverNota: 0,
      enviando: false,
      enviado: false,
      notaLabel: {
        1: "Ruim",
        2: "Regular",
        3: "Bom",
        4: "Ótimo",
        5: "Excelente"
      }
    }
  },

  methods: {
    async carregarComentarios() {
      const res = await axios.get(`${API_URL}/comentarios`)
      this.comentarios = res.data
    },

    async enviarComentario() {
      if (!this.form.comentario || !this.form.nota) {
        this.$el.querySelectorAll("textarea").forEach(el => {
          if (!el.value) {
            el.classList.add("shake")
            setTimeout(() => el.classList.remove("shake"), 500)
          }
        })
        return
      }

      this.enviando = true

      await axios.post(`${API_URL}/comentarios`, {
        nome:       this.usuarioLogado.nome,
        usuarioId:  this.usuarioLogado._id,
        foto:       this.usuarioLogado.foto || "",
        comentario: this.form.comentario,
        nota:       this.form.nota
      })

      this.form = { comentario: "", nota: "" }
      this.enviando = false
      this.enviado = true
      setTimeout(() => (this.enviado = false), 3000)
      this.carregarComentarios()
    },

    // Verifica se o usuário logado pode excluir o comentário
    podeExcluir(comentario) {
      if (!this.usuarioLogado) return false
      const isAdmin = this.usuarioLogado.admin === true
      const isOwner = String(this.usuarioLogado._id) === String(comentario.usuarioId)
      return isAdmin || isOwner
    },

    async excluirComentario(id) {
      const result = await Swal.fire({
        title: "Excluir comentário?",
        text: "Esta ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#334155",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
        background: "#0d1b30",
        color: "#e2e8f0"
      })

      if (!result.isConfirmed) return

      try {
        await axios.delete(`${API_URL}/comentarios/${id}`)
        this.comentarios = this.comentarios.filter(c => c._id !== id)
        Swal.fire({
          title: "Excluído!",
          text: "O comentário foi removido.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#0d1b30",
          color: "#e2e8f0"
        })
      } catch (err) {
        Swal.fire({
          title: "Erro!",
          text: err.response?.data?.msg || "Não foi possível excluir o comentário.",
          icon: "error",
          background: "#0d1b30",
          color: "#e2e8f0"
        })
      }
    },

    formatarData(data) {
      if (!data) return ""
      return new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric"
      })
    }
  },

  mounted() {
    const usuario = sessionStorage.getItem("usuario")
    if (usuario) this.usuarioLogado = JSON.parse(usuario)
    this.carregarComentarios()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.comentarios-page {
  font-family: 'DM Sans', sans-serif;
  background: #080e1a;
  color: #e2e8f0;
  min-height: 100vh;
  padding: 80px 40px;
}

/* ─── HEADER ──────────────────────────────────────────── */
.page-header {
  text-align: center;
  margin-bottom: 60px;
}
.section-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.2);
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 16px;
}
.page-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 10px;
}
.page-header h2 em { color: #38bdf8; font-style: italic; }
.page-header p { font-size: 15px; color: #475569; }

/* ─── LAYOUT ──────────────────────────────────────────── */
.comentarios-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 32px;
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;
}

/* ─── FORM CARD ───────────────────────────────────────── */
.form-card {
  background: #0d1b30;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
  position: sticky;
  top: 100px;
}
.form-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
}
.form-icon {
  width: 34px; height: 34px;
  border-radius: 10px;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.15);
  display: flex; align-items: center; justify-content: center;
  color: #38bdf8;
}
.form-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ─── USUARIO BADGE ───────────────────────────────────── */
.usuario-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
}
.usuario-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(52,211,153,0.15));
  border: 1px solid rgba(56,189,248,0.25);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 13px; font-weight: 700; color: #38bdf8;
  flex-shrink: 0;
  overflow: hidden;
}

/* ─── BLOQUEIO ────────────────────────────────────────── */
.bloqueado { border-color: rgba(255,255,255,0.05); }

.bloqueio-content {
  padding: 48px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
}
.bloqueio-icon {
  width: 64px; height: 64px;
  border-radius: 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  margin-bottom: 4px;
}
.bloqueio-content h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: #f1f5f9;
  font-weight: 700;
}
.bloqueio-content p {
  font-size: 13.5px;
  color: #475569;
  line-height: 1.6;
  max-width: 260px;
}
.btn-login {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  background: linear-gradient(135deg, #0ea5e9, #34d399);
  color: #080e1a;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 6px 24px rgba(14,165,233,0.25);
  margin-top: 6px;
}
.btn-login:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-cadastro {
  font-size: 13px;
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.btn-cadastro:hover { color: #94a3b8; }

/* ─── FIELDS ──────────────────────────────────────────── */
.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-group label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #475569;
}
textarea {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px 14px;
  color: #e2e8f0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  resize: none;
}
textarea::placeholder { color: #334155; }
textarea:focus {
  border-color: rgba(56,189,248,0.35);
  box-shadow: 0 0 0 3px rgba(56,189,248,0.08);
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
textarea.shake { border-color: rgba(239,68,68,0.5) !important; animation: shake 0.4s ease; }

/* ─── STAR PICKER ─────────────────────────────────────── */
.star-picker { display: flex; align-items: center; gap: 4px; }
.star-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #1e293b;
  cursor: pointer;
  transition: color 0.15s, transform 0.15s;
  padding: 0 2px;
  line-height: 1;
}
.star-btn.active { color: #fbbf24; transform: scale(1.15); }
.nota-label { margin-left: 8px; font-size: 12px; font-weight: 600; color: #fbbf24; }

/* ─── BTN ENVIAR ──────────────────────────────────────── */
.btn-enviar {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #0ea5e9, #34d399);
  color: #080e1a;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 6px 24px rgba(14,165,233,0.25);
}
.btn-enviar:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-enviar:disabled { opacity: 0.6; cursor: not-allowed; }

.loading-dots { display: flex; gap: 5px; }
.loading-dots span {
  width: 6px; height: 6px;
  background: #080e1a;
  border-radius: 50%;
  animation: dot 1.2s ease infinite;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot {
  0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
  40%            { transform: scale(1);   opacity: 1; }
}

/* ─── SUCESSO ─────────────────────────────────────────── */
.sucesso-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #34d399;
  background: rgba(52,211,153,0.08);
  border: 1px solid rgba(52,211,153,0.2);
  border-radius: 10px;
  padding: 10px 14px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s, transform 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ─── LISTA ───────────────────────────────────────────── */
.lista { display: flex; flex-direction: column; gap: 16px; }
.lista-header { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
.lista-count {
  font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
  text-transform: uppercase; color: #475569; white-space: nowrap;
}
.lista-divider { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
.lista-grid { display: flex; flex-direction: column; gap: 14px; }

/* ─── CARD ────────────────────────────────────────────── */
.comentario-card {
  background: #0d1b30;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 18px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s, transform 0.2s;
  animation: slideIn 0.4s ease both;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.comentario-card:hover { border-color: rgba(56,189,248,0.14); transform: translateY(-2px); }

.card-top { display: flex; align-items: center; gap: 12px; }

/* Avatar com suporte a foto real */
.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(52,211,153,0.15));
  border: 1px solid rgba(56,189,248,0.2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 16px; font-weight: 700; color: #38bdf8;
  flex-shrink: 0;
  overflow: hidden;
}

/* Imagem de perfil dentro do avatar */
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.card-meta { flex: 1; }
.card-nome { font-size: 14px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px; }
.card-stars { display: flex; gap: 2px; }
.star { font-size: 12px; color: #1e293b; }
.star.active { color: #fbbf24; }

/* Ações do card (data + excluir) */
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.card-data { font-size: 11px; color: #334155; font-weight: 500; }

/* Botão excluir */
.btn-excluir {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: 6px;
  color: #f87171;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  padding: 0;
}
.btn-excluir:hover {
  background: rgba(239,68,68,0.18);
  transform: scale(1.1);
}

.card-texto { font-size: 14px; color: #64748b; line-height: 1.7; font-style: italic; padding-left: 52px; }
.card-footer { padding-left: 52px; }
.verificado {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600; color: #34d399; letter-spacing: 0.3px;
}

.vazio {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px; padding: 80px 20px;
  color: #1e293b; text-align: center;
}
.vazio p { font-size: 14px; color: #334155; }

.card-enter-active { animation: slideIn 0.35s ease; }
.card-leave-active { animation: slideIn 0.25s ease reverse; }

/* ─── RESPONSIVE ──────────────────────────────────────── */
@media (max-width: 860px) {
  .comentarios-layout { grid-template-columns: 1fr; }
  .form-card { position: static; }
  .comentarios-page { padding: 60px 20px; }
}
</style>