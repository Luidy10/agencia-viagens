<template>
  <div class="sidebar-shell">

    <aside class="admin-sidebar">

      <!-- LOGO -->
      <div class="sidebar-logo">
        <span class="logo-icon">⬡</span>
        <span class="logo-text">ViaPlan</span>
      </div>

      <nav class="sidebar-nav">

        <!-- ── NAVEGAÇÃO GERAL ───────────────────── -->
        <p class="nav-section-label">Geral</p>

        <router-link to="/" class="nav-item" active-class="active" exact>
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              <path d="M9 21V12h6v9"/>
            </svg>
          </span>
          <span>Home</span>
        </router-link>

        <router-link to="/Destinos" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          <span>Destinos</span>
        </router-link>

        <router-link to="/sobrenos" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          <span>Sobre</span>
        </router-link>

        <!-- ── ADMIN ─────────────────────────────── -->
        <p class="nav-section-label" style="margin-top:16px">Administração</p>

        <router-link to="/conta" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </span>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/admin/destinos" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </span>
          <span>Destinos Admin</span>
        </router-link>

        <!-- ── NOVO: Histórico de Viagens ─────────── -->
        <router-link to="/admin/viagens" class="nav-item" active-class="active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <span>Viagens</span>
          <span class="nav-badge">{{ totalViagens }}</span>
        </router-link>

        <!-- Painel / Stats -->
        <div
          class="nav-item nav-dropdown-trigger"
          :class="{ active: mostrarPainel }"
          @click="mostrarPainel = !mostrarPainel"
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6"  y1="20" x2="6"  y2="14"/>
            </svg>
          </span>
          <span>Painel</span>
          <span class="chevron" :class="{ open: mostrarPainel }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>

        <transition name="slide-down">
          <div v-if="mostrarPainel" class="stats-dropdown">

            <div class="stat-item">
              <span class="stat-icon users">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <div class="stat-info">
                <span class="stat-name">Usuários</span>
                <span class="stat-num">{{ totalUsuarios }}</span>
              </div>
            </div>

            <div class="stat-item">
              <span class="stat-icon comments">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <div class="stat-info">
                <span class="stat-name">Comentários</span>
                <span class="stat-num">{{ totalComentarios }}</span>
              </div>
            </div>

            <div class="stat-item">
              <span class="stat-icon trips">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <div class="stat-info">
                <span class="stat-name">Viagens</span>
                <span class="stat-num">{{ totalViagens }}</span>
              </div>
            </div>

          </div>
        </transition>

        <!-- ── MAIS PÁGINAS ────────────────────── -->
        <p class="nav-section-label" style="margin-top:16px">Mais</p>

        <!-- Botão hamburguer → abre flyout lateral -->
        <div
          class="nav-item nav-mais-trigger"
          :class="{ active: mostrarMais }"
          @click="toggleMais"
        >
          <span class="nav-icon">
            <span class="hb-wrap">
              <span class="hb-bar hb-1"></span>
              <span class="hb-bar hb-2"></span>
              <span class="hb-bar hb-3"></span>
            </span>
          </span>
          <span>Mais páginas</span>
          <span class="arrow-indicator" :class="{ open: mostrarMais }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        </div>

      </nav>

      <!-- ── FOOTER ─────────────────────────────────── -->
      <div class="sidebar-footer">

        <router-link to="/perfil" class="footer-btn perfil-btn">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <span>Minha Conta</span>
        </router-link>

        <button class="footer-btn sair-btn" @click="logout">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span>Sair</span>
        </button>

        <div class="sidebar-user">
          <div class="user-avatar">{{ inicial }}</div>
          <div class="user-details">
            <span class="user-name">{{ nomeAdmin }}</span>
            <span class="user-role">Administrador</span>
          </div>
        </div>

      </div>

    </aside>

    <!-- ── FLY-OUT PANEL ──────────────────────────── -->
    <transition name="flyout">
      <div v-if="mostrarMais" class="mais-flyout" @click.self="fecharMais">

        <div class="flyout-inner">

          <div class="flyout-header">
            <span class="flyout-title">Mais páginas</span>
            <button class="flyout-close" @click="fecharMais" aria-label="Fechar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="flyout-group">
            <p class="flyout-group-label">Suporte</p>

            <router-link to="/Comentario" class="flyout-item" @click="fecharMais">
              <span class="flyout-item-icon comments">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <div class="flyout-item-text">
                <span class="flyout-item-name">Comentários</span>
                <span class="flyout-item-desc">Gerencie os comentários dos usuários</span>
              </div>
              <span class="flyout-item-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </router-link>

            <router-link to="/contato" class="flyout-item" @click="fecharMais">
              <span class="flyout-item-icon mail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
              </span>
              <div class="flyout-item-text">
                <span class="flyout-item-name">Contato</span>
                <span class="flyout-item-desc">Canal de contato com usuários</span>
              </div>
              <span class="flyout-item-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </router-link>

            <router-link to="/central" class="flyout-item" @click="fecharMais">
              <span class="flyout-item-icon help">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              <div class="flyout-item-text">
                <span class="flyout-item-name">Central de Ajuda</span>
                <span class="flyout-item-desc">Artigos e FAQs de suporte</span>
              </div>
              <span class="flyout-item-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </router-link>
          </div>

          <div class="flyout-divider"></div>

          <div class="flyout-group">
            <p class="flyout-group-label">Legal</p>

            <router-link to="/politica" class="flyout-item" @click="fecharMais">
              <span class="flyout-item-icon lock">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <div class="flyout-item-text">
                <span class="flyout-item-name">Política de Privacidade</span>
                <span class="flyout-item-desc">Como tratamos seus dados</span>
              </div>
              <span class="flyout-item-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </router-link>

            <router-link to="/termos" class="flyout-item" @click="fecharMais">
              <span class="flyout-item-icon doc">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </span>
              <div class="flyout-item-text">
                <span class="flyout-item-name">Termos de Uso</span>
                <span class="flyout-item-desc">Condições de uso da plataforma</span>
              </div>
              <span class="flyout-item-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </router-link>
          </div>

        </div>

      </div>
    </transition>

  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "AdminSidebar",

  data() {
    return {
      mostrarPainel:    false,
      mostrarMais:      false,
      totalUsuarios:    0,
      totalComentarios: 0,
      totalViagens:     0,
      nomeAdmin:        "Admin",
    };
  },

  computed: {
    inicial() {
      return this.nomeAdmin.charAt(0).toUpperCase();
    }
  },

  mounted() {
    this.carregarUsuario();
    this.carregarDados();
    document.addEventListener("keydown", this.handleKeydown);
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  },

  methods: {
    carregarUsuario() {
      try {
        const raw = sessionStorage.getItem("usuario");
        if (raw) this.nomeAdmin = JSON.parse(raw).nome || "Admin";
      } catch {}
    },

    async carregarDados() {
      try {
        const [u, c, v] = await Promise.all([
          api.get("/usuarios"),
          api.get("/comentarios"),
          api.get("/viagens"),
        ]);
        this.totalUsuarios    = u.data.length;
        this.totalComentarios = c.data.length;
        this.totalViagens     = v.data.length;
      } catch {}
    },

    toggleMais() {
      this.mostrarMais = !this.mostrarMais;
    },

    fecharMais() {
      this.mostrarMais = false;
    },

    handleKeydown(e) {
      if (e.key === "Escape") this.fecharMais();
    },

    logout() {
      sessionStorage.removeItem("usuario");
      window.location.href = "/";
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* ── Shell ─────────────────────────────────── */
.sidebar-shell {
  display: flex;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 999;
  flex-shrink: 0;
}

/* ── Sidebar ─────────────────────────────────── */
.admin-sidebar {
  width: 240px;
  height: 100%;
  background: #111318;
  border-right: 1px solid rgba(255,255,255,.06);
  display: flex;
  flex-direction: column;
  padding: 24px 14px;
  font-family: 'DM Sans', sans-serif;
}

/* ── Logo ───────────────────────────────────── */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 22px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  margin-bottom: 16px;
}

.logo-icon { font-size: 22px; color: #6366f1; line-height: 1; }

.logo-text {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: .04em;
  color: #f1f5f9;
}

/* ── Nav ─────────────────────────────────────── */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow-y: auto;
}

.sidebar-nav::-webkit-scrollbar { width: 4px; }
.sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

.nav-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: #334155;
  padding: 6px 12px 4px;
  margin-top: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all .18s ease;
  text-decoration: none;
  user-select: none;
}

