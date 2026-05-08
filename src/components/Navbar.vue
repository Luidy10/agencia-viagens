<template>
  <header v-if="!isAdmin" :class="['navbar', { scrolled: isScrolled }, `theme-${currentTheme}`]">
    <div class="container">

      <!-- LOGO -->
      <div class="logo">
        <span class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
        </span>
        <span class="logo-text">Via<em>Plan</em></span>
      </div>

      <!-- LINKS -->
      <nav class="nav-links">
        <router-link to="/" class="nav-item">
          <Home size="15"/>
          <span>Home</span>
        </router-link>

        <router-link to="/Destinos" class="nav-item">
          <Map size="15"/>
          <span>Destinos</span>
        </router-link>

        <router-link to="/sobrenos" class="nav-item">
          <Info size="15"/>
          <span>Sobre</span>
        </router-link>
      </nav>

      <!-- AÇÕES -->
      <div class="nav-actions">

        <!-- Não logado -->
        <router-link v-if="!usuarioLogado" to="/entrar" class="btn btn-ghost">
          <User size="15"/>
          Entrar
        </router-link>

        <router-link v-if="!usuarioLogado" to="/cadastro" class="btn btn-primary">
          Cadastrar
        </router-link>

        <!-- Logado -->
        <router-link v-if="usuarioLogado" to="/perfil" class="btn btn-ghost">
          <div class="avatar">
            <User size="14"/>
          </div>
          Conta
        </router-link>

        <a v-if="usuarioLogado" @click="logout" class="btn btn-danger">
          <LogOut size="15"/>
          Sair
        </a>

        <!-- MENU "MAIS" -->
        <div class="menu-wrapper">
          <button
            class="btn-hamburger"
            :class="{ active: menuAberto }"
            @click.stop="menuAberto = !menuAberto"
            aria-label="Menu"
          >
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
          </button>

          <div class="dropdown" :class="{ open: menuAberto }">
            <div class="dropdown-header">Mais páginas</div>

            <router-link to="/Comentario" class="dropdown-item" @click="menuAberto = false">
              <MessageSquare size="14" />
              Comentários
            </router-link>

            <router-link to="/contato" class="dropdown-item" @click="menuAberto = false">
              <Mail size="14" />
              Contato
            </router-link>

            <router-link to="/central" class="dropdown-item" @click="menuAberto = false">
              <LifeBuoy size="14" />
              Central de Ajuda
            </router-link>

            <div class="dropdown-divider"></div>

            <router-link to="/politica" class="dropdown-item" @click="menuAberto = false">
              <Lock size="14" />
              Política de Privacidade
            </router-link>

            <router-link to="/termos" class="dropdown-item" @click="menuAberto = false">
              <FileText size="14" />
              Termos de Uso
            </router-link>
          </div>
        </div>

      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useRoute } from "vue-router"
import {
  Home, Map, Info, User, LogOut,
  MessageSquare, Mail, LifeBuoy, Lock, FileText
} from "lucide-vue-next"

const route = useRoute()

const usuarioLogado = ref(false)
const usuario       = ref(null)
const isScrolled    = ref(false)
const currentTheme  = ref("dark")
const menuAberto    = ref(false)

const isAdmin = computed(() => !!(usuario.value?.admin))

const handleSectionChange = (e) => {
  currentTheme.value = e.detail
}

const verificarLogin = () => {
  const raw = sessionStorage.getItem("usuario")
  if (raw) {
    usuarioLogado.value = true
    usuario.value = JSON.parse(raw)
  } else {
    usuarioLogado.value = false
    usuario.value = null
  }
}

