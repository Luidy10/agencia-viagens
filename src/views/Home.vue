<template>
  <div class="home-container">

    <!-- ─── HERO ─────────────────────────────────────── -->
    <section class="hero">
      <video autoplay muted loop playsinline class="hero-video" ref="videoHero">
        <source src="/video/videosite.mp4" type="video/mp4">
      </video>

      <div class="hero-overlay"></div>
      <div class="hero-grain"></div>

      <div class="hero-content">
        <span class="hero-label">✈ Viaje com propósito</span>
        <h1>Explore o mundo com a <em>ViaPlan</em></h1>
        <p>Planeje suas viagens com segurança, praticidade<br>e experiências únicas ao redor do mundo.</p>

        <div class="hero-actions">
          <router-link to="/Destinos" class="btn-hero-primary">
            Ver destinos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
          <button class="btn-hero-audio" @click="toggleAudio">
            <svg v-if="!somAtivo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            {{ somAtivo ? "Silenciar" : "Ativar som" }}
          </button>
        </div>
      </div>

      <!-- scroll hint -->
      <div class="scroll-hint">
        <span>Role para explorar</span>
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- ─── MAPA ──────────────────────────────────────── -->
    <section class="mapa-section">
      <div class="section-header">
        <span class="section-tag">Mapa interativo</span>
        <h2>Aeroportos <em>disponíveis</em></h2>
        <p>Clique em um marcador para ver as viagens disponíveis a partir daquele aeroporto</p>
      </div>

      <div class="map-wrapper">
        <div id="map"></div>
      </div>

      <!-- DRAWER LATERAL -->
      <div class="drawer" :class="{ ativo: aeroportoSelecionado }">

        <div class="drawer-header">
          <div class="drawer-title">
            <div class="drawer-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            </div>
            <h3>{{ aeroportoSelecionado?.nome }}</h3>
          </div>
          <button class="fechar" @click="fecharDrawer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="drawer-body">
          <div v-if="destinosFiltrados.length" class="drawer-grid">
            <div class="drawer-card" v-for="d in destinosFiltrados" :key="d._id">
              <div class="drawer-card-img">
                <img :src="`${$options.API_URL}${d.imagem}`" :alt="d.nome">
                <div class="drawer-card-img-overlay"></div>
              </div>
              <div class="drawer-card-body">
                <h4>{{ d.nome }}</h4>
                <p>{{ d.descricao }}</p>
                <div class="drawer-card-footer">
                  <span class="preco">R$ {{ Number(d.preco).toLocaleString('pt-BR') }}</span>
                  <button class="btn-agendar">
                    Agendar
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="sem-viagens">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <p>Nenhuma viagem disponível<br>a partir deste aeroporto.</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ─── COMENTÁRIOS ───────────────────────────────── -->
    <section class="avaliacoes-section">
      <div class="section-header">
        <span class="section-tag">Depoimentos</span>
        <h2>O que nossos <em>viajantes</em> dizem</h2>
        <p>Experiências reais de quem já explorou o mundo com a ViaPlan</p>
      </div>

      <!-- CONTROLES DE ORDENAÇÃO -->
      <div class="sort-controls" v-if="comentarios.length > 1">
        <div class="sort-group">
          <label>Ordenar por</label>
          <div class="sort-buttons">
            <button 
              class="sort-btn" 
              :class="{ active: sortBy === 'nota' }"
              @click="sortBy = 'nota'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Avaliação
            </button>
            <button 
              class="sort-btn" 
              :class="{ active: sortBy === 'data' }"
              @click="sortBy = 'data'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Mais recente
            </button>
          </div>
        </div>
        
        <div class="sort-direction" v-if="sortBy === 'nota'">
          <button 
            class="dir-btn" 
            :class="{ active: sortDirection === 'desc' }"
            @click="sortDirection = 'desc'"
            title="Maior nota primeiro"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            Melhores
          </button>
          <button 
            class="dir-btn" 
            :class="{ active: sortDirection === 'asc' }"
            @click="sortDirection = 'asc'"
            title="Menor nota primeiro"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            Piores
          </button>
        </div>
      </div>

      <!-- LISTA DE COMENTÁRIOS -->
      <div class="grid-avaliacoes" v-if="comentariosOrdenados.length">
        <div class="avaliacao-card" v-for="(c, i) in comentariosOrdenados" :key="c._id" :style="{ animationDelay: `${i * 80}ms` }">
          <div class="avaliacao-top">
            <div class="avaliacao-avatar">
              <div class="avatar-circle">
                <img
                  v-if="c.foto"
                  :src="$options.API_URL + c.foto"
                  class="profile"
                  :alt="c.nome"
                />
                <span v-else class="avatar-inicial">{{ c.nome?.charAt(0)?.toUpperCase() }}</span>
              </div>
            </div>
            <div class="avaliacao-meta">
              <p class="cliente">{{ c.nome }}</p>
              <div class="stars">
                <span v-for="s in 5" :key="s" :class="s <= c.nota ? 'star active' : 'star'">★</span>
              </div>
            </div>
            <button
              v-if="usuarioLogado && (usuarioLogado?.admin || String(usuarioLogado._id) === String(c.usuarioId))"
              class="btn-excluir"
              @click="excluirComentario(c._id)"
              title="Excluir comentário"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
            </button>
          </div>

          <p class="texto">{{ c.comentario }}</p>

          <p class="data">{{ formatarData(c.data) }}</p>
        </div>
      </div>

           <!-- EMPTY STATE: NENHUM COMENTÁRIO -->
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
        <h3>Silêncio por aqui...</h3>
        <p>Nenhum viajante deixou seu relato ainda. As primeiras histórias estão por vir.</p>
        <span class="empty-hint">
  Volte em breve para conferir as experiências reais da nossa comunidade
