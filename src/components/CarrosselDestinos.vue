<template>
  <section class="carrossel-section">

    <!-- Cabeçalho da seção -->
    <div class="carrossel-header">
      <div class="header-left">
        <span class="section-eyebrow">
          <span class="eyebrow-dot"></span>
          Em destaque
        </span>
        <h2 class="section-title">
          Destinos <em>selecionados</em>
        </h2>
      </div>
      <div class="header-right">
        <button
          class="nav-btn"
          :disabled="indiceAtivo === 0"
          @click="anterior"
          aria-label="Anterior"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="progress-dots">
          <button
            v-for="(_, i) in totalGrupos"
            :key="i"
            :class="['dot', { active: i === indiceAtivo }]"
            @click="irPara(i)"
            :aria-label="`Grupo ${i + 1}`"
          ></button>
        </div>
        <button
          class="nav-btn"
          :disabled="indiceAtivo === totalGrupos - 1"
          @click="proximo"
          aria-label="Próximo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Trilho do carrossel -->
    <div
      class="carrossel-viewport"
      ref="viewport"
      @mousedown="iniciarDrag"
      @mousemove="moverDrag"
      @mouseup="finalizarDrag"
      @mouseleave="finalizarDrag"
      @touchstart.passive="iniciarTouch"
      @touchmove.passive="moverTouch"
      @touchend="finalizarTouch"
    >
      <div
        class="carrossel-track"
        :style="{ transform: `translateX(calc(-${indiceAtivo * 100}% - ${indiceAtivo * 28}px))` }"
      >
        <div
          v-for="(grupo, gi) in grupos"
          :key="gi"
          class="carrossel-grupo"
        >
          <div
            v-for="(destino, di) in grupo"
            :key="destino._id"
            class="carrossel-card"
            :class="{ featured: di === 0 && gi === indiceAtivo }"
            @click="$emit('abrir', destino)"
          >
            <!-- Imagem -->
            <div class="cc-image-wrap">
              <img
                :src="`${$options.API_URL}${destino.imagem}`"
                :alt="destino.nome"
                loading="lazy"
              />
              <div class="cc-image-gradient"></div>

              <!-- Tags flutuantes -->
              <span v-if="destino.categoria" class="cc-tag cc-tag-cat">
                {{ formatarCategoria(destino.categoria) }}
              </span>
              <span class="cc-tag cc-tag-badge">
                <span class="badge-blink"></span>
                Disponível
              </span>
              <span v-if="destino.duracaoDias" class="cc-tag cc-tag-dur">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ destino.duracaoDias }}d
              </span>
            </div>

            <!-- Corpo -->
            <div class="cc-body">
              <div class="cc-name-row">
                <h3>{{ destino.nome }}</h3>
                <span v-if="destino.avaliacao" class="cc-rating">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {{ destino.avaliacao }}
                </span>
              </div>

              <p class="cc-desc">{{ destino.descricao }}</p>

              <!-- Chips de inclusos -->
              <div class="cc-chips" v-if="destino.hotelIncluso || destino.cafeDaManhaIncluso">
                <span v-if="destino.hotelIncluso" class="cc-chip cc-chip-hotel">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  Hotel
                </span>
                <span v-if="destino.cafeDaManhaIncluso" class="cc-chip cc-chip-cafe">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>
                  Café
                </span>
                <span v-if="destino.itensInclusos && destino.itensInclusos.length" class="cc-chip cc-chip-more">
                  +{{ destino.itensInclusos.length }}
                </span>
              </div>

              <div class="cc-footer">
                <div class="cc-preco">
                  <span class="cc-preco-label">a partir de</span>
                  <span class="cc-preco-value">R$ {{ Number(destino.preco).toLocaleString('pt-BR') }}</span>
                </div>
                <button class="cc-cta" @click.stop="$emit('abrir', destino)">
                  Ver
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <!-- Brilho de hover -->
            <div class="cc-glow"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de progresso -->
    <div class="progress-bar-wrap">
      <div
        class="progress-bar-fill"
        :style="{ width: `${((indiceAtivo + 1) / totalGrupos) * 100}%` }"
      ></div>
    </div>

  </section>
</template>

