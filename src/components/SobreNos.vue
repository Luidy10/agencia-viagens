<template>
  <div class="vp-root">

    <!-- HERO -->
    <div class="vp-hero">
      <div class="vp-eyebrow">
        <div class="vp-eyebrow-line"></div>
        <span>Sobre a empresa</span>
      </div>
      <h1>Planejamos viagens.<br><em>Criamos memórias.</em></h1>
      <p class="vp-hero-sub">
        Uma plataforma construída para transformar a complexidade do planejamento
        em clareza, praticidade e experiências únicas ao redor do mundo.
      </p>
    </div>

    <!-- STATS -->
    <div class="vp-stats">
      <div class="vp-stat">
        <div class="vp-stat-num">16<span>+</span></div>
        <div class="vp-stat-label">Anos de atuação</div>
      </div>
      <div class="vp-stat">
        <div class="vp-stat-num">120<span>k</span></div>
        <div class="vp-stat-label">Clientes atendidos</div>
      </div>
      <div class="vp-stat">
        <div class="vp-stat-num">80<span>+</span></div>
        <div class="vp-stat-label">Destinos disponíveis</div>
      </div>
    </div>

    <!-- ABOUT BODY -->
    <div class="vp-about">
      <div class="vp-about-sidebar">
        <h2>Uma parceira para cada etapa da sua jornada</h2>
        <div class="vp-sidebar-tags">
          <div class="vp-tag">Tecnologia e inovação</div>
          <div class="vp-tag">Atendimento humanizado</div>
          <div class="vp-tag">Parcerias estratégicas</div>
          <div class="vp-tag">Segurança e confiabilidade</div>
          <div class="vp-tag">Personalização avançada</div>
        </div>
      </div>

      <div class="vp-about-content">
        <div class="vp-text-block">
          <p>
            A <strong>ViaPlan</strong> é uma plataforma especializada no planejamento de viagens,
            criada com o propósito de transformar a forma como as pessoas organizam e vivenciam
            suas experiências ao redor do mundo.
          </p>
        </div>

        <div class="vp-divider"></div>

        <div class="vp-text-block">
          <p>
            Desde sua fundação, a empresa tem como foco unir
            <strong>tecnologia, praticidade e um atendimento humanizado</strong>,
            oferecendo soluções completas que atendem desde viajantes ocasionais
            até aqueles que buscam experiências mais sofisticadas e personalizadas.
          </p>
        </div>

        <div :class="['vp-extra', { open: aboutOpen }]">
          <div class="vp-text-block">
            <p>
              Ao longo dos anos, a ViaPlan consolidou sua atuação por meio de processos eficientes,
              <strong>parcerias estratégicas</strong> e uma constante busca por inovação, garantindo
              segurança, confiabilidade e alto padrão de qualidade em cada etapa da jornada do cliente.
            </p>
          </div>
          <div class="vp-divider"></div>
          <div class="vp-text-block">
            <p>
              Mais do que uma ferramenta, a ViaPlan se posiciona como uma <strong>parceira estratégica</strong>
              na realização de experiências memoráveis, conectando pessoas a destinos, culturas
              e oportunidades únicas ao redor do mundo.
            </p>
          </div>
        </div>

        <button class="vp-read-more" @click="aboutOpen = !aboutOpen">
          {{ aboutOpen ? '← Ler menos' : 'Ler mais' }}
        </button>
      </div>
    </div>

    <!-- TIMELINE -->
    <div class="vp-timeline-section">
      <div class="vp-section-header">
        <h2>Nossa Trajetória</h2>
        <span>2010 — 2026</span>
      </div>

      <div class="vp-timeline">
        <div class="vp-timeline-track">
          <div class="vp-timeline-progress" :style="progressStyle"></div>
        </div>

        <div
          v-for="(ev, i) in eventos"
          :key="i"
          class="vp-tl-item"
          :class="{ active: ativo === i }"
          @click="toggleItem(i)"
        >
          <div class="vp-tl-dot"></div>
          <div class="vp-tl-year">{{ ev.ano }}</div>
          <div class="vp-tl-body">
            <div class="vp-tl-row">
              <span class="vp-tl-title">{{ ev.titulo }}</span>
              <span class="vp-tl-toggle">{{ ativo === i ? 'Fechar' : 'Ver mais' }}</span>
            </div>
            <div class="vp-tl-resumo">{{ ev.resumo }}</div>
            <div class="vp-tl-extra">
              <p>{{ ev.extra }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "NossaHistoria",

  data() {
    return {
      ativo: null,
      aboutOpen: false,
      eventos: [
        {
          ano: "2010",
          titulo: "Fundação",
          resumo: "Nascimento da ViaPlan.",
          extra: "Criada com o objetivo de transformar o planejamento de viagens em algo simples e acessível para todos os perfis de viajante."
        },
        {
          ano: "2012",
          titulo: "Primeiros Clientes",
          resumo: "Início das operações comerciais.",
          extra: "Atendimento personalizado e foco total na experiência do cliente desde os primeiros passos no mercado."
        },
        {
          ano: "2015",
          titulo: "Expansão Global",
          resumo: "Novos destinos internacionais.",
          extra: "Parcerias estratégicas internacionais e ampliação expressiva do portfólio de destinos disponíveis na plataforma."
        },
        {
          ano: "2018",
          titulo: "Inovação Digital",
          resumo: "Transformação tecnológica.",
          extra: "Implementação de ferramentas modernas para planejamento de roteiros, tornando a experiência mais ágil e intuitiva."
        },
        {
          ano: "2020",
          titulo: "Linha Premium",
          resumo: "Experiências exclusivas.",
          extra: "Lançamento de roteiros personalizados de alto padrão, com curadoria especializada e suporte dedicado."
        },
        {
          ano: "2023",
          titulo: "Consolidação",
          resumo: "Referência no setor.",
          extra: "Reconhecimento pela qualidade, inovação e excelência no atendimento, solidificando a posição da marca no mercado."
        },
        {
          ano: "2025",
          titulo: "Inteligência Avançada",
          resumo: "IA aplicada à experiência.",
          extra: "Uso de inteligência artificial para personalizar recomendações e otimizar cada etapa do planejamento do usuário."
        },
        {
          ano: "2026",
          titulo: "Nova Era",
          resumo: "Expansão e integração total.",
          extra: "A ViaPlan entra em uma nova fase com personalização avançada, suporte em tempo real e uma plataforma cada vez mais poderosa e intuitiva."
        }
      ]
    }
  },

  computed: {
    progressStyle() {
      if (this.ativo === null) return { height: '0%' }
      const pct = ((this.ativo + 1) / this.eventos.length * 100).toFixed(1)
      return { height: pct + '%' }
    }
  },

  methods: {
    toggleItem(i) {
      this.ativo = this.ativo === i ? null : i
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.vp-root {
  font-family: 'DM Sans', sans-serif;
  background: #0a0d14;
  color: #e8e4dc;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* ── HERO ── */
.vp-hero {
  position: relative;
  padding: 100px 60px 80px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.vp-hero::before {
  content: '';
  position: absolute;
  top: -120px; right: -120px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(193,155,94,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.vp-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.vp-eyebrow-line {
  width: 32px; height: 1px;
  background: #c19b5e;
}

.vp-eyebrow span {
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #c19b5e;
  font-weight: 500;
}

.vp-hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 700;
  line-height: 1.08;
  color: #f5f0e8;
  max-width: 680px;
  margin-bottom: 28px;
  text-align: center;
}

.vp-hero h1 em {
  font-style: italic;
  color: #c19b5e;
}

.vp-hero-sub {
  font-size: 1rem;
  color: #8a8680;
  max-width: 480px;
  line-height: 1.75;
  font-weight: 300;
  text-align: center;
}

/* ── STATS ── */
.vp-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid rgba(255,255,255,0.07);
  width: 100%;
}

.vp-stat {
  padding: 40px 20px;
  border-right: 1px solid rgba(255,255,255,0.07);
  text-align: center;
}

.vp-stat:last-child { border-right: none; }

.vp-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.6rem;
  font-weight: 700;
  color: #f5f0e8;
  line-height: 1;
  margin-bottom: 6px;
}

.vp-stat-num span { color: #c19b5e; }

.vp-stat-label {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5a5650;
  font-weight: 500;
}

/* ── ABOUT ── */
.vp-about {
  display: grid;
  grid-template-columns: 1fr 2fr;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  width: 100%;
}

.vp-about-sidebar {
  padding: 70px 40px 70px 40px;
  border-right: 1px solid rgba(255,255,255,0.07);
}

.vp-about-sidebar h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f5f0e8;
  margin-bottom: 20px;
  line-height: 1.35;
}

.vp-sidebar-tags {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 36px;
}

.vp-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #7a7670;
  letter-spacing: 0.06em;
}

.vp-tag::before {
  content: '';
  width: 18px; height: 1px;
  background: #c19b5e;
  flex-shrink: 0;
}

.vp-about-content {
  padding: 70px 40px 70px 40px;
}

.vp-text-block { margin-bottom: 28px; }

.vp-text-block p {
  font-size: 0.97rem;
  line-height: 1.9;
  color: #9a9590;
  font-weight: 300;
}

.vp-text-block p strong {
  color: #e8e4dc;
  font-weight: 500;
}

/* VER MAIS */
.vp-extra {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
}

.vp-extra.open {
  max-height: 400px;
  opacity: 1;
}

.vp-read-more {
  background: none;
  border: none;
  color: #c19b5e;
  font-size: 0.82rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 0;
  transition: gap 0.25s ease;
}

.vp-read-more:hover { gap: 16px; }

.vp-divider {
  width: 40px; height: 1px;
  background: rgba(193,155,94,0.3);
  margin: 28px 0;
}

/* ── TIMELINE ── */
.vp-timeline-section {
  padding: 80px 40px;
  width: 100%;
}

.vp-section-header {
  display: flex;
  align-items: baseline;
  gap: 20px;
  margin-bottom: 60px;
}

.vp-section-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #f5f0e8;
}

.vp-section-header span {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #3a3830;
  font-weight: 500;
}

.vp-timeline { position: relative; }

.vp-timeline-track {
  position: absolute;
  left: 0; top: 8px; bottom: 8px;
  width: 1px;
  background: rgba(255,255,255,0.06);
}

.vp-timeline-progress {
  position: absolute;
  left: 0; top: 0;
  width: 1px;
  background: linear-gradient(to bottom, #c19b5e, rgba(193,155,94,0.2));
  transition: height 0.6s ease;
}

.vp-tl-item {
  display: flex;
  gap: 36px;
  padding: 0 0 0 30px;
  position: relative;
  cursor: pointer;
}

.vp-tl-dot {
  position: absolute;
  left: -4px; top: 8px;
  width: 9px; height: 9px;
  border-radius: 50%;
  background: #2a2820;
  border: 1px solid #3a3830;
  transition: all 0.25s ease;
  z-index: 2;
}

.vp-tl-item.active .vp-tl-dot,
.vp-tl-item:hover .vp-tl-dot {
  background: #c19b5e;
  border-color: #c19b5e;
  box-shadow: 0 0 0 4px rgba(193,155,94,0.15);
}

.vp-tl-year {
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  color: #3a3830;
  min-width: 42px;
  padding-top: 4px;
  font-weight: 600;
  transition: color 0.25s;
}

.vp-tl-item.active .vp-tl-year,
.vp-tl-item:hover .vp-tl-year {
  color: #c19b5e;
}

.vp-tl-body {
  flex: 1;
  min-width: 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  padding-bottom: 28px;
  margin-bottom: 28px;
}

.vp-tl-item:last-child .vp-tl-body {
  border-bottom: none;
}

.vp-tl-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  gap: 8px;
}

.vp-tl-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e8e4dc;
  transition: color 0.25s;
}

.vp-tl-item:hover .vp-tl-title { color: #f5f0e8; }

.vp-tl-toggle {
  font-size: 0.7rem;
  color: #3a3830;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.25s;
  white-space: nowrap;
  flex-shrink: 0;
}

.vp-tl-item.active .vp-tl-toggle,
.vp-tl-item:hover .vp-tl-toggle {
  color: #c19b5e;
}

.vp-tl-resumo {
  font-size: 0.82rem;
  color: #4a4840;
  font-weight: 300;
}

.vp-tl-extra {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease, margin 0.35s;
  margin-top: 0;
}

.vp-tl-item.active .vp-tl-extra {
  max-height: 200px;
  opacity: 1;
  margin-top: 14px;
}

.vp-tl-extra p {
  font-size: 0.88rem;
  color: #7a7670;
  line-height: 1.8;
  font-weight: 300;
  border-left: 2px solid rgba(193,155,94,0.3);
  padding-left: 14px;
}

/* ══════════════════════════════════════
   RESPONSIVO — tablet (≤ 768px)
══════════════════════════════════════ */
@media (max-width: 768px) {

  .vp-hero {
    padding: 70px 24px 60px;
  }

  .vp-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .vp-stat {
    padding: 24px 12px;
  }

  .vp-stat-num {
    font-size: 2rem;
  }

  .vp-about {
    grid-template-columns: 1fr;
  }

  .vp-about-sidebar {
    padding: 40px 24px 32px;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .vp-about-content {
    padding: 36px 24px 40px;
  }

  .vp-sidebar-tags {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
  }

  .vp-timeline-section {
    padding: 60px 24px;
  }

  .vp-tl-item {
    gap: 16px;
  }

  .vp-tl-year {
    min-width: 36px;
    font-size: 0.8rem;
  }
}

/* ══════════════════════════════════════
   RESPONSIVO — mobile (≤ 480px)
══════════════════════════════════════ */
@media (max-width: 480px) {

  .vp-hero {
    padding: 56px 20px 48px;
  }

  .vp-hero-sub {
    font-size: 0.92rem;
  }

  .vp-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .vp-stat {
    padding: 18px 8px;
  }

  .vp-stat-num {
    font-size: 1.6rem;
  }

  .vp-stat-label {
    font-size: 0.58rem;
    letter-spacing: 0.06em;
  }

  .vp-about-sidebar {
    padding: 32px 20px;
  }

  .vp-about-sidebar h2 {
    font-size: 1.2rem;
  }

  .vp-about-content {
    padding: 28px 20px 36px;
  }

  .vp-text-block p {
    font-size: 0.92rem;
  }

  .vp-timeline-section {
    padding: 48px 20px;
  }

  .vp-section-header {
    flex-direction: column;
    gap: 4px;
    margin-bottom: 40px;
  }

  .vp-section-header h2 {
    font-size: 1.5rem;
  }

  .vp-tl-item {
    gap: 10px;
    padding-left: 22px;
  }

  .vp-tl-year {
    min-width: 30px;
    font-size: 0.75rem;
  }

  .vp-tl-title {
    font-size: 0.88rem;
  }

  .vp-tl-toggle {
    font-size: 0.62rem;
  }
}
</style>