</span>
      </div>

    </section>

  </div>
</template>

<script>
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import api from "@/services/api"
import Swal from "sweetalert2"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default {
  API_URL,
  data() {
    return {
      usuarioLogado: null,
      comentarios: [],
      somAtivo: false,
      map: null,
      destinos: [],
      aeroportoSelecionado: null,
      _sectionObserver: null,
      // Controles de ordenação
      sortBy: 'data',        // 'data' | 'nota'
      sortDirection: 'desc', // 'desc' | 'asc'
      aeroportos: [
        { nome: "Guarulhos (GRU - SP)",    lat: -23.4356, lng: -46.4731 },
        { nome: "Congonhas (CGH - SP)",    lat: -23.6261, lng: -46.6566 },
        { nome: "Galeão (GIG - RJ)",       lat: -22.8099, lng: -43.2506 },
        { nome: "Santos Dumont (SDU - RJ)",lat: -22.9105, lng: -43.1631 },
        { nome: "Confins (CNF - BH)",      lat: -19.6244, lng: -43.9719 },
        { nome: "Brasília (BSB)",          lat: -15.8697, lng: -47.9208 },
        { nome: "Salvador (SSA)",          lat: -12.9140, lng: -38.3348 },
        { nome: "Recife (REC)",            lat:  -8.1264, lng: -34.9236 },
        { nome: "Fortaleza (FOR)",         lat:  -3.7763, lng: -38.5326 },
        { nome: "Curitiba (CWB)",          lat: -25.5317, lng: -49.1758 },
        { nome: "Porto Alegre (POA)",      lat: -29.9939, lng: -51.1714 },
        { nome: "Manaus (MAO)",            lat:  -3.0386, lng: -60.0497 },
        { nome: "Belém (BEL)",             lat:  -1.3792, lng: -48.4763 },
        { nome: "Florianópolis (FLN)",     lat: -27.6705, lng: -48.5477 },
        { nome: "Lisboa (LIS)",            lat:  38.7742, lng:  -9.1342 },
        { nome: "Paris (CDG)",             lat:  49.0097, lng:   2.5479 },
        { nome: "Nova York (JFK)",         lat:  40.6413, lng: -73.7781 },
        { nome: "Dubai (DXB)",             lat:  25.2532, lng:  55.3657 },
        { nome: "Tóquio (HND)",            lat:  35.5494, lng: 139.7798 }
      ]
    }
  },

  computed: {
    destinosFiltrados() {
      if (!this.aeroportoSelecionado) return []
      return this.destinos.filter(d => d.aeroporto === this.aeroportoSelecionado.nome)
    },

    comentariosOrdenados() {
      const lista = [...this.comentarios]
      
      if (this.sortBy === 'nota') {
        // Ordenar por nota (avaliação)
        lista.sort((a, b) => {
          const notaA = Number(a.nota) || 0
          const notaB = Number(b.nota) || 0
          return this.sortDirection === 'desc' ? notaB - notaA : notaA - notaB
        })
      } else {
        // Ordenar por data (mais recente primeiro)
        lista.sort((a, b) => {
          const dataA = new Date(a.data || 0).getTime()
          const dataB = new Date(b.data || 0).getTime()
          return dataB - dataA // Sempre mais recente primeiro para data
        })
      }
      
      return lista
    }
  },

  methods: {
    toggleAudio() {
      const video = this.$refs.videoHero
      if (!video) return
      video.muted = !video.muted
      this.somAtivo = !video.muted
      video.play()
    },

    fecharDrawer() {
      this.aeroportoSelecionado = null
      this.map.flyTo([-14.2350, -51.9253], 4, { duration: 1 })
    },

    svgIcon(color = "#38bdf8") {
      return L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:32px;height:32px;">
            <div class="marker-pulse" style="
              position:absolute;inset:0;
              background:${color};
              border-radius:50%;
              opacity:0.2;
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              transform:translate(-50%,-50%);
              width:12px;height:12px;
              background:${color};
              border:2px solid #080e1a;
              border-radius:50%;
              box-shadow:0 0 10px ${color}, 0 0 20px ${color}44;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    },

    initMap() {
      const brasilBounds = [
        [-55, -90],
        [75, 180]
      ]

      this.map = L.map("map", {
        zoomControl: false,
        attributionControl: true,
        minZoom: 3,
        maxZoom: 8,
        maxBounds: brasilBounds,
        maxBoundsViscosity: 1.0,
        worldCopyJump: false
      }).setView([-14.2350, -51.9253], 4)

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          subdomains: "abcd",
          maxZoom: 8,
          minZoom: 3,
          noWrap: true,
          bounds: brasilBounds
        }
      ).addTo(this.map)

      L.control.zoom({ position: "bottomright" }).addTo(this.map)

      this.aeroportos.forEach(a => {
        const marker = L.marker([a.lat, a.lng], { icon: this.svgIcon() }).addTo(this.map)

        marker.bindTooltip(a.nome, {
          direction: "top",
          offset: [0, -10],
          className: "custom-tooltip"
        })

        marker.on("click", () => {
          this.aeroportoSelecionado = a
          this.map.flyTo([a.lat, a.lng], 6, { duration: 1.2 })
        })
      })
    },

    initSectionObserver() {
      const sections = [
        { selector: ".hero",               theme: "dark"    },
        { selector: ".mapa-section",       theme: "map"     },
        { selector: ".avaliacoes-section", theme: "reviews" },
      ]

      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) {
          const match = sections.find(s => visible.target.matches(s.selector))
          if (match) {
            window.dispatchEvent(new CustomEvent("navbar-theme", { detail: match.theme }))
          }
        }
      }, {
        threshold: [0.2, 0.5, 0.8]
      })

      sections.forEach(s => {
        const el = document.querySelector(s.selector)
        if (el) observer.observe(el)
      })

      this._sectionObserver = observer
    },

    async carregarDestinos() {
      const res = await api.get("/destinos")
      this.destinos = res.data
    },

    async carregarComentarios() {
      const res = await fetch(`${API_URL}/comentarios`)
      this.comentarios = await res.json()
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
        await api.delete(`/comentarios/${id}`)
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
      return new Date(data).toLocaleDateString("pt-BR")
    }
  },

  mounted() {
    const usuario = sessionStorage.getItem("usuario")
    if (usuario) this.usuarioLogado = JSON.parse(usuario)

    this.$nextTick(() => {
      this.initMap()
      this.initSectionObserver()
    })

    this.carregarDestinos()
    this.carregarComentarios()
  },

  beforeUnmount() {
    if (this._sectionObserver) this._sectionObserver.disconnect()
  }
}
</script>

