<template>
  <div class="destinos">

    <!-- HERO SECTION -->
    <header class="hero">
      <div class="hero-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="grid-bg"></div>
        <div class="grain"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>Explore o mundo</span>
        </div>
        <h1>
          <span class="title-line">Destinos</span>
          <span class="title-line title-accent">incríveis</span>
        </h1>
        <p class="subtitle">Escolha seu próximo destino e comece a aventura</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">{{ destinos.length }}+</span>
            <span class="stat-label">Destinos</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">50+</span>
            <span class="stat-label">Países</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">10k+</span>
            <span class="stat-label">Viajantes</span>
          </div>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <span>Role para explorar</span>
      </div>
    </header>

    <!-- ═══════════════════════════════════════
         CARROSSEL DE DESTINOS EM DESTAQUE
         ═══════════════════════════════════════ -->
    <CarrosselDestinos @abrir="abrirDetalhes" />

    <!-- FILTROS -->
    <section class="filters-section">
      <div class="filters-container">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="busca"
            type="text"
            placeholder="Buscar destinos..."
            @input="paginaAtual = 1"
          />
        </div>
        <div class="filter-tabs">
          <button
            v-for="cat in categorias"
            :key="cat.id"
            :class="['filter-tab', { active: filtroAtivo === cat.id }]"
            @click="filtroAtivo = cat.id; paginaAtual = 1"
          >
            <span class="tab-icon" v-html="cat.icon"></span>
            <span>{{ cat.nome }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- GRID DE DESTINOS -->
    <section class="section">
      <div v-if="destinosFiltrados.length === 0" class="no-results">
        <div class="no-results-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <h3>Nenhum destino encontrado</h3>
        <p>Tente ajustar sua busca ou filtros</p>
      </div>

      <template v-else>
        <!-- Barra de informação -->
        <div class="pagination-info-bar">
          <span class="showing-label">
            Mostrando
            <strong>{{ primeiroIndice + 1 }}–{{ ultimoIndice }}</strong>
            de
            <strong>{{ destinosFiltrados.length }}</strong>
            destinos
          </span>
          <span class="per-page-label">{{ porPagina }} por página</span>
        </div>

        <!-- Grid -->
        <div class="grid">
          <div
            class="card"
            v-for="(d, i) in destinosPaginados"
            :key="d._id"
            @click="abrirDetalhes(d)"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <div class="card-image-wrap">
              <img :src="`${$options.API_URL}${d.imagem}`" :alt="d.nome" loading="lazy" />
              <div class="card-image-overlay"></div>

              <span v-if="d.categoria" class="card-category">
                {{ formatarCategoria(d.categoria) }}
              </span>

              <span class="card-badge">
                <span class="badge-pulse"></span>
                Disponível
              </span>

              <span v-if="d.duracaoDias" class="card-duration">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ d.duracaoDias }} dias
              </span>

              <div class="card-hover-overlay">
                <button class="hover-cta">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  Ver detalhes
                </button>
              </div>
            </div>

            <div class="card-body">
              <div class="card-header-row">
                <h3>{{ d.nome }}</h3>
                <div v-if="d.avaliacao" class="card-rating">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span>{{ d.avaliacao }}</span>
                </div>
              </div>

              <p class="card-desc">{{ d.descricao }}</p>

              <div class="card-inclusos" v-if="d.hotelIncluso || d.cafeDaManhaIncluso || (d.itensInclusos && d.itensInclusos.length)">
                <span v-if="d.hotelIncluso" class="incluso-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Hotel
                </span>
                <span v-if="d.cafeDaManhaIncluso" class="incluso-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
                  </svg>
                  Café
                </span>
                <span v-if="d.itensInclusos && d.itensInclusos.length" class="incluso-chip incluso-more">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  +{{ d.itensInclusos.length }} itens
                </span>
              </div>

              <div class="card-footer">
                <div class="preco-wrap">
                  <span class="preco-label">A partir de</span>
                  <span class="preco-value">R$ {{ Number(d.preco).toLocaleString('pt-BR') }}</span>
                </div>
                <div class="card-aeroporto" v-if="d.aeroporto">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                  <span>{{ d.aeroporto.split('(')[0].trim() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PAGINAÇÃO -->
        <nav class="pagination" aria-label="Paginação de destinos">
          <button
            class="pg-btn pg-arrow"
            :disabled="paginaAtual === 1"
            @click="irParaPagina(paginaAtual - 1)"
            aria-label="Página anterior"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <template v-for="item in paginasVisiveis" :key="item">
            <span v-if="item === '...'" class="pg-ellipsis">&#8230;</span>
            <button
              v-else
              :class="['pg-btn', { active: item === paginaAtual }]"
              @click="irParaPagina(item)"
              :aria-label="`Página ${item}`"
              :aria-current="item === paginaAtual ? 'page' : undefined"
            >
              {{ item }}
            </button>
          </template>

          <button
            class="pg-btn pg-arrow"
            :disabled="paginaAtual === totalPaginas"
            @click="irParaPagina(paginaAtual + 1)"
            aria-label="Próxima página"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </nav>
      </template>
    </section>

    <!-- MODAL DETALHES PREMIUM -->
    <Transition name="modal">
      <div v-if="modalDetalhes" class="modal-overlay" @click.self="fecharDetalhes">
        <div class="modal">

          <button class="modal-close" @click="fecharDetalhes">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div class="modal-hero">
            <img :src="`${$options.API_URL}${destinoSelecionado.imagem}`" :alt="destinoSelecionado.nome" />
            <div class="modal-hero-gradient"></div>
            <div class="modal-hero-content">
              <span v-if="destinoSelecionado.categoria" class="modal-category">
                {{ formatarCategoria(destinoSelecionado.categoria) }}
              </span>
              <h2>{{ destinoSelecionado.nome }}</h2>
              <div class="modal-hero-meta">
                <span v-if="destinoSelecionado.duracaoDias" class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ destinoSelecionado.duracaoDias }} dias
                </span>
                <span v-if="destinoSelecionado.aeroporto" class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                  {{ destinoSelecionado.aeroporto }}
                </span>
              </div>
            </div>
          </div>

          <div class="modal-body">
            <div class="descricao-section">
              <h4 class="section-label">Sobre o destino</h4>
              <div class="descricao-container">
                <p
                  ref="descricaoRef"
                  class="modal-desc"
                  :class="{ expandida: descricaoExpandida }"
                >
                  {{ destinoSelecionado.descricao }}
                </p>
                <button
                  v-if="mostrarBotao"
                  class="btn-ler"
                  @click="toggleDescricao"
                >
                  {{ descricaoExpandida ? 'Ver menos' : 'Ler mais' }}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :style="{ transform: descricaoExpandida ? 'rotate(180deg)' : 'none' }">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="destinoSelecionado.itensInclusos && destinoSelecionado.itensInclusos.length" class="itens-section">
              <h4 class="section-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                O que está incluso
              </h4>
              <div class="itens-grid">
                <div v-for="(item, idx) in destinoSelecionado.itensInclusos" :key="idx" class="item-card">
                  <div class="item-icon" v-html="getItemIcon(item)"></div>
                  <span>{{ item }}</span>
                </div>
                <div v-if="destinoSelecionado.hotelIncluso" class="item-card item-highlight">
                  <div class="item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <span>Hotel incluso</span>
                </div>
                <div v-if="destinoSelecionado.cafeDaManhaIncluso" class="item-card item-highlight">
                  <div class="item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
                    </svg>
                  </div>
                  <span>Café da manhã</span>
                </div>
              </div>
            </div>

            <div class="modal-price-section">
              <div class="price-box">
                <div class="price-header">
                  <span class="price-label">Valor por pessoa</span>
                  <span v-if="destinoSelecionado.avaliacao" class="price-rating">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    {{ destinoSelecionado.avaliacao }}
                  </span>
                </div>
                <p class="modal-preco">
                  R$ {{ Number(destinoSelecionado.preco).toLocaleString('pt-BR') }}
                </p>
                <span class="price-note">* Preço sujeito a variação conforme data</span>
              </div>
            </div>

            <div class="acoes">
              <button class="btn-fechar" @click="fecharDetalhes">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Voltar
              </button>
              <button class="btn-agendar" @click="agendarViagem(destinoSelecionado)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                Agendar viagem
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script>
import api from "@/services/api"
import { nextTick } from "vue"
import CarrosselDestinos from "@/components/CarrosselDestinos.vue"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default {
  components: { CarrosselDestinos },
  API_URL,

  data() {
    return {
      destinos: [],
      modalDetalhes: false,
      destinoSelecionado: {},
      descricaoExpandida: false,
      mostrarBotao: false,
      busca: "",
      filtroAtivo: "todos",

      paginaAtual: 1,
      porPagina: 6,

      categorias: [
        { id: "todos",         nome: "Todos",         icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>` },
        { id: "nacional",      nome: "Nacional",      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
        { id: "internacional", nome: "Internacional", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M12 2v20"/></svg>` },
        { id: "praia",         nome: "Praia",         icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20M4 20v-4a4 4 0 014-4h8a4 4 0 014 4v4"/><path d="M8 12V8a4 4 0 118 0v4"/></svg>` },
        { id: "montanha",      nome: "Montanha",      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l4 8 5-5 5 15H2L8 3z"/><path d="M4 14l4-4 3 3 3-3"/></svg>` },
        { id: "cidade",        nome: "Cidade",        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6"/></svg>` },
        { id: "aventura",      nome: "Aventura",      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>` },
        { id: "romantico",     nome: "Romântico",     icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>` }
      ]
    }
  },

  computed: {
    destinosFiltrados() {
      let filtrados = this.destinos
      if (this.filtroAtivo !== "todos") {
        filtrados = filtrados.filter(d => d.categoria === this.filtroAtivo)
      }
      if (this.busca.trim()) {
        const termo = this.busca.toLowerCase()
        filtrados = filtrados.filter(d =>
          d.nome.toLowerCase().includes(termo) ||
          d.descricao.toLowerCase().includes(termo) ||
          (d.aeroporto && d.aeroporto.toLowerCase().includes(termo))
        )
      }
      return filtrados
    },

    totalPaginas() {
      return Math.ceil(this.destinosFiltrados.length / this.porPagina)
    },

    primeiroIndice() {
      return (this.paginaAtual - 1) * this.porPagina
    },

    ultimoIndice() {
      return Math.min(this.primeiroIndice + this.porPagina, this.destinosFiltrados.length)
    },

    destinosPaginados() {
      return this.destinosFiltrados.slice(this.primeiroIndice, this.ultimoIndice)
    },

    paginasVisiveis() {
      const total = this.totalPaginas
      const atual = this.paginaAtual
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
      const paginas = [1]
      if (atual > 3) paginas.push('...')
      const inicio = Math.max(2, atual - 1)
      const fim = Math.min(total - 1, atual + 1)
      for (let i = inicio; i <= fim; i++) paginas.push(i)
      if (atual < total - 2) paginas.push('...')
      paginas.push(total)
      return paginas
    }
  },

  watch: {
    destinosFiltrados() {
      if (this.paginaAtual > this.totalPaginas) {
        this.paginaAtual = 1
      }
    }
  },

  methods: {
    async carregar() {
      this.destinos = await api.get("/destinos").then(r => r.data)
    },

    irParaPagina(pagina) {
      if (pagina < 1 || pagina > this.totalPaginas) return
      this.paginaAtual = pagina
      this.$el.querySelector('.section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },

    async abrirDetalhes(destino) {
      this.destinoSelecionado = destino
      this.modalDetalhes = true
      this.descricaoExpandida = false
      this.mostrarBotao = false
      document.body.style.overflow = 'hidden'
      await nextTick()
      const el = this.$refs.descricaoRef
      if (el) this.mostrarBotao = el.scrollHeight > el.clientHeight
    },

    fecharDetalhes() {
      this.modalDetalhes = false
      this.destinoSelecionado = {}
      document.body.style.overflow = ''
    },

    toggleDescricao() {
      this.descricaoExpandida = !this.descricaoExpandida
    },

    agendarViagem(destino) {
      const usuario = sessionStorage.getItem('usuario')
      const token   = sessionStorage.getItem('authToken')
      const estaLogado = !!(usuario || token)

      this.fecharDetalhes()

      if (!estaLogado) {
        this.$router.push({ path: '/entrar', query: { redirect: `/viagens?destino=${encodeURIComponent(destino.nome)}` } })
        return
      }

      this.$router.push({ path: '/viagens', query: { destino: destino.nome } })
    },

    formatarCategoria(cat) {
      const map = {
        nacional: "Nacional", internacional: "Internacional",
        praia: "Praia", montanha: "Montanha",
        cidade: "Cidade", aventura: "Aventura", romantico: "Romântico"
      }
      return map[cat] || cat
    },

    getItemIcon(item) {
      const itemLower = item.toLowerCase()
      if (itemLower.includes('translado')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
      if (itemLower.includes('passeio') || itemLower.includes('tour')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
      if (itemLower.includes('guia')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>`
      if (itemLower.includes('seguro')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
      if (itemLower.includes('wifi')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`
      if (itemLower.includes('bagagem')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
      if (itemLower.includes('refeição') || itemLower.includes('jantar') || itemLower.includes('almoço')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`
      if (itemLower.includes('transfer')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`
      if (itemLower.includes('ingresso') || itemLower.includes('show')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v6a3 3 0 01-3 3H5a3 3 0 01-3-3V9z"/><path d="M8 7v10M16 7v10"/></svg>`
      if (itemLower.includes('barco')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0021 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/></svg>`
      if (itemLower.includes('mergulho')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`
      if (itemLower.includes('trilha')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
      if (itemLower.includes('spa') || itemLower.includes('massagem')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`
      if (itemLower.includes('aula') || itemLower.includes('curso') || itemLower.includes('workshop')) return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    }
  },

  mounted() {
    this.carregar()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.destinos {
  font-family: 'DM Sans', sans-serif;
  background: #060a14;
  min-height: 100vh;
  color: #e2e8f0;
  overflow-x: hidden;
}

/* ═══════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════ */
.hero {
  position: relative;
  padding: 100px 24px 120px;
  text-align: center;
  overflow: hidden;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.25;
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #1d4ed8 0%, transparent 70%);
  top: -250px; left: -150px;
  animation: orbFloat 8s ease-in-out infinite;
}
.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  top: -100px; right: -100px;
  animation: orbFloat 10s ease-in-out infinite reverse;
}
.orb-3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);
  bottom: -150px; left: 50%;
  transform: translateX(-50%);
  animation: orbFloat 12s ease-in-out infinite 2s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
}

.grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: 0.03;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.06);
  border: 1px solid rgba(56, 189, 248, 0.15);
  padding: 8px 20px;
  border-radius: 100px;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #34d399;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  font-weight: 600;
  line-height: 1.05;
  margin: 0 0 24px;
  color: #f8fafc;
}

.title-line { display: block; }

.title-accent {
  font-style: italic;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 400;
  margin: 0 0 40px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #475569;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  animation: bounce 2s ease-in-out infinite;
}

.mouse {
  width: 22px;
  height: 36px;
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.wheel {
  width: 3px;
  height: 6px;
  background: #38bdf8;
  border-radius: 2px;
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollWheel {
  0%, 100% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0.3; transform: translateY(8px); }
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* ═══════════════════════════════════════
   FILTERS SECTION
   ═══════════════════════════════════════ */
.filters-section {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(6, 10, 20, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: 20px 40px;
}

.filters-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-box { position: relative; flex-shrink: 0; }

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
  pointer-events: none;
}

.search-box input {
  width: 280px;
  padding: 12px 16px 12px 42px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #e2e8f0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: rgba(56,189,248,0.3);
  background: rgba(56,189,248,0.03);
  box-shadow: 0 0 0 3px rgba(56,189,248,0.05);
}

.search-box input::placeholder { color: #334155; }

.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 4px;
}
.filter-tabs::-webkit-scrollbar { display: none; }

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: #64748b;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-tab:hover {
  border-color: rgba(56,189,248,0.2);
  color: #94a3b8;
  background: rgba(56,189,248,0.04);
}

.filter-tab.active {
  background: rgba(56,189,248,0.1);
  border-color: rgba(56,189,248,0.25);
  color: #38bdf8;
}

.tab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.tab-icon svg { display: block; }

/* ═══════════════════════════════════════
   SECTION & GRID
   ═══════════════════════════════════════ */
.section {
  padding: 48px 40px 100px;
  max-width: 1400px;
  margin: 0 auto;
}

.pagination-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.showing-label { font-size: 13px; color: #64748b; }
.showing-label strong { color: #94a3b8; font-weight: 600; }

.per-page-label {
  font-size: 12px;
  color: #334155;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.no-results {
  text-align: center;
  padding: 80px 20px;
  color: #475569;
}

.no-results-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  opacity: 0.6;
}
.no-results-icon svg { color: #475569; }

.no-results h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #94a3b8;
  margin-bottom: 8px;
}
.no-results p { font-size: 0.95rem; color: #475569; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
  margin-bottom: 56px;
}

/* ═══════════════════════════════════════
   PAGINAÇÃO
   ═══════════════════════════════════════ */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-top: 8px;
}

.pg-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 4px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: #64748b;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.pg-btn:hover:not(:disabled) {
  border-color: rgba(56,189,248,0.25);
  background: rgba(56,189,248,0.06);
  color: #94a3b8;
}

.pg-btn.active {
  background: rgba(56,189,248,0.12);
  border-color: rgba(56,189,248,0.3);
  color: #38bdf8;
  font-weight: 600;
  box-shadow: 0 0 16px rgba(56,189,248,0.1);
}

.pg-btn:disabled { opacity: 0.25; cursor: not-allowed; }
.pg-arrow { width: 40px; color: #475569; }

.pg-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 13px;
  color: #334155;
  pointer-events: none;
}

/* ═══════════════════════════════════════
   CARD PREMIUM
   ═══════════════════════════════════════ */
.card {
  background: #0c1222;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.5s cubic-bezier(.22,.68,0,1.1),
              box-shadow 0.5s ease,
              border-color 0.4s ease;
  animation: fadeUp 0.6s ease both;
  position: relative;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(56,189,248,0.1), transparent 40%, transparent 60%, rgba(139,92,246,0.1));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.card:hover::before { opacity: 1; }

.card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow:
    0 24px 60px rgba(0,0,0,0.5),
    0 0 0 1px rgba(56,189,248,0.08),
    0 0 80px rgba(56,189,248,0.04);
  border-color: rgba(56,189,248,0.12);
}

.card-image-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(.22,.68,0,1.1);
  display: block;
}

.card:hover .card-image-wrap img { transform: scale(1.08); }

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 30%,
    rgba(6,10,20,0.4) 70%,
    rgba(6,10,20,0.9) 100%
  );
}

.card-category {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #f1f5f9;
  background: rgba(99,102,241,0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 6px 14px;
  border-radius: 100px;
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #34d399;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(52,211,153,0.2);
  padding: 5px 12px;
  border-radius: 100px;
  backdrop-filter: blur(10px);
}

.badge-pulse {
  width: 5px;
  height: 5px;
  background: #34d399;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.card-duration {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #f1f5f9;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 6px 12px;
  border-radius: 100px;
}

.card-hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6,10,20,0.6);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card:hover .card-hover-overlay { opacity: 1; }

.hover-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(56,189,248,0.15);
  border: 1px solid rgba(56,189,248,0.3);
  border-radius: 12px;
  color: #38bdf8;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  transform: translateY(10px);
}

.card:hover .hover-cta { transform: translateY(0); }
.hover-cta:hover { background: rgba(56,189,248,0.25); border-color: rgba(56,189,248,0.5); }

.card-body { padding: 22px 24px 24px; }

.card-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.card-body h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #f1f5f9;
  line-height: 1.3;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #fbbf24;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.15);
  padding: 4px 10px;
  border-radius: 8px;
  flex-shrink: 0;
}

.card-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0 0 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-inclusos {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.incluso-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 8px;
  letter-spacing: 0.3px;
}

.incluso-chip:nth-child(1) {
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.15);
  color: #818cf8;
}

.incluso-chip:nth-child(2) {
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.15);
  color: #fbbf24;
}

.incluso-more {
  background: rgba(255,255,255,0.04) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  color: #94a3b8 !important;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.preco-wrap { display: flex; flex-direction: column; gap: 2px; }

.preco-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #475569;
  font-weight: 600;
}

.preco-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #34d399;
}

.card-aeroporto {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
}

/* ═══════════════════════════════════════
   MODAL PREMIUM
   ═══════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3,7,18,0.9);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
  animation: overlayIn 0.3s ease;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: #0c1222;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 28px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 50px 100px rgba(0,0,0,0.7),
    0 0 0 1px rgba(56,189,248,0.05);
  animation: modalSlideUp 0.4s cubic-bezier(.22,.68,0,1.1);
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.modal-close:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
  transform: rotate(90deg);
}

.modal-hero {
  position: relative;
  height: 280px;
  overflow: hidden;
  flex-shrink: 0;
}

.modal-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.modal-hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(6,10,20,0.3) 0%,
    transparent 30%,
    rgba(6,10,20,0.6) 70%,
    #0c1222 100%
  );
}

.modal-hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-category {
  display: inline-block;
  width: fit-content;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #f1f5f9;
  background: rgba(99,102,241,0.7);
  padding: 5px 14px;
  border-radius: 100px;
  backdrop-filter: blur(10px);
}

.modal-hero-content h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: #f8fafc;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  line-height: 1.2;
}

.modal-hero-meta { display: flex; gap: 16px; flex-wrap: wrap; }

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 6px 12px;
  border-radius: 100px;
}

.modal-body {
  padding: 0 28px 28px;
  overflow-y: auto;
  flex: 1;
}

.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-thumb {
  background: rgba(56,189,248,0.3);
  border-radius: 10px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #475569;
  margin-bottom: 14px;
}
.section-label svg { color: #38bdf8; }

.descricao-section { margin-bottom: 28px; }
.descricao-container { position: relative; }

.modal-desc {
  max-height: 90px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(.22,.68,0,1.1);
  line-height: 1.75;
  color: #94a3b8;
  font-size: 0.92rem;
  position: relative;
}

.modal-desc::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 40px;
  background: linear-gradient(to bottom, transparent, #0c1222);
  transition: opacity 0.3s ease;
}

.modal-desc.expandida {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}
.modal-desc.expandida::after { opacity: 0; }

.btn-ler {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #38bdf8;
  background: rgba(56,189,248,0.06);
  border: 1px solid rgba(56,189,248,0.15);
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'DM Sans', sans-serif;
}

.btn-ler:hover {
  background: rgba(56,189,248,0.12);
  border-color: rgba(56,189,248,0.3);
  transform: translateY(-1px);
}
.btn-ler svg { transition: transform 0.3s ease; }

.itens-section { margin-bottom: 28px; }

.itens-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.item-card:hover {
  background: rgba(56,189,248,0.04);
  border-color: rgba(56,189,248,0.1);
  transform: translateX(4px);
}

.item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
}
.item-icon svg { display: block; }

.item-highlight {
  background: rgba(99,102,241,0.06);
  border-color: rgba(99,102,241,0.12);
  color: #818cf8;
}

.modal-price-section { margin-bottom: 24px; }

.price-box {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 20px 24px;
}

.price-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.price-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #475569;
}

.price-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #fbbf24;
}

.modal-preco {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #34d399;
  margin: 0;
  line-height: 1.2;
}

.price-note { display: block; margin-top: 6px; font-size: 11px; color: #475569; }

.acoes { display: flex; gap: 12px; }

.btn-fechar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: #94a3b8;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-fechar:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.15);
  color: #e2e8f0;
}

.btn-agendar {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(99,102,241,0.3);
  position: relative;
  overflow: hidden;
}

.btn-agendar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-agendar:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(99,102,241,0.4);
}

.btn-agendar:hover::before { opacity: 1; }
.btn-agendar:active { transform: translateY(0); }

/* ═══════════════════════════════════════
   TRANSITIONS
   ═══════════════════════════════════════ */
.modal-enter-active { animation: modalIn 0.4s cubic-bezier(.22,.68,0,1.1); }
.modal-leave-active { animation: modalOut 0.25s ease forwards; }

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modalOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.96); }
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 768px) {
  .hero { padding: 60px 20px 80px; min-height: auto; }
  .hero-stats { gap: 20px; }
  .stat-value { font-size: 1.4rem; }
  .filters-section { padding: 16px; }
  .filters-container { flex-direction: column; align-items: stretch; gap: 12px; }
  .search-box input { width: 100%; }
  .section { padding: 32px 16px 60px; }
  .grid { grid-template-columns: 1fr; gap: 20px; }
  .modal { max-width: 100%; border-radius: 20px 20px 0 0; max-height: 95vh; margin-top: auto; }
  .modal-hero { height: 200px; }
  .modal-hero-content h2 { font-size: 1.5rem; }
  .itens-grid { grid-template-columns: 1fr; }
  .acoes { flex-direction: column; }
  .pagination-info-bar { flex-direction: column; align-items: flex-start; gap: 6px; }
  .pg-btn { min-width: 36px; height: 36px; font-size: 12px; }
}
</style>