<script>
import api from "@/services/api"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default {
  name: "CarrosselDestinos",
  API_URL,

  emits: ["abrir"],

  data() {
    return {
      destinos: [],
      indiceAtivo: 0,
      autoplayTimer: null,

      // Drag / swipe
      dragStartX: 0,
      isDragging: false,
      touchStartX: 0,
    }
  },

  computed: {
    // SEMPRE 3 cards por grupo
    grupos() {
      const result = []
      for (let i = 0; i < this.destinos.length; i += 3) {
        result.push(this.destinos.slice(i, i + 3))
      }
      return result
    },

    totalGrupos() {
      return this.grupos.length
    }
  },

  methods: {
    async carregar() {
      try {
        const res = await api.get("/destinos")
        this.destinos = res.data.slice(0, 12) // máx 12 destaques
      } catch (e) {
        console.error("Erro ao carregar destinos do carrossel:", e)
      }
    },

    proximo() {
      if (this.indiceAtivo < this.totalGrupos - 1) {
        this.indiceAtivo++
        this.reiniciarAutoplay()
      } else {
        this.indiceAtivo = 0
        this.reiniciarAutoplay()
      }
    },

    anterior() {
      if (this.indiceAtivo > 0) {
        this.indiceAtivo--
        this.reiniciarAutoplay()
      }
    },

    irPara(i) {
      this.indiceAtivo = i
      this.reiniciarAutoplay()
    },

    iniciarAutoplay() {
      this.autoplayTimer = setInterval(() => {
        this.proximo()
      }, 3000) // TEMPO CURTO: 1.8 segundos
    },

    reiniciarAutoplay() {
      clearInterval(this.autoplayTimer)
      this.iniciarAutoplay()
    },

    // ── Drag com mouse ────────────────────
    iniciarDrag(e) {
      this.isDragging = true
      this.dragStartX = e.clientX
    },

    moverDrag(e) {
      if (!this.isDragging) return
      e.preventDefault()
    },

    finalizarDrag(e) {
      if (!this.isDragging) return
      this.isDragging = false
      const diff = this.dragStartX - e.clientX
      if (diff > 60) this.proximo()
      else if (diff < -60) this.anterior()
    },

    // ── Swipe por toque ───────────────────
    iniciarTouch(e) {
      this.touchStartX = e.touches[0].clientX
    },

    moverTouch() {},

    finalizarTouch(e) {
      const diff = this.touchStartX - e.changedTouches[0].clientX
      if (diff > 50) this.proximo()
      else if (diff < -50) this.anterior()
    },

    formatarCategoria(cat) {
      const map = {
        nacional: "Nacional", internacional: "Internacional",
        praia: "Praia", montanha: "Montanha",
        cidade: "Cidade", aventura: "Aventura", romantico: "Romântico"
      }
      return map[cat] || cat
    }
  },

  mounted() {
    this.carregar()
    this.iniciarAutoplay()
  },

  beforeUnmount() {
    clearInterval(this.autoplayTimer)
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════
   SEÇÃO
   ═══════════════════════════════════════ */
.carrossel-section {
  padding: 0 40px 64px;
  max-width: 1400px;
  margin: 0 auto;
  user-select: none;
}

/* ═══════════════════════════════════════
   CABEÇALHO
   ═══════════════════════════════════════ */
.carrossel-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
}

.header-left { display: flex; flex-direction: column; gap: 10px; }

.section-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #38bdf8;
}

.eyebrow-dot {
  width: 6px;
  height: 6px;
  background: #34d399;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.4); }
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
  line-height: 1.1;
}

.section-title em {
  font-style: italic;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 60%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Controles de navegação */
.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.nav-btn:hover:not(:disabled) {
  border-color: rgba(56,189,248,0.3);
  background: rgba(56,189,248,0.08);
  color: #38bdf8;
  transform: scale(1.05);
}

.nav-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.progress-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 100px;
  background: rgba(255,255,255,0.12);
  border: none;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(.22,.68,0,1.2);
  padding: 0;
}

.dot.active {
  width: 22px;
  background: #38bdf8;
  box-shadow: 0 0 10px rgba(56,189,248,0.5);
}

/* ═══════════════════════════════════════
   VIEWPORT & TRILHO
   ═══════════════════════════════════════ */
.carrossel-viewport {
  overflow: hidden;
  cursor: grab;
  border-radius: 4px;
}

.carrossel-viewport:active { cursor: grabbing; }

.carrossel-track {
  display: flex;
  gap: 28px;
  transition: transform 0.6s cubic-bezier(.22,.78,0,1.08); /* TRANSICAO RAPIDA */
  will-change: transform;
}

.carrossel-grupo {
  display: flex;
  gap: 28px;
  flex: 0 0 100%;
  min-width: 0;
}