<style>
@keyframes markerPulse {
  0%, 100% { transform: scale(1);   opacity: 0.25; }
  50%       { transform: scale(2.4); opacity: 0; }
}

.marker-pulse {
  animation: markerPulse 2s ease infinite;
}

.custom-tooltip {
  background: #0d1b30 !important;
  border: 1px solid rgba(56,189,248,0.25) !important;
  border-radius: 8px !important;
  color: #e2e8f0 !important;
  font-family: 'DM Sans', sans-serif !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 6px 12px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
  white-space: nowrap !important;
}
.custom-tooltip::before {
  border-top-color: rgba(56,189,248,0.25) !important;
}

.leaflet-control-attribution {
  background: rgba(8,14,26,0.7) !important;
  backdrop-filter: blur(6px) !important;
  border-radius: 8px 0 0 0 !important;
  color: #334155 !important;
  font-size: 10px !important;
}
.leaflet-control-attribution a { color: #475569 !important; }

.leaflet-control-zoom {
  border: none !important;
  border-radius: 10px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
  margin-bottom: 12px !important;
  margin-right: 12px !important;
}
.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
  background: #0d1b30 !important;
  border: none !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  color: #64748b !important;
  width: 36px !important;
  height: 36px !important;
  line-height: 36px !important;
  font-size: 16px !important;
  transition: background 0.2s, color 0.2s !important;
}
.leaflet-control-zoom-in:hover,
.leaflet-control-zoom-out:hover {
  background: #162032 !important;
  color: #38bdf8 !important;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.home-container {
  font-family: 'DM Sans', sans-serif;
  background: #080e1a;
  color: #e2e8f0;
}

