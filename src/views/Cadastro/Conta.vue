<template>
  <div class="dashboard">

    <div class="bg-grid"></div>

    <main class="main">

      <header class="topbar">
        <div class="topbar-left">
          <h1 class="page-title">Painel de Usuários</h1>
          <p class="page-sub">Gerencie e visualize todos os registros</p>
        </div>
        <button class="btn-new" @click="$router.push('/cadastro')">
          <span class="btn-plus">+</span>
          Novo Usuário
        </button>
      </header>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">Total de Usuários</span>
          <span class="stat-value">{{ usuarios.length }}</span>
          <span class="stat-badge green">Ativos</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Cadastros Hoje</span>
          <span class="stat-value">—</span>
          <span class="stat-badge blue">Recentes</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Última Atualização</span>
          <span class="stat-value stat-small">agora</span>
          <span class="stat-badge gray">Sistema</span>
        </div>
      </div>

      <div class="table-card">
        <div class="table-toolbar">
          <span class="table-title">Registros</span>
          <span class="record-count">{{ usuarios.length }} encontrados</span>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Senha</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(u, i) in usuarios" :key="u._id" class="table-row">
                <td class="col-index">{{ i + 1 }}</td>
                <td class="col-nome">
                  <div class="user-cell">
                    <div class="avatar">{{ u.nome.charAt(0).toUpperCase() }}</div>
                    <span>{{ u.nome }}</span>
                  </div>
                </td>
                <td class="col-email">{{ u.email }}</td>
                <td class="col-idade">
                  <span class="pill">••••••••</span>
                </td>
                <td class="col-actions">
                  <button class="btn-action edit" @click="editar(u._id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                  </button>
                  <button class="btn-action delete" @click="excluir(u._id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="usuarios.length === 0">
                <td colspan="5" class="empty-state">Nenhum usuário encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      usuarios: [],
    };
  },

  mounted() {
    this.carregar();
  },

  methods: {
    async carregar() {
      const res = await api.get("/usuarios");
      this.usuarios = res.data;
    },

    editar(id) {
      this.$router.push(`/editar/${id}`);
    },

    async excluir(id) {
      await api.delete(`/usuarios/${id}`);
      this.carregar();
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* ── Reset & Base ─────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard {
  display: flex;
  min-height: 100vh;
  background: #0d0f14;
  font-family: 'DM Sans', sans-serif;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
}

/* ── Background Grid ──────────────────────────── */
.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* ── Sidebar ──────────────────────────────────── */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #111318;
  border-right: 1px solid rgba(255,255,255,.06);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 28px 16px;
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 28px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 22px;
  color: #6366f1;
  line-height: 1;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: .04em;
  color: #f1f5f9;
}

.sidebar-nav { display: flex; flex-direction: column; gap: 4px; }

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
}

.nav-item:hover { background: rgba(255,255,255,.05); color: #cbd5e1; }

.nav-item.active {
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

/* ── Main ─────────────────────────────────────── */
.main {
  flex: 1;
  padding: 36px 40px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ── Topbar ───────────────────────────────────── */
.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -.02em;
  line-height: 1.2;
}

.page-sub {
  font-size: 13.5px;
  color: #475569;
  margin-top: 4px;
}

.btn-new {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 11px 20px;
  border-radius: 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all .18s ease;
  box-shadow: 0 4px 20px rgba(99,102,241,.35);
  white-space: nowrap;
}

.btn-new:hover {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(99,102,241,.45);
}

.btn-plus {
  font-size: 18px;
  line-height: 1;
  font-weight: 400;
}

/* ── Stats ────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: #111318;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 14px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color .2s;
}

.stat-card:hover { border-color: rgba(99,102,241,.3); }

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.stat-value {
  font-size: 30px;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.1;
  font-family: 'DM Mono', monospace;
}

.stat-value.stat-small { font-size: 20px; }

.stat-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
  letter-spacing: .04em;
}

.stat-badge.green { background: rgba(34,197,94,.12); color: #4ade80; }
.stat-badge.blue  { background: rgba(99,102,241,.12); color: #818cf8; }
.stat-badge.gray  { background: rgba(100,116,139,.12); color: #64748b; }

/* ── Table Card ───────────────────────────────── */
.table-card {
  background: #111318;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px;
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
}

.record-count {
  font-size: 12px;
  color: #475569;
  font-family: 'DM Mono', monospace;
}

.table-wrapper { overflow-x: auto; }

table {
  width: 100%;
  border-collapse: collapse;
}

thead tr { background: #0d0f14; }

th {
  padding: 12px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #475569;
}

td {
  padding: 14px 18px;
  font-size: 14px;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255,255,255,.05);
  vertical-align: middle;
}

.table-row { transition: background .15s ease; }
.table-row:hover { background: rgba(255,255,255,.03); }
.table-row:last-child td { border-bottom: none; }

/* ── Cell Styles ──────────────────────────────── */
.col-index {
  color: #334155;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  width: 40px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
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
  letter-spacing: 0;
}

.col-email { color: #64748b; font-family: 'DM Mono', monospace; font-size: 13px; }

.pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: rgba(100,116,139,.1);
  border: 1px solid rgba(100,116,139,.15);
  border-radius: 20px;
  font-size: 12.5px;
  color: #94a3b8;
}

/* ── Action Buttons ───────────────────────────── */
.col-actions { display: flex; gap: 8px; }

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s ease;
}

.btn-action svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.btn-action.edit {
  background: rgba(99,102,241,.15);
  color: #818cf8;
}

.btn-action.edit:hover {
  background: rgba(99,102,241,.28);
  transform: translateY(-1px);
}

.btn-action.delete {
  background: rgba(239,68,68,.12);
  color: #f87171;
}

.btn-action.delete:hover {
  background: rgba(239,68,68,.25);
  transform: translateY(-1px);
}

/* ── Empty State ──────────────────────────────── */
.empty-state {
  text-align: center;
  color: #334155;
  font-size: 14px;
  padding: 48px 0 !important;
}

/* ── Sidebar extras ───────────────────────────── */
.nav-dropdown-trigger {
  user-select: none;
}

.chevron {
  margin-left: auto;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  opacity: .5;
  transition: transform .25s ease, opacity .2s;
}

.chevron svg { width: 100%; height: 100%; }
.chevron.open { transform: rotate(180deg); opacity: 1; }

/* Stats dropdown panel */
.stats-dropdown {
  margin: 4px 0 6px 12px;
  border-left: 2px solid rgba(99,102,241,.25);
  padding: 10px 0 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

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

.stat-info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.stat-name {
  font-size: 11px;
  color: #475569;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.stat-num {
  font-size: 15px;
  font-weight: 700;
  color: #e2e8f0;
  font-family: 'DM Mono', monospace;
}

/* Slide animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all .25s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0);
}

/* Sidebar footer */
.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,.06);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  transition: background .15s;
  cursor: default;
}

.sidebar-user:hover { background: rgba(255,255,255,.04); }

.user-avatar {
  width: 32px;
  height: 32px;
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

.user-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}
</style>