const logout = () => {
  sessionStorage.removeItem("usuario")
  usuarioLogado.value = false
  usuario.value = null
  window.location.href = "/"
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const fecharMenu = (e) => {
  if (!e.target.closest(".menu-wrapper")) {
    menuAberto.value = false
  }
}

onMounted(() => {
  verificarLogin()
  window.addEventListener("scroll", handleScroll)
  window.addEventListener("navbar-theme", handleSectionChange)
  document.addEventListener("click", fecharMenu)
})

watch(route, () => {
  verificarLogin()
  menuAberto.value = false
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
  window.removeEventListener("navbar-theme", handleSectionChange)
  document.removeEventListener("click", fecharMenu)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; }

/* ─── NAVBAR BASE ───────────────────────────────────── */
.navbar {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 999;
  transition:
    background 0.6s ease,
    border-color 0.6s ease,
    box-shadow 0.6s ease;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

/* ─── TEMA: HERO (dark) ─────────────────────────────── */
.navbar.theme-dark {
  background: rgba(8, 14, 26, 0.85);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}
.navbar.theme-dark .nav-item {
  color: #64748b;
}
.navbar.theme-dark .nav-item:hover {
  color: #cbd5e1;
  background: rgba(255,255,255,0.04);
}
.navbar.theme-dark .nav-item.router-link-exact-active {
  color: #38bdf8;
  background: rgba(56,189,248,0.07);
}
.navbar.theme-dark .logo-text  { color: #f1f5f9; }
.navbar.theme-dark .logo-icon  {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  box-shadow: 0 4px 14px rgba(14,165,233,0.35);
}
.navbar.theme-dark .btn-ghost  {
  color: #64748b;
  border-color: rgba(255,255,255,0.08);
}
.navbar.theme-dark .btn-ghost:hover {
  color: #cbd5e1;
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.14);
}
.navbar.theme-dark .btn-primary {
  background: linear-gradient(135deg, #38bdf8, #34d399);
  box-shadow: 0 4px 14px rgba(56,189,248,0.25);
}
.navbar.theme-dark .dropdown {
  background: rgba(8, 14, 26, 0.98);
  border-color: rgba(255,255,255,0.09);
}
.navbar.theme-dark .dropdown-item { color: #64748b; }
.navbar.theme-dark .dropdown-item:hover {
  color: #cbd5e1;
  background: rgba(255,255,255,0.04);
}

/* ─── TEMA: MAPA (map) ──────────────────────────────── */
.navbar.theme-map {
  background: rgba(6, 16, 42, 0.94);
  border-bottom-color: rgba(56, 189, 248, 0.25);
  box-shadow: 0 4px 40px rgba(56, 189, 248, 0.1), 0 1px 0 rgba(56,189,248,0.15);
}
.navbar.theme-map .nav-item {
  color: #7dd3fc;
}
.navbar.theme-map .nav-item:hover {
  color: #e0f2fe;
  background: rgba(56,189,248,0.08);
}
.navbar.theme-map .nav-item.router-link-exact-active {
  color: #38bdf8;
  background: rgba(56,189,248,0.14);
}
.navbar.theme-map .logo-text  { color: #e0f2fe; }
.navbar.theme-map .logo-icon  {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  box-shadow: 0 4px 20px rgba(56,189,248,0.5);
}
.navbar.theme-map .btn-ghost  {
  color: #7dd3fc;
  border-color: rgba(56,189,248,0.25);
}
.navbar.theme-map .btn-ghost:hover {
  color: #e0f2fe;
  background: rgba(56,189,248,0.08);
}
.navbar.theme-map .btn-primary {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  box-shadow: 0 4px 14px rgba(56,189,248,0.35);
}
.navbar.theme-map .dropdown {
  background: rgba(6, 16, 42, 0.98);
  border-color: rgba(56,189,248,0.2);
}
.navbar.theme-map .dropdown-item { color: #7dd3fc; }
.navbar.theme-map .dropdown-item:hover {
  color: #e0f2fe;
  background: rgba(56,189,248,0.08);
}

/* ─── TEMA: AVALIAÇÕES (reviews) ────────────────────── */
.navbar.theme-reviews {
  background: rgba(3, 10, 18, 0.95);
  border-bottom-color: rgba(52, 211, 153, 0.25);
  box-shadow: 0 4px 40px rgba(52, 211, 153, 0.08), 0 1px 0 rgba(52,211,153,0.15);
}
.navbar.theme-reviews .nav-item {
  color: #6ee7b7;
}
.navbar.theme-reviews .nav-item:hover {
  color: #d1fae5;
  background: rgba(52,211,153,0.08);
}
.navbar.theme-reviews .nav-item.router-link-exact-active {
  color: #34d399;
  background: rgba(52,211,153,0.14);
}
.navbar.theme-reviews .logo-text  { color: #ecfdf5; }
.navbar.theme-reviews .logo-icon  {
  background: linear-gradient(135deg, #059669, #34d399);
  box-shadow: 0 4px 20px rgba(52,211,153,0.45);
}
.navbar.theme-reviews .btn-ghost  {
  color: #6ee7b7;
  border-color: rgba(52,211,153,0.25);
}
.navbar.theme-reviews .btn-ghost:hover {
  color: #d1fae5;
  background: rgba(52,211,153,0.08);
}
.navbar.theme-reviews .btn-primary {
  background: linear-gradient(135deg, #34d399, #059669);
  box-shadow: 0 4px 14px rgba(52,211,153,0.3);
}
.navbar.theme-reviews .dropdown {
  background: rgba(3, 10, 18, 0.98);
  border-color: rgba(52,211,153,0.2);
}
.navbar.theme-reviews .dropdown-item { color: #6ee7b7; }
.navbar.theme-reviews .dropdown-item:hover {
  color: #d1fae5;
  background: rgba(52,211,153,0.08);
}

/* ─── CONTAINER ─────────────────────────────────────── */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  gap: 32px;
}

/* ─── LOGO ──────────────────────────────────────────── */
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 34px; height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background 0.6s ease, box-shadow 0.6s ease;
}

.logo-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.3px;
  transition: color 0.6s ease;
}

.logo-text em {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  background: linear-gradient(135deg, #38bdf8, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── NAV LINKS ─────────────────────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  padding: 7px 13px;
  border-radius: 10px;
  transition: color 0.4s ease, background 0.4s ease;
  cursor: pointer;
}

/* ─── ACTIONS ───────────────────────────────────────── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.4s ease;
  border: 1px solid transparent;
  white-space: nowrap;
}

.btn-primary {
  color: #080e1a;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
}
.btn-ghost:hover {
  transform: translateY(-1px);
}

.btn-danger {
  color: #fca5a5;
  background: rgba(239,68,68,0.08);
  border-color: rgba(239,68,68,0.15);
}
.btn-danger:hover {
  color: #f87171;
  background: rgba(239,68,68,0.14);
  border-color: rgba(239,68,68,0.3);
}

.avatar {
  width: 22px; height: 22px;
  background: rgba(56,189,248,0.15);
  border: 1px solid rgba(56,189,248,0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
}

/* ─── MENU WRAPPER ──────────────────────────────────── */
.menu-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* ─── HAMBURGUER ────────────────────────────────────── */
.btn-hamburger {
  width: 36px;
  height: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s ease, border-color 0.3s ease;
  flex-shrink: 0;
}

.btn-hamburger:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.14);
}

.btn-hamburger.active {
  background: rgba(56,189,248,0.07);
  border-color: rgba(56,189,248,0.2);
}

.bar {
  display: block;
  width: 16px;
  height: 1.5px;
  border-radius: 2px;
  background: #64748b;
  transition:
    transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
    opacity   0.25s ease,
    width     0.35s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center;
}

.btn-hamburger:hover .bar { background: #cbd5e1; }
.btn-hamburger.active .bar { background: #38bdf8; }

/* ── Animação: 3 traços → X ── */
.btn-hamburger.active .bar-1 {
  transform: translateY(6.5px) rotate(45deg);
}
.btn-hamburger.active .bar-2 {
  opacity: 0;
  width: 0;
}
.btn-hamburger.active .bar-3 {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* ─── DROPDOWN ──────────────────────────────────────── */
.dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 220px;
  border: 1px solid;
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(56,189,248,0.04);
  backdrop-filter: blur(20px);
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px) scale(0.96);
  transition: opacity 0.28s cubic-bezier(0.23, 1, 0.32, 1),
              transform 0.28s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1000;
}

.dropdown.open {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0) scale(1);
}

.dropdown-header {
  padding: 10px 14px 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(100,116,139,0.6);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 14px;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s ease, background 0.2s ease;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 4px 0;
}

/* ─── RESPONSIVE ────────────────────────────────────── */
@media (max-width: 768px) {
  .container   { padding: 12px 16px; gap: 16px; }
  .nav-links   { display: none; }
  .nav-actions { gap: 6px; }
  .btn span    { display: none; }
  .btn         { padding: 8px 10px; }
  .dropdown    { right: 0; }
}
</style>