/* ─── HERO ──────────────────────────────────────────── */
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(8,14,26,0.3) 0%,
    rgba(8,14,26,0.55) 50%,
    rgba(8,14,26,0.92) 100%
  );
}

.hero-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 780px;
  padding: 0 24px;
  animation: heroIn 1s ease both;
}

@keyframes heroIn {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.2);
  padding: 6px 18px;
  border-radius: 100px;
  margin-bottom: 28px;
}

.hero-content h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  font-weight: 700;
  line-height: 1.15;
  color: #f8fafc;
  margin-bottom: 20px;
}

.hero-content h1 em {
  font-style: italic;
  background: linear-gradient(135deg, #38bdf8, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.05rem;
  color: #94a3b8;
  font-weight: 300;
  line-height: 1.7;
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  background: linear-gradient(135deg, #0ea5e9, #34d399);
  color: #080e1a;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 6px 24px rgba(14,165,233,0.3);
}
.btn-hero-primary:hover { opacity: 0.9; transform: translateY(-2px); }

.btn-hero-audio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 22px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: #94a3b8;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  backdrop-filter: blur(8px);
}
.btn-hero-audio:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }

.scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: fadeIn 1.5s 0.8s ease both;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.scroll-hint span {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #475569;
  font-weight: 500;
}
.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, #475569, transparent);
  animation: scrollPulse 2s ease infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50%       { opacity: 1;   transform: scaleY(1.2); }
}