.nav-item:hover { background: rgba(255,255,255,.05); color: #cbd5e1; }

.nav-item.active,
.router-link-active.nav-item {
  background: rgba(99,102,241,.15);
  color: #818cf8;
}

.nav-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-icon svg { width: 100%; height: 100%; }

/* ── Badge numérico ──────────────────────────── */
.nav-badge {
  margin-left: auto;
  background: rgba(251,146,60,.15);
  color: #fb923c;
  border: 1px solid rgba(251,146,60,.25);
  border-radius: 100px;
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 7px;
  font-family: 'DM Mono', monospace;
  line-height: 1.6;
  flex-shrink: 0;
}
.nav-item.active .nav-badge,
.router-link-active .nav-badge {
  background: rgba(251,146,60,.25);
  border-color: rgba(251,146,60,.4);
}

/* ── Chevron (painel dropdown) ───────────────── */
.chevron {
  margin-left: auto;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  opacity: .45;
  transition: transform .25s ease, opacity .2s;
  flex-shrink: 0;
}
.chevron svg { width: 100%; height: 100%; }
.chevron.open { transform: rotate(180deg); opacity: 1; }

/* ── Arrow indicator (flyout) ────────────────── */
.arrow-indicator {
  margin-left: auto;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  opacity: .45;
  transition: transform .25s ease, opacity .2s, color .18s;
  flex-shrink: 0;
  color: #64748b;
}
.arrow-indicator svg { width: 100%; height: 100%; }
.arrow-indicator.open {
  transform: rotate(180deg) translateX(2px);
  opacity: 1;
  color: #818cf8;
}

/* ── HAMBURGUER ANIMADO ───────────────────────── */
.hb-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3.5px;
  width: 18px;
  height: 18px;
}

