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

        <div class="left-avatar-ring">
          <img :src="fotoUsuario" class="left-avatar" />
        </div>

        <div class="left-user-info">
          <h2 class="left-name">{{ usuario.nome || "Viajante" }}</h2>
          <span class="left-badge">
            <span class="badge-dot"></span>
            Membro ativo
          </span>
        </div>

        <!-- Stats dinâmicos -->
        <div class="left-stats">
          <div class="stat-block">
            <span class="stat-num">{{ totalViagens }}</span>
            <span class="stat-label">Viagens</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-block">
            <span class="stat-num">{{ viagensPagas }}</span>
            <span class="stat-label">Confirmadas</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-block">
            <span class="stat-num">{{ totalPessoas }}</span>
            <span class="stat-label">Passageiros</span>
          </div>
        </div>

        <!-- Valor total gasto -->
        <div class="left-gasto" v-if="totalGasto > 0">
          <p class="gasto-label">Total investido em viagens</p>
          <p class="gasto-valor">R$ {{ totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
        </div>

        <div class="left-quote">
          <span class="quote-mark">"</span>
          <p>Viajar é a única coisa que você compra que te torna mais rico.</p>
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
        <div class="usuario-info">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="usuario-nome">{{ usuario.nome }}</span>
        </div>
        <button class="btn-logout" @click="logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sair
        </button>
      </header>

      <div class="content-wrapper">

        <!-- Cabeçalho da página -->
        <div class="page-header">
          <div>
            <h1>Histórico de viagens</h1>
            <p>Acompanhe todas as suas reservas e status de pagamento</p>
          </div>

          <!-- Filtros -->
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

        <!-- Loading -->
        <div v-if="loading" class="estado-vazio">
          <div class="loading-ring"></div>
          <p>Carregando suas viagens...</p>
        </div>

        <!-- Vazio -->
        <div v-else-if="viagensFiltradas.length === 0" class="estado-vazio">
          <div class="vazio-icone">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 17h18M6.5 17l1-5.5L12 13l4.5-8 1 8L21 17"/></svg>
          </div>
          <p class="vazio-titulo">Nenhuma viagem {{ filtroAtivo !== 'todas' ? 'com este status' : 'encontrada' }}</p>
          <p class="vazio-sub">{{ filtroAtivo === 'todas' ? 'Você ainda não fez nenhuma reserva.' : 'Tente outro filtro.' }}</p>
          <button class="btn-reservar" @click="$router.push('/viagens')">
            Reservar agora
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Lista de viagens -->
        <div v-else class="viagens-grid">
          <div
            v-for="(viagem, idx) in viagensFiltradas"
            :key="viagem._id"
            class="viagem-card"
            :style="{ animationDelay: idx * 0.06 + 's' }"
            :class="{ 'card-expandido': expandido === viagem._id }"
          >
            <!-- Topo do card -->
            <div class="card-top" @click="toggleExpandir(viagem._id)">

              <!-- Status pill -->
              <div class="card-status-wrap">
                <span class="status-pill" :class="viagem.status">
                  <span class="status-dot"></span>
                  {{ statusLabel(viagem.status) }}
                </span>
                <span class="card-data-criacao">
                  Reservado em {{ formatarDataCriacao(viagem.createdAt) }}
                </span>
              </div>

              <!-- Destino + datas -->
              <div class="card-destino-row">
                <div class="card-destino-info">
                  <div class="destino-icone">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 018 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 018-8z"/></svg>
                  </div>
                  <div>
                    <h3 class="card-destino-nome">{{ viagem.destino }}</h3>
                    <p class="card-periodo">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      {{ formatarData(viagem.dataIda) }}
                      <span class="periodo-seta">→</span>
                      {{ formatarData(viagem.dataVolta) }}
                      <span class="periodo-duracao" v-if="calcularDias(viagem.dataIda, viagem.dataVolta)">
                        · {{ calcularDias(viagem.dataIda, viagem.dataVolta) }}d
                      </span>
                    </p>
                  </div>
                </div>
                <div class="card-preco-wrap">
                  <span class="card-preco-label">Total</span>
                  <span class="card-preco">R$ {{ Number(viagem.precoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
                </div>
              </div>

              <!-- Quem agendou + passageiros -->
              <div class="card-meta-row">
                <div class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>{{ viagem.nome }}</span>
                </div>
                <div class="meta-sep">·</div>
                <div class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>{{ viagem.email }}</span>
                </div>
                <div class="meta-sep">·</div>
                <div class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  <span>{{ viagem.pessoas }} {{ viagem.pessoas === 1 ? 'passageiro' : 'passageiros' }}</span>
                </div>
              </div>

              <!-- Chevron expandir -->
              <div class="card-chevron" :class="{ rotated: expandido === viagem._id }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>

            <!-- Detalhes expandidos -->
            <Transition name="expand">
              <div v-if="expandido === viagem._id" class="card-detalhes">
                <div class="detalhes-sep"></div>

                <div class="detalhes-grid">

                  <!-- Horários -->
                  <div class="detalhe-bloco" v-if="viagem.horarioIda || viagem.horarioVolta">
                    <p class="detalhe-titulo">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Horários
                    </p>
                    <div class="detalhe-rows">
                      <div class="detalhe-row" v-if="viagem.horarioIda">
                        <span class="detalhe-label">Ida</span>
                        <span class="detalhe-val">{{ viagem.horarioIda }}</span>
                      </div>
                      <div class="detalhe-row" v-if="viagem.horarioVolta">
                        <span class="detalhe-label">Volta</span>
                        <span class="detalhe-val">{{ viagem.horarioVolta }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Assentos -->
                  <div class="detalhe-bloco" v-if="viagem.assentos && viagem.assentos.length">
                    <p class="detalhe-titulo">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
                      Assentos ({{ viagem.assentos.length }})
                    </p>
                    <div class="assentos-wrap">
                      <div
                        v-for="assento in viagem.assentos"
                        :key="assento.numero"
                        class="assento-chip"
                        :class="assento.tipo?.toLowerCase()"
                      >
                        <span class="assento-num">{{ assento.numero }}</span>
                        <span class="assento-tipo">{{ assento.tipo }}</span>
                        <span class="assento-extra" v-if="assento.precoExtra > 0">+R$ {{ assento.precoExtra }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Resumo de preço -->
                  <div class="detalhe-bloco detalhe-preco-bloco">
                    <p class="detalhe-titulo">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                      Resumo financeiro
                    </p>
                    <div class="detalhe-rows">
                      <div class="detalhe-row">
                        <span class="detalhe-label">{{ viagem.pessoas }} passageiro(s)</span>
                        <span class="detalhe-val">{{ calcularBasePassageiros(viagem) }}</span>
                      </div>
                      <div class="detalhe-row" v-if="calcularExtraAssentos(viagem) > 0">
                        <span class="detalhe-label">Extra assentos</span>
                        <span class="detalhe-val">+ R$ {{ calcularExtraAssentos(viagem).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
                      </div>
                      <div class="detalhe-row detalhe-total-row">
                        <span class="detalhe-label">Total pago</span>
                        <span class="detalhe-val detalhe-total-val">R$ {{ Number(viagem.precoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Rodapé do card: ID + botão de cancelamento -->
                <div class="card-rodape">
                  <div class="reserva-id">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                    ID da reserva: <code>{{ viagem._id }}</code>
                  </div>

                  <!-- Botão cancelar — somente para viagens pendentes -->
                  <button
                    v-if="viagem.status === 'aguardando'"
                    class="btn-cancelar"
                    :disabled="cancelando === viagem._id"
                    @click.stop="confirmarCancelamento(viagem)"
                  >
                    <span class="spin-cancel" v-if="cancelando === viagem._id"></span>
                    <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    {{ cancelando === viagem._id ? 'Cancelando...' : 'Cancelar reserva' }}
                  </button>
                </div>
              </div>
            </Transition>

          </div>
        </div>

      </div>
    </main>

    <!-- ═══════════ MODAL DE CONFIRMAÇÃO ═══════════ -->
    <Transition name="modal-fade">
      <div v-if="modalCancelar" class="modal-overlay" @click.self="modalCancelar = null">
        <div class="modal-box">
          <div class="modal-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3 class="modal-titulo">Cancelar reserva?</h3>
          <p class="modal-destino">{{ modalCancelar?.destino }}</p>
          <p class="modal-aviso">
            Esta ação não pode ser desfeita. Sua reserva será marcada como cancelada e você receberá uma confirmação por e-mail.
          </p>
          <div class="modal-acoes">
            <button class="modal-btn-voltar" @click="modalCancelar = null">
              Manter reserva
            </button>
            <button class="modal-btn-confirmar" @click="executarCancelamento">
              Sim, cancelar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast de feedback -->
    <Transition name="toast-slide">
      <div v-if="toast" :class="['toast', toast.tipo]">
        <svg v-if="toast.tipo === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ toast.texto }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import api from "@/services/api"

// ── State ─────────────────────────────────────────
const usuario     = ref({})
const viagens     = ref([])
const loading     = ref(true)
const filtroAtivo = ref("todas")
const expandido   = ref(null)
const cancelando  = ref(null)
const modalCancelar = ref(null)
const toast       = ref(null)

// ── Filtros ────────────────────────────────────────
const filtros = [
  { id: "todas",      label: "Todas"       },
  { id: "aguardando", label: "Pendentes"   },
  { id: "pago",       label: "Confirmadas" },
  { id: "cancelado",  label: "Canceladas"  },
]

// ── Foto ───────────────────────────────────────────
const fotoUsuario = computed(() => {
  return usuario.value.foto
    ? `${import.meta.env.VITE_API_URL}${usuario.value.foto}`
    : "/img/perfil.png"
})

// ── Stats ──────────────────────────────────────────
const totalViagens = computed(() => viagens.value.length)
const viagensPagas = computed(() => viagens.value.filter(v => v.status === "pago").length)
const totalPessoas = computed(() => viagens.value.reduce((a, v) => a + (v.pessoas || 0), 0))
const totalGasto   = computed(() =>
  viagens.value
    .filter(v => v.status === "pago")
    .reduce((a, v) => a + (v.precoTotal || 0), 0)
)

// ── Viagens filtradas ─────────────────────────────
const viagensFiltradas = computed(() => {
  const lista = [...viagens.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (filtroAtivo.value === "todas") return lista
  return lista.filter(v => v.status === filtroAtivo.value)
})

function contarFiltro(id) {
  if (id === "todas") return viagens.value.length
  return viagens.value.filter(v => v.status === id).length
}

// ── Helpers ────────────────────────────────────────
function formatarData(data) {
  if (!data) return "-"
  const [ano, mes, dia] = data.split("-")
  return `${dia}/${mes}/${ano}`
}

function formatarDataCriacao(data) {
  if (!data) return "-"
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric"
  })
}

function calcularDias(ida, volta) {
  if (!ida || !volta) return null
  const diff = Math.round((new Date(volta) - new Date(ida)) / 86400000)
  return diff > 0 ? diff : null
}

function statusLabel(status) {
  const map = {
    pago:       "Confirmada",
    aguardando: "Pendente",
    cancelado:  "Cancelada"
  }
  return map[status] || status
}

function toggleExpandir(id) {
  expandido.value = expandido.value === id ? null : id
}

function calcularExtraAssentos(viagem) {
  if (!viagem.assentos?.length) return 0
  return viagem.assentos.reduce((a, s) => a + (s.precoExtra || 0), 0)
}

function calcularBasePassageiros(viagem) {
  const extra = calcularExtraAssentos(viagem)
  const base  = (viagem.precoTotal || 0) - extra
  return `R$ ${base.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
}

function mostrarToast(texto, tipo = "success") {
  toast.value = { texto, tipo }
  setTimeout(() => { toast.value = null }, 3500)
}

// ── Cancelamento ───────────────────────────────────
function confirmarCancelamento(viagem) {
  modalCancelar.value = viagem
}

async function executarCancelamento() {
  const viagem = modalCancelar.value
  if (!viagem) return
  modalCancelar.value = null
  cancelando.value = viagem._id

  try {
    await api.put(`/viagens/${viagem._id}/cancelar`)
    const idx = viagens.value.findIndex(v => v._id === viagem._id)
    if (idx !== -1) viagens.value[idx].status = "cancelado"
    mostrarToast("Reserva cancelada com sucesso.")
  } catch (e) {
    const msg = e.response?.data?.erro || "Erro ao cancelar. Tente novamente."
    mostrarToast(msg, "error")
  } finally {
    cancelando.value = null
    expandido.value = null
  }
}

// ── Logout ─────────────────────────────────────────
function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("usuario")
  sessionStorage.removeItem("usuario")
  window.location.href = "/"
}

// ── Mount ──────────────────────────────────────────
onMounted(async () => {
  const raw = localStorage.getItem("usuario") || sessionStorage.getItem("usuario")
  if (raw) {
    try { usuario.value = JSON.parse(raw) } catch {}
  }

  try {
    const { data } = await api.get("/viagens")
    viagens.value = usuario.value.email
      ? data.filter(v => v.email === usuario.value.email)
      : data
  } catch (e) {
    console.error("Erro ao buscar viagens:", e)
  } finally {
    loading.value = false
  }
})
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
   LEFT PANEL
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

.left-avatar-ring {
  width: 68px; height: 68px;
  border-radius: 50%; padding: 2px;
  background: linear-gradient(135deg, #c49b50, #e8dcc8);
}
.left-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; border: 3px solid #040810; }

.left-user-info { display: flex; flex-direction: column; gap: 8px; }
.left-name { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: #f0e8d8; line-height: 1.2; }
.left-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 10.5px; font-weight: 500; color: #8a9bb0; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 4px 11px; border-radius: 100px; width: fit-content; }
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 2px rgba(52,211,153,0.2); }

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

.usuario-info { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #64748b; }
.usuario-nome { font-weight: 500; color: #0f172a; }

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
  gap: 20px; margin-bottom: 28px; flex-wrap: wrap;
}
.page-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.9rem; font-weight: 600; color: #0f172a; margin-bottom: 4px;
}
.page-header > div > p { font-size: 13px; color: #94a3b8; font-weight: 300; }

/* Filtros */
.filtros { display: flex; gap: 6px; flex-wrap: wrap; }
.filtro-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; background: white;
  border: 1.5px solid #e2e8f0; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.filtro-btn.active { background: #0f172a; border-color: #0f172a; color: white; }
.filtro-btn:not(.active):hover { border-color: #c49b50; color: #c49b50; }
.filtro-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #cbd5e1;
}
.filtro-btn.active .filtro-dot { background: rgba(255,255,255,0.4); }
.filtro-dot.pago { background: #22c55e; }
.filtro-dot.aguardando { background: #f59e0b; }
.filtro-dot.cancelado { background: #ef4444; }
.filtro-count {
  background: rgba(0,0,0,0.07); border-radius: 100px;
  padding: 1px 7px; font-size: 10.5px; font-weight: 600;
}
.filtro-btn.active .filtro-count { background: rgba(255,255,255,0.12); }

/* Estado vazio / loading */
.estado-vazio {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 14px;
  padding: 80px 20px; text-align: center;
}
.loading-ring {
  width: 38px; height: 38px;
  border: 3px solid #e2e8f0;
  border-top-color: #c49b50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.vazio-icone {
  width: 64px; height: 64px;
  background: white; border: 1.5px solid #e9e3d8; border-radius: 16px;
  display: flex; align-items: center; justify-content: center; color: #c49b50;
}
.vazio-titulo { font-size: 15px; font-weight: 600; color: #0f172a; }
.vazio-sub { font-size: 13px; color: #94a3b8; font-weight: 300; }
.btn-reservar {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 22px; background: #0f172a; color: white;
  border: none; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600;
  cursor: pointer; margin-top: 8px; transition: all 0.2s;
}
.btn-reservar:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.18); }

/* ═══════════════════════════════════════
   CARDS
═══════════════════════════════════════ */
.viagens-grid {
  display: flex; flex-direction: column; gap: 12px;
}

.viagem-card {
  background: white;
  border: 1.5px solid #e9e3d8;
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
  animation: slideUp 0.4s ease both;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

.viagem-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.07); border-color: #d6cfc5; }
.viagem-card.card-expandido { border-color: #c49b50; box-shadow: 0 6px 28px rgba(196,155,80,0.12); }

.card-top {
  padding: 20px 22px;
  cursor: pointer;
  position: relative;
}

/* Status */
.card-status-wrap {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 14px;
}
.status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px; border-radius: 100px;
  font-size: 11px; font-weight: 600;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; }

.status-pill.pago { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.status-pill.pago .status-dot { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }

.status-pill.aguardando { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.status-pill.aguardando .status-dot { background: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,0.2); }

.status-pill.cancelado { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
.status-pill.cancelado .status-dot { background: #ef4444; }

.card-data-criacao { font-size: 11px; color: #94a3b8; font-weight: 300; }

/* Destino row */
.card-destino-row {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; margin-bottom: 14px;
}
.card-destino-info { display: flex; align-items: flex-start; gap: 10px; }
.destino-icone {
  width: 34px; height: 34px; flex-shrink: 0;
  background: #faf8f4; border: 1px solid #e9e3d8; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; color: #c49b50;
  margin-top: 2px;
}
.card-destino-nome {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem; font-weight: 600; color: #0f172a; margin-bottom: 5px; line-height: 1.2;
}
.card-periodo {
  display: flex; align-items: center; gap: 5px;
  font-size: 12.5px; color: #64748b; font-weight: 300;
}
.periodo-seta { color: #c49b50; font-weight: 500; }
.periodo-duracao { color: #94a3b8; font-size: 11.5px; }

.card-preco-wrap { text-align: right; flex-shrink: 0; }
.card-preco-label { display: block; font-size: 9.5px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 2px; }
.card-preco { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: #c49b50; }

/* Meta row */
.card-meta-row {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap;
}
.meta-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 11.5px; color: #64748b; font-weight: 300;
}
.meta-sep { color: #cbd5e1; font-size: 10px; }

/* Chevron */
.card-chevron {
  position: absolute; top: 22px; right: 20px;
  color: #94a3b8; transition: transform 0.25s ease;
}
.card-chevron.rotated { transform: rotate(180deg); }

/* ═══════════════════════════════════════
   DETALHES EXPANDIDOS
═══════════════════════════════════════ */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0; max-height: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1; max-height: 700px;
}

.card-detalhes { padding: 0 22px 20px; }
.detalhes-sep { height: 1px; background: #f0ebe2; margin-bottom: 18px; }

.detalhes-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px; margin-bottom: 16px;
}

.detalhe-bloco {
  background: #faf8f4; border: 1px solid #e9e3d8; border-radius: 10px; padding: 14px 16px;
}
.detalhe-preco-bloco { background: #fef9ec; border-color: #f5e6c3; }

.detalhe-titulo {
  display: flex; align-items: center; gap: 7px;
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  color: #94a3b8; margin-bottom: 12px;
}
.detalhe-rows { display: flex; flex-direction: column; gap: 8px; }
.detalhe-row { display: flex; justify-content: space-between; align-items: center; }
.detalhe-label { font-size: 12px; color: #64748b; font-weight: 300; }
.detalhe-val { font-size: 13px; color: #0f172a; font-weight: 500; }
.detalhe-total-row { padding-top: 8px; border-top: 1px dashed #e9e3d8; }
.detalhe-total-val { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: #c49b50; }

/* Assentos */
.assentos-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.assento-chip {
  display: flex; flex-direction: column; align-items: center;
  padding: 7px 12px; border-radius: 8px;
  background: white; border: 1px solid #e2e8f0; min-width: 52px;
}
.assento-chip.executiva, .assento-chip.business { background: #fef9ec; border-color: #f5e6c3; }
.assento-chip.primeira { background: #f8f0ff; border-color: #e9d5ff; }
.assento-num { font-size: 13px; font-weight: 700; color: #0f172a; }
.assento-tipo { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; }
.assento-extra { font-size: 9.5px; color: #c49b50; font-weight: 600; margin-top: 2px; }

/* Rodapé do card */
.card-rodape {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap; margin-top: 4px;
}

/* ID reserva */
.reserva-id {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; color: #94a3b8;
}
.reserva-id code {
  font-family: 'Courier New', monospace;
  font-size: 10.5px; color: #64748b;
  background: #f1f5f9; padding: 2px 7px; border-radius: 4px;
  letter-spacing: 0.5px;
}

/* Botão cancelar */
.btn-cancelar {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 16px;
  background: #fef2f2; color: #dc2626;
  border: 1.5px solid #fecaca; border-radius: 9px;
  font-family: 'Outfit', sans-serif; font-size: 12.5px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  flex-shrink: 0;
}
.btn-cancelar:hover:not(:disabled) {
  background: #dc2626; color: white; border-color: #dc2626;
  box-shadow: 0 4px 16px rgba(220,38,38,0.22);
  transform: translateY(-1px);
}
.btn-cancelar:disabled { opacity: 0.6; cursor: not-allowed; }

.spin-cancel {
  width: 12px; height: 12px;
  border: 2px solid rgba(220,38,38,0.3); border-top-color: #dc2626;
  border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
}

/* ═══════════════════════════════════════
   MODAL DE CONFIRMAÇÃO
═══════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 20px;
}

.modal-box {
  background: white;
  border-radius: 18px;
  padding: 36px 32px 28px;
  max-width: 420px; width: 100%;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  text-align: center;
}

.modal-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: #fef2f2; color: #dc2626;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  border: 1.5px solid #fecaca;
}

.modal-titulo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.45rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;
}

.modal-destino {
  font-size: 14px; font-weight: 600; color: #c49b50; margin-bottom: 14px;
}

.modal-aviso {
  font-size: 13px; color: #64748b; line-height: 1.65;
  margin-bottom: 24px; font-weight: 300;
}

.modal-acoes {
  display: flex; gap: 10px;
}

.modal-btn-voltar {
  flex: 1; padding: 13px;
  background: transparent; border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.modal-btn-voltar:hover { border-color: #cbd5e1; background: #f8fafc; color: #475569; }

.modal-btn-confirmar {
  flex: 1; padding: 13px;
  background: #dc2626; color: white; border: none; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(220,38,38,0.28);
}
.modal-btn-confirmar:hover { background: #b91c1c; transform: translateY(-1px); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
.toast {
  position: fixed; bottom: 28px; right: 28px;
  display: flex; align-items: center; gap: 10px;
  padding: 13px 20px; border-radius: 11px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  z-index: 200;
}
.toast.success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.toast.error   { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from { opacity: 0; transform: translateY(12px); }
.toast-slide-leave-to   { opacity: 0; transform: translateY(8px); }

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 900px) {
  .left-panel { display: none; }
  .content-wrapper { padding: 20px 16px 40px; }
  .top-bar { padding: 12px 16px; }
  .page-header { flex-direction: column; gap: 14px; }
  .filtros { width: 100%; }
  .card-rodape { flex-direction: column; align-items: flex-start; }
  .btn-cancelar { width: 100%; justify-content: center; }
  .modal-acoes { flex-direction: column; }
}
</style>