/* ─── SECTION SHARED ────────────────────────────────── */
.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 48px;
}
.section-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #38bdf8;
  margin-bottom: 14px;
}
.section-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  color: #f1f5f9;
  margin-bottom: 14px;
  line-height: 1.2;
}
.section-header h2 em {
  font-style: italic;
  background: linear-gradient(135deg, #38bdf8, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.section-header p { font-size: 0.95rem; color: #64748b; font-weight: 300; line-height: 1.6; }

/* ─── MAPA ──────────────────────────────────────────── */
.mapa-section { padding: 100px 40px; background: #080e1a; }

.map-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(56,189,248,0.1);
  box-shadow:
    0 0 0 1px rgba(56,189,248,0.05),
    0 20px 60px rgba(0,0,0,0.6),
    0 0 80px rgba(56,189,248,0.04);
}

#map { height: 520px; width: 100%; }

/* ─── DRAWER ────────────────────────────────────────── */
.drawer {
  position: fixed;
  top: 0;
  right: -440px;
  width: 420px;
  height: 100%;
  background: #0d1b30;
  border-left: 1px solid rgba(255,255,255,0.07);
  color: white;
  z-index: 9999;
  transition: right 0.4s cubic-bezier(.22,.68,0,1.2);
  display: flex;
  flex-direction: column;
  box-shadow: -20px 0 60px rgba(0,0,0,0.5);
}
.drawer.ativo { right: 0; }

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.drawer-title { display: flex; align-items: center; gap: 12px; }
.drawer-icon {
  width: 34px; height: 34px;
  background: rgba(56,189,248,0.1);
  border: 1px solid rgba(56,189,248,0.2);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: #38bdf8; flex-shrink: 0;
}
.drawer-header h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #f1f5f9; margin: 0; }
.fechar {
  width: 32px; height: 32px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #94a3b8;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s, color 0.2s; flex-shrink: 0;
}
.fechar:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }

.drawer-body { padding: 20px; overflow-y: auto; flex: 1; }
.drawer-body::-webkit-scrollbar { width: 4px; }
.drawer-body::-webkit-scrollbar-track { background: transparent; }
.drawer-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

.drawer-grid { display: flex; flex-direction: column; gap: 14px; }
.drawer-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.drawer-card:hover { border-color: rgba(56,189,248,0.2); }
.drawer-card-img { position: relative; height: 150px; overflow: hidden; }
.drawer-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.drawer-card:hover .drawer-card-img img { transform: scale(1.05); }
.drawer-card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(13,27,48,0.8)); }
.drawer-card-body { padding: 14px 16px 16px; }
.drawer-card-body h4 { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f1f5f9; margin-bottom: 6px; }
.drawer-card-body p { font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.drawer-card-footer { display: flex; align-items: center; justify-content: space-between; }
.preco { font-size: 1rem; font-weight: 700; color: #34d399; }
.btn-agendar {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600; color: #38bdf8;
  background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2);
  padding: 7px 13px; border-radius: 8px; cursor: pointer; transition: background 0.2s;
}
.btn-agendar:hover { background: rgba(56,189,248,0.15); }

.sem-viagens {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px; padding: 60px 20px; color: #334155; text-align: center;
}
.sem-viagens p { font-size: 14px; line-height: 1.6; }

/* ─── CONTROLES DE ORDENAÇÃO ───────────────────────── */
.sort-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-group label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sort-buttons {
  display: flex;
  gap: 6px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 4px;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  color: #94a3b8;
  background: rgba(255,255,255,0.03);
}

.sort-btn.active {
  background: rgba(56,189,248,0.1);
  color: #38bdf8;
  border: 1px solid rgba(56,189,248,0.2);
}

.sort-direction {
  display: flex;
  gap: 6px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 4px;
}

.dir-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dir-btn:hover {
  color: #94a3b8;
  background: rgba(255,255,255,0.03);
}

.dir-btn.active {
  background: rgba(52,211,153,0.1);
  color: #34d399;
  border: 1px solid rgba(52,211,153,0.2);
}

/* ─── AVALIAÇÕES ────────────────────────────────────── */
.avaliacoes-section { padding: 100px 40px; background: #060b16; }

.grid-avaliacoes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.avaliacao-card {
  background: #0d1b30;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: border-color 0.2s, transform 0.2s;
  animation: fadeUp 0.5s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.avaliacao-card:hover { border-color: rgba(56,189,248,0.15); transform: translateY(-3px); }

.avaliacao-top { display: flex; align-items: center; gap: 12px; }
.avaliacao-avatar { flex-shrink: 0; }

/* Avatar com foto real ou inicial */
.avatar-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(56,189,248,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(52,211,153,0.15));
  flex-shrink: 0;
}
.profile {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.avatar-inicial {
  font-size: 18px;
  font-weight: 700;
  color: #38bdf8;
  font-family: 'Playfair Display', serif;
  line-height: 1;
}

.avaliacao-meta { flex: 1; }
.cliente { font-size: 14px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px; }
.stars { display: flex; gap: 2px; }
.star { font-size: 13px; color: #334155; }
.star.active { color: #fbbf24; }

.texto { font-size: 13.5px; color: #64748b; line-height: 1.7; flex: 1; font-style: italic; }
.data { font-size: 11.5px; color: #334155; font-weight: 500; }

.btn-excluir {
  margin-left: auto;
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: 8px;
  color: #f87171;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}
.btn-excluir:hover { background: rgba(239,68,68,0.18); }

/* ─── EMPTY STATE ───────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 460px;
  margin: 0 auto;
  padding: 60px 24px;
  animation: fadeUp 0.6s ease both;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(56,189,248,0.06);
  border: 1px solid rgba(56,189,248,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: #f8fafc;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.7;
  font-weight: 300;
  margin-bottom: 20px;
}

.empty-hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.2);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  color: #38bdf8;
  letter-spacing: 0.5px;
  animation: pulseHint 2s ease infinite;
}

@keyframes pulseHint {
  0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0.15); }
  50% { box-shadow: 0 0 0 8px rgba(56,189,248,0); }
}

/* ─── RESPONSIVE ────────────────────────────────────── */
@media (max-width: 768px) {
  .mapa-section, .avaliacoes-section { padding: 70px 20px; }
  .drawer { width: 100%; right: -100%; }
  .grid-avaliacoes { grid-template-columns: 1fr; }
  .hero-content p br { display: none; }
  
  .sort-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .sort-group {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>