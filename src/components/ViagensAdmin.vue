<template>
  <div class="page">

    <!-- ═══════════ LEFT PANEL ═══════════ -->
    <aside class="left-panel">
      <div class="left-noise"></div>
      <div class="orb orb-a"></div>
      <div class="orb orb-b"></div>
      <div class="orb orb-c"></div>

      <div class="left-content">
        <div class="brand">
          <span class="brand-gem">✦</span>
          <span class="brand-name">ViaPlan</span>
        </div>

        <div class="admin-badge-wrap">
          <div class="admin-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <p class="admin-label">Modo Administrador</p>
            <p class="admin-sub">Acesso total ao sistema</p>
          </div>
        </div>

        <!-- Stats gerais -->
        <div class="left-stats">
          <div class="stat-block">
            <span class="stat-num">{{ viagens.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-block">
            <span class="stat-num">{{ viagensPagas }}</span>
            <span class="stat-label">Confirmadas</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-block">
            <span class="stat-num">{{ viagensAguardando }}</span>
            <span class="stat-label">Pendentes</span>
          </div>
        </div>

        <!-- Receita total -->
        <div class="left-gasto">
          <p class="gasto-label">Receita confirmada</p>
          <p class="gasto-valor">R$ {{ receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
        </div>

        <!-- Usuários únicos -->
        <div class="left-gasto" style="background:rgba(80,140,220,0.07);border-color:rgba(80,140,220,0.18);">
          <p class="gasto-label" style="color:rgba(120,170,240,0.7)">Clientes ativos</p>
          <p class="gasto-valor" style="color:#7ab0f0">{{ clientesUnicos }}</p>
        </div>

        <div class="left-quote">
          <span class="quote-mark">"</span>
          <p>Administrar é facilitar a jornada de quem sonha em viajar.</p>
        </div>
      </div>
    </aside>

    <!-- ═══════════ RIGHT PANEL ═══════════ -->
    <main class="right-panel">

      <!-- Top bar -->
      <header class="top-bar">
        <div class="top-left">
          <button class="btn-voltar" @click="$router.back()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar
          </button>
        </div>
        <div class="admin-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Admin
        </div>
        <button class="btn-logout" @click="logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sair
        </button>
      </header>

      <div class="content-wrapper">

        <!-- Page header -->
        <div class="page-header">
          <div>
            <h1>Painel de Viagens</h1>
            <p>Todas as reservas de todos os usuários do sistema</p>
          </div>

          <!-- Busca + Filtros -->
          <div class="header-actions">
            <div class="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                v-model="busca"
                class="search-input"
                placeholder="Buscar por nome, email ou destino…"
              />
            </div>
            <div class="filtros">
              <button
                v-for="f in filtros"
                :key="f.id"
                class="filtro-btn"
                :class="{ active: filtroAtivo === f.id }"
                @click="filtroAtivo = f.id"
              >
                <span class="filtro-dot" :class="f.id"></span>
                {{ f.label }}
                <span class="filtro-count">{{ contarFiltro(f.id) }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="estado-vazio">
          <div class="loading-ring"></div>
          <p>Carregando viagens...</p>
        </div>

        <!-- Vazio -->
        <div v-else-if="viagensFiltradas.length === 0" class="estado-vazio">
          <div class="vazio-icone">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 17h18M6.5 17l1-5.5L12 13l4.5-8 1 8L21 17"/></svg>
          </div>
          <p class="vazio-titulo">Nenhuma viagem encontrada</p>
          <p class="vazio-sub">{{ busca ? 'Tente outra busca.' : 'Ainda não há reservas no sistema.' }}</p>
        </div>

        <!-- Tabela de viagens -->
        <div v-else class="tabela-wrap">
          <table class="tabela">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Destino</th>
                <th>Período</th>
                <th>Passageiros</th>
                <th>Total</th>
                <th>Status</th>
                <th>Reservado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(viagem, idx) in viagensFiltradas"
                :key="viagem._id"
                :style="{ animationDelay: idx * 0.04 + 's' }"
                class="tabela-row"
              >
                <!-- Cliente -->
                <td class="td-cliente">
                  <div class="cliente-info">
                    <div class="cliente-avatar">{{ iniciais(viagem.nome) }}</div>
                    <div>
                      <p class="cliente-nome">{{ viagem.nome }}</p>
                      <p class="cliente-email">{{ viagem.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Destino -->
                <td class="td-destino">
                  <div class="destino-chip">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 018 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 018-8z"/></svg>
                    {{ viagem.destino }}
                  </div>
                </td>

                <!-- Período -->
                <td class="td-periodo">
                  <span class="periodo-text">{{ formatarData(viagem.dataIda) }}</span>
                  <span class="periodo-seta">→</span>
                  <span class="periodo-text">{{ formatarData(viagem.dataVolta) }}</span>
                  <span class="periodo-dias" v-if="calcularDias(viagem.dataIda, viagem.dataVolta)">
                    {{ calcularDias(viagem.dataIda, viagem.dataVolta) }}d
                  </span>
                </td>

                <!-- Passageiros -->
                <td class="td-center">
                  <div class="passageiros-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    {{ viagem.pessoas }}
                  </div>
                </td>

                <!-- Total -->
                <td class="td-preco">
                  R$ {{ Number(viagem.precoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </td>

                <!-- Status -->
                <td>
                  <span class="status-pill" :class="viagem.status">
                    <span class="status-dot"></span>
                    {{ statusLabel(viagem.status) }}
                  </span>
                </td>

                <!-- Data criação -->
                <td class="td-data">{{ formatarDataCriacao(viagem.createdAt) }}</td>

                <!-- Ações -->
                <td class="td-acoes">
                  <button
                    v-if="viagem.status === 'aguardando'"
                    class="btn-pagar"
                    @click="confirmarPagamento(viagem._id)"
                    title="Confirmar pagamento"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button
                    class="btn-excluir"
                    @click="remover(viagem._id, viagem.nome, viagem.destino)"
                    title="Excluir reserva"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </main>

    <!-- Modal de confirmação de exclusão -->
    <Transition name="modal">
      <div v-if="modalExcluir" class="modal-overlay" @click.self="modalExcluir = null">
        <div class="modal-box">
          <div class="modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3>Excluir reserva?</h3>
          <p>Tem certeza que deseja excluir a viagem de <strong>{{ modalExcluir.nome }}</strong> para <strong>{{ modalExcluir.destino }}</strong>? Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button class="btn-cancelar-modal" @click="modalExcluir = null">Cancelar</button>
            <button class="btn-confirmar-modal" @click="confirmarExclusao">Excluir</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import api from "@/services/api"

// ── State ─────────────────────────────────────────
const viagens     = ref([])
const loading     = ref(true)
const filtroAtivo = ref("todas")
const busca       = ref("")
const modalExcluir = ref(null)

// ── Filtros ────────────────────────────────────────
const filtros = [
  { id: "todas",      label: "Todas"       },
  { id: "aguardando", label: "Pendentes"   },
  { id: "pago",       label: "Confirmadas" },
  { id: "cancelado",  label: "Canceladas"  },
]

// ── Stats ──────────────────────────────────────────
const viagensPagas     = computed(() => viagens.value.filter(v => v.status === "pago").length)
const viagensAguardando = computed(() => viagens.value.filter(v => v.status === "aguardando").length)
const receitaTotal     = computed(() =>
  viagens.value.filter(v => v.status === "pago").reduce((a, v) => a + (v.precoTotal || 0), 0)
)
const clientesUnicos   = computed(() => new Set(viagens.value.map(v => v.email)).size)

// ── Filtradas ──────────────────────────────────────
const viagensFiltradas = computed(() => {
  let lista = [...viagens.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (filtroAtivo.value !== "todas") lista = lista.filter(v => v.status === filtroAtivo.value)
  if (busca.value.trim()) {
    const q = busca.value.toLowerCase()
    lista = lista.filter(v =>
      v.nome?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.destino?.toLowerCase().includes(q)
    )
  }
  return lista
})

function contarFiltro(id) {
  if (id === "todas") return viagens.value.length
  return viagens.value.filter(v => v.status === id).length
}

// ── Helpers ────────────────────────────────────────
function iniciais(nome) {
  if (!nome) return "?"
  return nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
}

function formatarData(data) {
  if (!data) return "-"
  const [ano, mes, dia] = data.split("-")
  return `${dia}/${mes}/${ano}`
}

function formatarDataCriacao(data) {
  if (!data) return "-"
  return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

function calcularDias(ida, volta) {
  if (!ida || !volta) return null
  const diff = Math.round((new Date(volta) - new Date(ida)) / 86400000)
  return diff > 0 ? diff : null
}

function statusLabel(status) {
  return { pago: "Confirmada", aguardando: "Pendente", cancelado: "Cancelada" }[status] || status
}

// ── Ações ──────────────────────────────────────────
async function carregar() {
  try {
    const { data } = await api.get("/viagens")
    viagens.value = data
  } catch (e) {
    console.error("Erro ao buscar viagens:", e)
  } finally {
    loading.value = false
  }
}

async function confirmarPagamento(id) {
  try {
    await api.post(`/viagens/pagar/${id}`)
    await carregar()
  } catch (e) {
    alert("Erro ao confirmar pagamento.")
  }
}

function remover(id, nome, destino) {
  modalExcluir.value = { id, nome, destino }
}

async function confirmarExclusao() {
  try {
    const adminId = JSON.parse(localStorage.getItem("usuario") || "{}")._id
    await api.delete(`/viagens/${modalExcluir.value.id}`, {
      headers: { userid: adminId }
    })
    modalExcluir.value = null
    await carregar()
  } catch (e) {
    alert("Erro ao excluir viagem. Verifique se você tem permissão de admin.")
    modalExcluir.value = null
  }
}

function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("usuario")
  sessionStorage.removeItem("usuario")
  window.location.href = "/"
}

// ── Mount ──────────────────────────────────────────
onMounted(carregar)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', sans-serif;
}

/* ═══════════════════════════════════════
   LEFT PANEL — idêntico ao histórico
═══════════════════════════════════════ */
.left-panel {
  position: relative;
  width: 300px;
  flex-shrink: 0;
  background: #040810;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 52px 40px;
}
.left-noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.035; pointer-events: none;
}
.orb { position: absolute; border-radius: 50%; pointer-events: none; }
.orb-a { width: 400px; height: 400px; background: radial-gradient(circle, rgba(196,155,80,0.16) 0%, transparent 65%); top: -160px; left: -120px; }
.orb-b { width: 280px; height: 280px; background: radial-gradient(circle, rgba(80,140,220,0.08) 0%, transparent 65%); bottom: -80px; right: -60px; }
.orb-c { width: 160px; height: 160px; background: radial-gradient(circle, rgba(196,155,80,0.1) 0%, transparent 65%); top: 55%; left: 50%; }

.left-content {
  position: relative; z-index: 1;
  display: flex; flex-direction: column;
  gap: 28px; width: 100%;
}

.brand { display: flex; align-items: center; gap: 9px; }
.brand-gem { color: #c49b50; font-size: 15px; filter: drop-shadow(0 0 6px rgba(196,155,80,0.5)); }
.brand-name { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-weight: 600; color: rgba(232,220,200,0.85); letter-spacing: 1.5px; text-transform: uppercase; }

.admin-badge-wrap {
  display: flex; align-items: center; gap: 14px;
  padding: 16px; border-radius: 12px;
  background: rgba(196,155,80,0.07);
  border: 1px solid rgba(196,155,80,0.2);
}
.admin-icon {
  width: 44px; height: 44px; border-radius: 10px;
  background: rgba(196,155,80,0.12);
  display: flex; align-items: center; justify-content: center;
  color: #c49b50; flex-shrink: 0;
}
.admin-label { font-size: 12.5px; font-weight: 600; color: #c49b50; margin-bottom: 2px; }
.admin-sub { font-size: 10.5px; color: rgba(196,155,80,0.5); }

.left-stats {
  display: flex; align-items: center; gap: 16px;
  padding: 18px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06);
}
.stat-block { display: flex; flex-direction: column; gap: 2px; }
.stat-num { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: #f0e8d8; line-height: 1; }
.stat-label { font-size: 9.5px; color: #4a5568; text-transform: uppercase; letter-spacing: 1px; }
.stat-sep { width: 1px; height: 30px; background: rgba(255,255,255,0.06); }

.left-gasto { background: rgba(196,155,80,0.07); border: 1px solid rgba(196,155,80,0.15); border-radius: 10px; padding: 14px 16px; }
.gasto-label { font-size: 10px; color: rgba(196,155,80,0.6); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.gasto-valor { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: #c49b50; }

.left-quote { padding-top: 4px; }
.quote-mark { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; line-height: 0.5; color: #c49b50; display: block; margin-bottom: 8px; }
.left-quote p { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-style: italic; color: #4a5568; line-height: 1.7; }

/* ═══════════════════════════════════════
   RIGHT PANEL
═══════════════════════════════════════ */
.right-panel {
  flex: 1;
  background: #f7f4ef;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.top-bar {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 12px; padding: 16px 36px; flex-shrink: 0;
  background: #f7f4ef;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  position: sticky; top: 0; z-index: 10;
}
.top-left { margin-right: auto; }

.btn-voltar {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; background: white;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.btn-voltar:hover { border-color: #c49b50; color: #c49b50; }

.admin-pill {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 13px; border-radius: 100px;
  background: rgba(196,155,80,0.1);
  border: 1px solid rgba(196,155,80,0.3);
  font-size: 12px; font-weight: 600; color: #c49b50;
}

.btn-logout {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; background: white;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.btn-logout:hover { border-color: #dc2626; color: #dc2626; background: #fef2f2; }

.content-wrapper { padding: 32px 36px 48px; }

/* Page header */
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 20px; margin-bottom: 24px; flex-wrap: wrap;
}
.page-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.9rem; font-weight: 600; color: #0f172a; margin-bottom: 4px;
}
.page-header > div > p { font-size: 13px; color: #94a3b8; font-weight: 300; }

.header-actions {
  display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
}

/* Busca */
.search-wrap {
  display: flex; align-items: center; gap: 9px;
  background: white; border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 9px 14px; min-width: 280px;
  transition: border-color 0.2s;
}
.search-wrap:focus-within { border-color: #c49b50; }
.search-wrap svg { color: #94a3b8; flex-shrink: 0; }
.search-input {
  border: none; outline: none; background: transparent;
  font-family: 'Outfit', sans-serif; font-size: 13px; color: #0f172a; width: 100%;
}
.search-input::placeholder { color: #cbd5e1; }

/* Filtros */
.filtros { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.filtro-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 13px; background: white;
  border: 1.5px solid #e2e8f0; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.filtro-btn.active { background: #0f172a; border-color: #0f172a; color: white; }
.filtro-btn:not(.active):hover { border-color: #c49b50; color: #c49b50; }
.filtro-dot { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; }
.filtro-btn.active .filtro-dot { background: rgba(255,255,255,0.4); }
.filtro-dot.pago { background: #22c55e; }
.filtro-dot.aguardando { background: #f59e0b; }
.filtro-dot.cancelado { background: #ef4444; }
.filtro-count { background: rgba(0,0,0,0.07); border-radius: 100px; padding: 1px 7px; font-size: 10.5px; font-weight: 600; }
.filtro-btn.active .filtro-count { background: rgba(255,255,255,0.12); }

/* Estado vazio / loading */
.estado-vazio {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 14px;
  padding: 80px 20px; text-align: center;
}
.loading-ring {
  width: 38px; height: 38px;
  border: 3px solid #e2e8f0; border-top-color: #c49b50;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.vazio-icone {
  width: 64px; height: 64px;
  background: white; border: 1.5px solid #e9e3d8; border-radius: 16px;
  display: flex; align-items: center; justify-content: center; color: #c49b50;
}
.vazio-titulo { font-size: 15px; font-weight: 600; color: #0f172a; }
.vazio-sub { font-size: 13px; color: #94a3b8; font-weight: 300; }

/* ═══════════════════════════════════════
   TABELA
═══════════════════════════════════════ */
.tabela-wrap {
  background: white;
  border: 1.5px solid #e9e3d8;
  border-radius: 14px;
  overflow: hidden;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
}

.tabela thead tr {
  background: #faf8f4;
  border-bottom: 1px solid #e9e3d8;
}

.tabela th {
  padding: 12px 16px;
  text-align: left;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
  white-space: nowrap;
}

.tabela-row {
  border-bottom: 1px solid #f0ebe2;
  transition: background 0.15s;
  animation: fadeIn 0.35s ease both;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tabela-row:last-child { border-bottom: none; }
.tabela-row:hover { background: #faf8f4; }

.tabela td {
  padding: 13px 16px;
  font-size: 13px;
  color: #334155;
  vertical-align: middle;
}

/* Cliente */
.td-cliente { min-width: 200px; }
.cliente-info { display: flex; align-items: center; gap: 10px; }
.cliente-avatar {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #c49b50, #e8dcc8);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #040810;
}
.cliente-nome { font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 2px; line-height: 1.2; }
.cliente-email { font-size: 11px; color: #94a3b8; font-weight: 300; }

/* Destino */
.destino-chip {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12.5px; font-weight: 500; color: #0f172a;
}
.destino-chip svg { color: #c49b50; flex-shrink: 0; }

/* Período */
.td-periodo { white-space: nowrap; }
.periodo-text { font-size: 12.5px; color: #334155; }
.periodo-seta { color: #c49b50; font-weight: 600; margin: 0 4px; font-size: 12px; }
.periodo-dias {
  margin-left: 5px; font-size: 10.5px; color: #94a3b8;
  background: #f1f5f9; padding: 2px 6px; border-radius: 4px;
}

/* Centro */
.td-center { text-align: center; }
.passageiros-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;
  padding: 4px 10px; font-size: 12px; font-weight: 500; color: #475569;
}

/* Preço */
.td-preco { font-family: 'Playfair Display', serif; font-weight: 700; color: #c49b50; font-size: 14px; white-space: nowrap; }

/* Status */
.status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px; border-radius: 100px;
  font-size: 11px; font-weight: 600; white-space: nowrap;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.status-pill.pago { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.status-pill.pago .status-dot { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }
.status-pill.aguardando { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.status-pill.aguardando .status-dot { background: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,0.2); }
.status-pill.cancelado { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
.status-pill.cancelado .status-dot { background: #ef4444; }

/* Data */
.td-data { font-size: 12px; color: #94a3b8; white-space: nowrap; }

/* Ações */
.td-acoes { white-space: nowrap; }
.btn-pagar, .btn-excluir {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px;
  border: 1.5px solid; cursor: pointer; transition: all 0.18s;
}
.btn-pagar {
  background: #f0fdf4; border-color: #bbf7d0; color: #15803d;
  margin-right: 6px;
}
.btn-pagar:hover { background: #22c55e; border-color: #22c55e; color: white; transform: scale(1.08); }
.btn-excluir {
  background: #fef2f2; border-color: #fecaca; color: #b91c1c;
}
.btn-excluir:hover { background: #ef4444; border-color: #ef4444; color: white; transform: scale(1.08); }

/* ═══════════════════════════════════════
   MODAL
═══════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(4,8,16,0.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
}
.modal-box {
  background: white; border-radius: 18px;
  padding: 36px 32px; max-width: 420px; width: 90%;
  box-shadow: 0 32px 80px rgba(0,0,0,0.3);
  text-align: center;
}
.modal-icon {
  width: 54px; height: 54px; border-radius: 14px;
  background: #fef2f2; border: 1.5px solid #fecaca;
  display: flex; align-items: center; justify-content: center;
  color: #ef4444; margin: 0 auto 20px;
}
.modal-box h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem; font-weight: 600; color: #0f172a; margin-bottom: 10px;
}
.modal-box p { font-size: 13.5px; color: #64748b; line-height: 1.7; margin-bottom: 28px; }
.modal-box p strong { color: #0f172a; }
.modal-actions { display: flex; gap: 10px; }
.btn-cancelar-modal {
  flex: 1; padding: 11px; background: white;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.btn-cancelar-modal:hover { border-color: #94a3b8; color: #0f172a; }
.btn-confirmar-modal {
  flex: 1; padding: 11px; background: #ef4444;
  border: none; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600; color: white;
  cursor: pointer; transition: all 0.2s;
}
.btn-confirmar-modal:hover { background: #dc2626; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(239,68,68,0.3); }

.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(0.95) translateY(10px); }

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 900px) {
  .left-panel { display: none; }
  .content-wrapper { padding: 20px 16px 40px; }
  .top-bar { padding: 12px 16px; }
  .page-header { flex-direction: column; gap: 14px; }
  .header-actions { align-items: stretch; width: 100%; }
  .search-wrap { min-width: unset; width: 100%; }
  .filtros { justify-content: flex-start; }
  .tabela-wrap { overflow-x: auto; }
}
</style>