/* ═══════════════════════════════════════
   CARD QUADRADO
   ═══════════════════════════════════════ */
.carrossel-card {
  flex: 1;
  min-width: 0;
  aspect-ratio: 1 / 1; /* CARD QUADRADO */
  background: #0c1222;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 22px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition:
    transform 0.45s cubic-bezier(.22,.68,0,1.1),
    box-shadow 0.45s ease,
    border-color 0.3s ease;
}

/* Borda gradiente no hover */
.carrossel-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 22px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(56,189,248,0.15), transparent 40%, transparent 60%, rgba(139,92,246,0.15));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.carrossel-card:hover::before { opacity: 1; }

.carrossel-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 20px 50px rgba(0,0,0,0.5),
    0 0 60px rgba(56,189,248,0.05);
  border-color: rgba(56,189,248,0.1);
}

/* Glow de fundo no hover */
.cc-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.06) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 0;
}
.carrossel-card:hover .cc-glow { opacity: 1; }

/* Imagem */
.cc-image-wrap {
  position: relative;
  height: 55%;
  overflow: hidden;
}

.cc-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(.22,.68,0,1.1);
}

.carrossel-card:hover .cc-image-wrap img { transform: scale(1.06); }

.cc-image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 20%,
    rgba(6,10,20,0.3) 60%,
    rgba(12,18,34,0.95) 100%
  );
}

/* Tags flutuantes */
.cc-tag {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  border-radius: 100px;
  backdrop-filter: blur(10px);
}

.cc-tag-cat {
  top: 14px;
  left: 14px;
  padding: 5px 12px;
  color: #f1f5f9;
  background: rgba(99,102,241,0.65);
  border: 1px solid rgba(255,255,255,0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cc-tag-badge {
  top: 14px;
  right: 14px;
  padding: 5px 11px;
  color: #34d399;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(52,211,153,0.2);
}

.badge-blink {
  width: 5px;
  height: 5px;
  background: #34d399;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.cc-tag-dur {
  bottom: 14px;
  left: 14px;
  padding: 5px 11px;
  color: #f1f5f9;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Corpo do card */
.cc-body {
  padding: 14px 18px 16px;
  position: relative;
  z-index: 1;
  height: 45%;
  display: flex;
  flex-direction: column;
}

.cc-name-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.cc-name-row h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
  line-height: 1.25;
}

.cc-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: 600;
  color: #fbbf24;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.14);
  padding: 3px 8px;
  border-radius: 7px;
  flex-shrink: 0;
}

.cc-desc {
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Chips */
.cc-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.cc-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 4px 9px;
  border-radius: 7px;
}

.cc-chip-hotel {
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.15);
  color: #818cf8;
}

.cc-chip-cafe {
  background: rgba(245,158,11,0.09);
  border: 1px solid rgba(245,158,11,0.14);
  color: #fbbf24;
}

.cc-chip-more {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #94a3b8;
}

/* Footer do card */
.cc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.04);
  margin-top: auto;
}

.cc-preco { display: flex; flex-direction: column; gap: 1px; }

.cc-preco-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #475569;
}

.cc-preco-value {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 600;
  color: #34d399;
}

.cc-cta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  border: 1px solid rgba(56,189,248,0.2);
  background: rgba(56,189,248,0.06);
  color: #38bdf8;
  font-size: 12px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.3px;
}

.cc-cta:hover {
  background: rgba(56,189,248,0.14);
  border-color: rgba(56,189,248,0.35);
  transform: translateX(2px);
}

/* ═══════════════════════════════════════
   BARRA DE PROGRESSO
   ═══════════════════════════════════════ */
.progress-bar-wrap {
  margin-top: 32px;
  height: 2px;
  background: rgba(255,255,255,0.05);
  border-radius: 100px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #818cf8);
  border-radius: 100px;
  transition: width 0.5s cubic-bezier(.22,.68,0,1.05);
  box-shadow: 0 0 8px rgba(56,189,248,0.4);
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 1024px) {
  .carrossel-section { padding: 0 24px 48px; }
}

@media (max-width: 640px) {
  .carrossel-section { padding: 0 16px 40px; }
  .carrossel-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .header-right { align-self: flex-end; }
  .carrossel-card { aspect-ratio: auto; height: auto; }
  .cc-image-wrap { height: 180px; }
  .progress-bar-wrap { margin-top: 24px; }
}
</style>