.hb-bar {
  display: block;
  width: 13px;
  height: 1.5px;
  border-radius: 2px;
  background: currentColor;
  transition:
    transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
    opacity   0.25s ease,
    width     0.35s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center;
}

.nav-mais-trigger.active .hb-bar.hb-1 {
  transform: translateY(5px) rotate(45deg);
}
.nav-mais-trigger.active .hb-bar.hb-2 {
  opacity: 0;
  width: 0;
}
.nav-mais-trigger.active .hb-bar.hb-3 {
  transform: translateY(-5px) rotate(-45deg);
}

/* ── Stats dropdown ──────────────────────────── */
.stats-dropdown {
  margin: 2px 0 6px 12px;
  border-left: 2px solid rgba(99,102,241,.2);
  padding: 10px 0 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item { display: flex; align-items: center; gap: 10px; }

.stat-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon svg { width: 14px; height: 14px; }
.stat-icon.users    { background: rgba(99,102,241,.15); color: #818cf8; }
.stat-icon.comments { background: rgba(34,197,94,.12);  color: #4ade80; }
.stat-icon.trips    { background: rgba(251,146,60,.12); color: #fb923c; }

.stat-info { display: flex; flex-direction: column; line-height: 1.3; }

.stat-name {
  font-size: 10.5px;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.stat-num {
  font-size: 15px;
  font-weight: 700;
  color: #e2e8f0;
  font-family: 'DM Mono', monospace;
}

/* ── Slide animation (stats) ─────────────────── */
.slide-down-enter-active,
.slide-down-leave-active { transition: all .25s ease; overflow: hidden; }
.slide-down-enter-from,
.slide-down-leave-to   { max-height: 0; opacity: 0; transform: translateY(-6px); }
.slide-down-enter-to,
.slide-down-leave-from { max-height: 300px; opacity: 1; transform: translateY(0); }

/* ── FLY-OUT PANEL ───────────────────────────── */
.mais-flyout {
  position: absolute;
  left: 240px;
  top: 0;
  height: 100%;
  z-index: 998;
  display: flex;
}

.flyout-inner {
  width: 280px;
  height: 100%;
  background: #13151b;
  border-right: 1px solid rgba(255,255,255,.07);
  border-left: 1px solid rgba(255,255,255,.04);
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  overflow-y: auto;
  box-shadow: 8px 0 32px rgba(0,0,0,.35);
}

.flyout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 6px 18px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  margin-bottom: 16px;
  flex-shrink: 0;
}

.flyout-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #475569;
}

.flyout-close {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: none;
  background: rgba(255,255,255,.05);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .18s, color .18s;
  padding: 0;
}
.flyout-close:hover { background: rgba(239,68,68,.12); color: #f87171; }
.flyout-close svg { width: 13px; height: 13px; }

/* Groups */
.flyout-group { display: flex; flex-direction: column; gap: 2px; }

.flyout-group-label {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: #2d3748;
  padding: 0 8px 6px;
}

.flyout-divider {
  height: 1px;
  background: rgba(255,255,255,.05);
  margin: 12px 0;
}

/* Items */
.flyout-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: background .18s;
  color: inherit;
}

.flyout-item:hover { background: rgba(255,255,255,.05); }
.flyout-item.router-link-active { background: rgba(99,102,241,.1); }

.flyout-item-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform .2s;
}
.flyout-item:hover .flyout-item-icon { transform: scale(1.06); }
.flyout-item-icon svg { width: 15px; height: 15px; }
.flyout-item-icon.comments { background: rgba(34,197,94,.1);   color: #4ade80; }
.flyout-item-icon.mail     { background: rgba(59,130,246,.1);  color: #60a5fa; }
.flyout-item-icon.help     { background: rgba(251,191,36,.1);  color: #fbbf24; }
.flyout-item-icon.lock     { background: rgba(168,85,247,.1);  color: #c084fc; }
.flyout-item-icon.doc      { background: rgba(99,102,241,.12); color: #818cf8; }

.flyout-item-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.flyout-item-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flyout-item-desc {
  font-size: 11px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flyout-item-arrow {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  color: #334155;
  flex-shrink: 0;
  transition: transform .18s, color .18s;
}
.flyout-item-arrow svg { width: 100%; height: 100%; }
.flyout-item:hover .flyout-item-arrow { transform: translateX(2px); color: #64748b; }

/* ── Fly-out transition ──────────────────────── */
.flyout-enter-active { transition: transform .28s cubic-bezier(0.22, 1, 0.36, 1), opacity .2s ease; }
.flyout-leave-active { transition: transform .22s cubic-bezier(0.55, 0, 1, 0.45), opacity .18s ease; }
.flyout-enter-from  { transform: translateX(-16px); opacity: 0; }
.flyout-enter-to    { transform: translateX(0);     opacity: 1; }
.flyout-leave-from  { transform: translateX(0);     opacity: 1; }
.flyout-leave-to    { transform: translateX(-16px); opacity: 0; }

/* ── Footer ──────────────────────────────────── */
.sidebar-footer {
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,.06);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all .18s ease;
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  text-align: left;
}

.perfil-btn { color: #64748b; }
.perfil-btn:hover { background: rgba(255,255,255,.05); color: #cbd5e1; }

.sair-btn { color: #64748b; }
.sair-btn:hover { background: rgba(239,68,68,.1); color: #f87171; }

/* User card */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 2px;
  margin-top: 6px;
  border-top: 1px solid rgba(255,255,255,.04);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.user-details { display: flex; flex-direction: column; line-height: 1.3; overflow: hidden; }

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 10.5px;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: .04em;
}
</style>