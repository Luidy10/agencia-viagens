<template>
  <div class="page">

    <!-- ═══════════════════════════════════════════════
        LEFT PANEL DINÂMICO
    ════════════════════════════════════════════════ -->
    <aside class="left-panel">

      <!-- Painel padrão (sem destino) -->
      <Transition name="fade-panel">
        <div v-if="!destinoAtivo" class="panel-default" key="default">
          <div class="left-noise"></div>
          <div class="left-orbs">
            <div class="orb-a"></div><div class="orb-b"></div><div class="orb-c"></div>
          </div>
          <div class="left-content">
            <div class="brand">
              <span class="brand-gem">✦</span>
              <span class="brand-name">ViaPlan</span>
            </div>
            <div class="left-headline">
              <p class="eyebrow">Reserve com confiança</p>
              <h1>Sua<br/><em>próxima</em><br/>aventura.</h1>
            </div>
            <div class="left-features">
              <div class="feature"><span class="feature-line"></span><span>Destinos curados por especialistas</span></div>
              <div class="feature"><span class="feature-line"></span><span>Suporte 24h durante a viagem</span></div>
              <div class="feature"><span class="feature-line"></span><span>Melhores preços garantidos</span></div>
            </div>
            <div class="trust-strip">
              <div class="trust-item">
                <span class="trust-num">12k<sup>+</sup></span>
                <span class="trust-label">Viajantes</span>
              </div>
              <div class="trust-divider"></div>
              <div class="trust-item">
                <span class="trust-num">98<sup>%</sup></span>
                <span class="trust-label">Satisfação</span>
              </div>
              <div class="trust-divider"></div>
              <div class="trust-item">
                <span class="trust-num">60<sup>+</sup></span>
                <span class="trust-label">Destinos</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Painel dinâmico (com destino selecionado) -->
      <Transition name="fade-panel">
        <div v-if="destinoAtivo" class="panel-dest" key="dest">
          <div class="dest-bg" :style="{ backgroundImage: destinoAtivo.imagem ? `url(${$options.API_URL}${destinoAtivo.imagem})` : 'none' }"></div>
          <div class="dest-overlay"></div>
          <div class="dest-overlay-bottom"></div>
          <div class="dest-content">
            <div class="brand brand-light">
              <span class="brand-gem">✦</span>
              <span class="brand-name">ViaPlan</span>
            </div>
            <div class="dest-info">
              <p class="dest-eyebrow">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 018 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 018-8z"/></svg>
                Destino selecionado
              </p>
              <h2 class="dest-nome">{{ destinoAtivo.nome }}</h2>
              <p class="dest-descricao">{{ destinoAtivo.descricao }}</p>
              <div class="dest-badges">
                <div v-if="destinoAtivo.aeroporto" class="dest-badge">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17h18M6.5 17l1-5.5L12 13l4.5-8 1 8L21 17"/></svg>
                  {{ destinoAtivo.aeroporto }}
                </div>
                <div class="dest-badge dest-badge-preco">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                  R$ {{ Number(destinoAtivo.preco).toLocaleString('pt-BR') }}/pessoa
                </div>
              </div>
            </div>
            <div class="dest-footer">
              <div>
                <div class="dest-total-label">Total · {{ form.pessoas }} {{ form.pessoas === 1 ? 'passageiro' : 'passageiros' }}{{ duracaoDias ? ` · ${duracaoDias}d` : '' }}</div>
                <div class="dest-total-valor">R$ {{ getPreco(form.destino) }}</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </aside>

    <!-- ═══════════════════════════════════════════════
        RIGHT PANEL
    ════════════════════════════════════════════════ -->
    <main class="right-panel">
      <header class="top-bar">
        <div class="usuario-info">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="usuario-nome">{{ usuarioNome }}</span>
        </div>
        <button @click="logout" class="btn-logout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sair
        </button>
      </header>

      <div class="form-wrapper">
        <div class="form-header">
          <h2>Reservar viagem</h2>
          <p>Preencha os dados abaixo para garantir sua vaga</p>
        </div>

        <!-- Barra de progresso -->
        <div class="form-steps">
          <div class="step" :class="{ active: stepAtual >= 1, done: stepAtual > 1 }">
            <div class="step-circle">
              <svg v-if="stepAtual > 1" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>1</span>
            </div>
            <span class="step-label">Dados</span>
          </div>
          <div class="step-line" :class="{ active: stepAtual > 1 }"></div>
          <div class="step" :class="{ active: stepAtual >= 2, done: stepAtual > 2 }">
            <div class="step-circle">
              <svg v-if="stepAtual > 2" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>2</span>
            </div>
            <span class="step-label">Destino</span>
          </div>
          <div class="step-line" :class="{ active: stepAtual > 2 }"></div>
          <div class="step" :class="{ active: stepAtual >= 3 }">
            <div class="step-circle"><span>3</span></div>
            <span class="step-label">Revisão</span>
          </div>
        </div>

        <form @submit.prevent="irPagamento" class="form">

          <!-- ── STEP 1: Dados pessoais ── -->
          <Transition name="slide-step" mode="out-in">
            <div v-if="stepAtual === 1" class="step-section" key="step1">
              <p class="section-title">Informações do viajante</p>

              <div class="field-group">
                <label class="field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Nome completo
                </label>
                <input v-model="form.nome" type="text" placeholder="Seu nome completo" :class="{ filled: form.nome, error: erros.nome }" />
                <span v-if="erros.nome" class="field-error">{{ erros.nome }}</span>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  E-mail
                </label>
                <input v-model="form.email" type="email" placeholder="seu@email.com" :class="{ filled: form.email, error: erros.email }" />
                <span v-if="erros.email" class="field-error">{{ erros.email }}</span>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  Passageiros
                </label>
                <div class="counter-wrap">
                  <button type="button" class="counter-btn" @click="decrementar">−</button>
                  <span class="counter-val">{{ form.pessoas }}</span>
                  <button type="button" class="counter-btn" @click="incrementar">+</button>
                  <span class="counter-hint">{{ form.pessoas === 1 ? 'passageiro' : 'passageiros' }}</span>
                </div>
              </div>

              <button type="button" class="btn-next" @click="irStep2">
                Continuar
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </Transition>

          <!-- ── STEP 2: Destino e calendário ── -->
          <Transition name="slide-step" mode="out-in">
            <div v-if="stepAtual === 2" class="step-section" key="step2">
              <p class="section-title">Destino e período</p>

              <div class="field-group">
                <label class="field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 018 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 018-8z"/></svg>
                  Destino
                </label>
                <div class="select-wrap">
                  <select v-model="form.destino" :class="{ filled: form.destino }">
                    <option disabled value="">Selecione o destino</option>
                    <option v-for="d in destinos" :key="d._id" :value="d.nome">{{ d.nome }}</option>
                  </select>
                  <svg class="select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>

              <!-- Calendário customizado -->
              <div class="cal-container">
                <div class="cal-header">
                  <button type="button" class="cal-nav" @click="mesAnterior">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="cal-titulo">{{ nomeMes }} {{ anoAtual }}</span>
                  <button type="button" class="cal-nav" @click="proximoMes">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>

                <div class="cal-semana">
                  <span v-for="d in ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']" :key="d">{{ d }}</span>
                </div>

                <div class="cal-grid">
                  <div
                    v-for="(dia, idx) in diasDoMes"
                    :key="idx"
                    class="cal-dia"
                    :class="classeDia(dia)"
                    @click="dia.data && !dia.passado && selecionarDia(dia.data)"
                  >
                    <span v-if="dia.data">{{ dia.numero }}</span>
                  </div>
                </div>

                <!-- Legenda -->
                <div class="cal-legenda">
                  <div class="cal-leg-item">
                    <span class="cal-leg-dot cal-leg-ida"></span>
                    <span>{{ form.dataIda ? 'Ida: ' + formatarData(form.dataIda) : 'Clique para ida' }}</span>
                  </div>
                  <div class="cal-leg-sep">→</div>
                  <div class="cal-leg-item">
                    <span class="cal-leg-dot cal-leg-volta"></span>
                    <span>{{ form.dataVolta ? 'Volta: ' + formatarData(form.dataVolta) : 'Clique para volta' }}</span>
                  </div>
                  <button v-if="form.dataIda || form.dataVolta" type="button" class="cal-limpar" @click="limparDatas">✕</button>
                </div>

                <div v-if="duracaoDias" class="duracao-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ duracaoDias }} {{ duracaoDias === 1 ? 'dia' : 'dias' }} de viagem
                </div>
              </div>

              <div class="step-nav">
                <button type="button" class="btn-back" @click="stepAtual = 1">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Voltar
                </button>
                <button type="button" class="btn-next" @click="irStep3">
                  Revisar
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </Transition>

          <!-- ── STEP 3: Revisão ── -->
          <Transition name="slide-step" mode="out-in">
            <div v-if="stepAtual === 3" class="step-section" key="step3">
              <p class="section-title">Revise sua reserva</p>

              <div class="resumo-card">
                <div v-if="destinoAtivo && destinoAtivo.imagem" class="resumo-img-wrap">
                  <img :src="`${$options.API_URL}${destinoAtivo.imagem}`" :alt="destinoAtivo.nome" class="resumo-img" />
                  <div class="resumo-img-overlay"></div>
                  <span class="resumo-img-nome">{{ destinoAtivo.nome }}</span>
                </div>
                <div class="resumo-rows">
                  <div class="resumo-row">
                    <div class="resumo-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    <div><span class="resumo-label">Viajante</span><strong>{{ form.nome }}</strong></div>
                  </div>
                  <div class="resumo-row">
                    <div class="resumo-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                    <div><span class="resumo-label">E-mail</span><strong>{{ form.email }}</strong></div>
                  </div>
                  <div class="resumo-row">
                    <div class="resumo-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
                    <div><span class="resumo-label">Período</span><strong>{{ formatarData(form.dataIda) }} → {{ formatarData(form.dataVolta) }}</strong></div>
                  </div>
                  <div class="resumo-row">
                    <div class="resumo-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                    <div><span class="resumo-label">Passageiros</span><strong>{{ form.pessoas }} {{ form.pessoas === 1 ? 'pessoa' : 'pessoas' }}</strong></div>
                  </div>
                </div>
                <div class="resumo-total">
                  <span class="total-label">Total estimado</span>
                  <span class="total-valor">R$ {{ getPreco(form.destino) }}</span>
                </div>
              </div>

              <div class="step-nav">
                <button type="button" class="btn-back" @click="stepAtual = 2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Voltar
                </button>
                <button type="submit" class="btn-submit" :disabled="loading">
                  <span v-if="!loading">
                    Ir para pagamento
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                  <span v-else class="btn-loading">
                    <span class="spinner"></span>
                    Processando...
                  </span>
                </button>
              </div>
            </div>
          </Transition>

        </form>
      </div>
    </main>

  </div>
</template>

<script>
import api from "@/services/api"

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default {
  name: "Viagens",
  API_URL,

  data() {
    const hoje = new Date()
    return {
      hoje: hoje.toISOString().split("T")[0],
      destinos: [],
      loading: false,
      stepAtual: 1,
      erros: {},
      calMes: hoje.getMonth(),
      calAno: hoje.getFullYear(),
      selecionandoVolta: false,
      form: {
        nome: "", email: "", destino: "",
        dataIda: "", dataVolta: "", pessoas: 1
      }
    }
  },

  computed: {
    usuarioNome() {
      const u = sessionStorage.getItem('usuario')
      return u ? JSON.parse(u).nome : 'Viajante'
    },

    destinoAtivo() {
      if (!this.form.destino) return null
      return this.destinos.find(d => d.nome === this.form.destino) || null
    },

    duracaoDias() {
      if (!this.form.dataIda || !this.form.dataVolta) return null
      const diff = Math.round((new Date(this.form.dataVolta) - new Date(this.form.dataIda)) / 86400000)
      return diff > 0 ? diff : null
    },

    nomeMes() { return MESES[this.calMes] },
    anoAtual() { return this.calAno },

    diasDoMes() {
      const primeiroDia = new Date(this.calAno, this.calMes, 1).getDay()
      const totalDias   = new Date(this.calAno, this.calMes + 1, 0).getDate()
      const hoje        = new Date(); hoje.setHours(0,0,0,0)
      const dias = []
      for (let i = 0; i < primeiroDia; i++) dias.push({ data: null, numero: null, passado: false })
      for (let d = 1; d <= totalDias; d++) {
        const data = new Date(this.calAno, this.calMes, d)
        data.setHours(0,0,0,0)
        dias.push({ data: data.toISOString().split('T')[0], numero: d, passado: data < hoje })
      }
      return dias
    }
  },

  methods: {
    incrementar() { this.form.pessoas++ },
    decrementar() { if (this.form.pessoas > 1) this.form.pessoas-- },

    formatarData(data) {
      if (!data) return "-"
      const [ano, mes, dia] = data.split("-")
      return `${dia}/${mes}/${ano}`
    },

    getPreco(nomeDestino) {
      const d = this.destinos.find(d => d.nome === nomeDestino)
      if (!d) return "0,00"
      return (d.preco * (this.form.pessoas || 1)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
    },

    mesAnterior() {
      if (this.calMes === 0) { this.calMes = 11; this.calAno-- }
      else this.calMes--
    },
    proximoMes() {
      if (this.calMes === 11) { this.calMes = 0; this.calAno++ }
      else this.calMes++
    },

    selecionarDia(dataStr) {
      if (!this.form.dataIda || this.selecionandoVolta) {
        if (this.selecionandoVolta && this.form.dataIda && dataStr <= this.form.dataIda) {
          this.form.dataIda   = dataStr
          this.form.dataVolta = ""
          this.selecionandoVolta = true
        } else if (this.selecionandoVolta) {
          this.form.dataVolta = dataStr
          this.selecionandoVolta = false
        } else {
          this.form.dataIda   = dataStr
          this.form.dataVolta = ""
          this.selecionandoVolta = true
        }
      } else {
        this.form.dataIda   = dataStr
        this.form.dataVolta = ""
        this.selecionandoVolta = true
      }
    },

    limparDatas() {
      this.form.dataIda   = ""
      this.form.dataVolta = ""
      this.selecionandoVolta = false
    },

    classeDia(dia) {
      if (!dia.data) return 'cal-vazio'
      const classes = []
      if (dia.passado) classes.push('cal-passado')
      if (dia.data === this.form.dataIda)   classes.push('cal-selecionado', 'cal-inicio')
      if (dia.data === this.form.dataVolta) classes.push('cal-selecionado', 'cal-fim')
      if (this.form.dataIda && this.form.dataVolta && dia.data > this.form.dataIda && dia.data < this.form.dataVolta) {
        classes.push('cal-range')
      }
      const hoje = new Date(); hoje.setHours(0,0,0,0)
      const d = new Date(dia.data + 'T00:00:00')
      if (d.getTime() === hoje.getTime()) classes.push('cal-hoje')
      return classes
    },

    irStep2() {
      this.erros = {}
      if (!this.form.nome.trim())  { this.erros.nome  = "Informe seu nome.";   return }
      if (!this.form.email.trim()) { this.erros.email = "Informe seu e-mail."; return }
      this.stepAtual = 2
    },

    irStep3() {
      if (!this.form.destino)   { alert("Selecione um destino."); return }
      if (!this.form.dataIda)   { alert("Selecione a data de ida no calendário."); return }
      if (!this.form.dataVolta) { alert("Selecione a data de volta no calendário."); return }
      this.stepAtual = 3
    },

    logout() {
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('usuario')
      this.$router.push('/login')
    },

    async irPagamento() {
      this.loading = true
      try {
        const { data } = await api.post("/viagens", this.form)
        const id = data?.viagem?._id
        if (!id) throw new Error("ID não retornado")
        this.$router.push({ name: "Pagamentos", query: { id, ...this.form } })
      } catch (e) {
        console.error(e)
        alert("Erro ao processar reserva. Tente novamente.")
      } finally {
        this.loading = false
      }
    }
  },

  async mounted() {
    if (!sessionStorage.getItem('authToken')) {
      this.$router.push('/login')
      return
    }

    const usuarioStr = sessionStorage.getItem('usuario')
    if (usuarioStr) {
      try {
        const u = JSON.parse(usuarioStr)
        if (u.nome)  this.form.nome  = u.nome
        if (u.email) this.form.email = u.email
      } catch(e) {}
    }

    try {
      const { data } = await api.get("/destinos")
      this.destinos = data
      // ── Pré-seleciona destino se vier via query param (ex: reagendar do Perfil) ──
      if (this.$route.query.destino) {
        this.form.destino = this.$route.query.destino
        // Pula direto para o step 2 (destino + datas) já que dados pessoais estão preenchidos
        if (this.form.nome && this.form.email) {
          this.stepAtual = 2
        }
      }
    } catch (e) {
      this.destinos = [
        { _id:'1', nome:'Paris, França',  preco:4500, descricao:'A cidade da luz com arquitetura incomparável e gastronomia refinada.', aeroporto:'CDG – Charles de Gaulle', imagem:'' },
        { _id:'2', nome:'Tóquio, Japão',  preco:6200, descricao:'Uma metrópole que une tradição milenar e tecnologia de ponta.', aeroporto:'NRT – Narita', imagem:'' },
        { _id:'3', nome:'Nova York, EUA', preco:3800, descricao:'A cidade que nunca dorme, cheia de energia e possibilidades.', aeroporto:'JFK – John F. Kennedy', imagem:'' },
        { _id:'4', nome:'Roma, Itália',   preco:4100, descricao:'A cidade eterna com séculos de história e arte inigualável.', aeroporto:'FCO – Leonardo da Vinci', imagem:'' },
        { _id:'5', nome:'Maldivas',       preco:8900, descricao:'Paraíso tropical com águas cristalinas e bangalôs sobre o mar.', aeroporto:'MLE – Velana', imagem:'' }
      ]
      if (this.$route.query.destino) {
        this.form.destino = this.$route.query.destino
        if (this.form.nome && this.form.email) {
          this.stepAtual = 2
        }
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
}

.left-panel {
  position: relative;
  width: 40%;
  height: 100vh;
  overflow: hidden;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .left-panel { display: none; }
  .right-panel { width: 100%; height: 100vh; }
}

.fade-panel-enter-active,
.fade-panel-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
  position: absolute; inset: 0;
}
.fade-panel-enter-from { opacity: 0; transform: scale(1.05); }
.fade-panel-leave-to   { opacity: 0; transform: scale(0.96); }

.panel-default {
  position: absolute; inset: 0;
  background: #040810;
  display: flex; align-items: center;
  padding: 0 48px;
}

.left-noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.04; pointer-events: none;
}

.left-orbs { position: absolute; inset: 0; pointer-events: none; }
.orb-a { position: absolute; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, rgba(196,155,80,0.15) 0%, transparent 65%); top: -150px; left: -120px; }
.orb-b { position: absolute; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(80,140,220,0.08) 0%, transparent 65%); bottom: -80px; right: -60px; }
.orb-c { position: absolute; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle, rgba(196,155,80,0.1) 0%, transparent 65%); bottom: 25%; left: 55%; }

.left-content {
  position: relative; z-index: 1;
  width: 100%;
  display: flex; flex-direction: column;
  gap: 32px;
}

.brand { display: flex; align-items: center; gap: 10px; }
.brand-gem { color: #c49b50; font-size: 16px; filter: drop-shadow(0 0 6px rgba(196,155,80,0.6)); }
.brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem; font-weight: 600;
  color: rgba(232,220,200,0.85); letter-spacing: 1.5px;
  text-transform: uppercase;
}

.eyebrow {
  font-family: 'Outfit', sans-serif;
  font-size: 10px; font-weight: 500;
  letter-spacing: 4px; text-transform: uppercase;
  color: #c49b50; margin-bottom: 12px; opacity: 0.9;
}

.left-headline h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 4.5vw, 4.2rem);
  font-weight: 900; color: #f5ede0;
  line-height: 1.0; letter-spacing: -1px;
}
.left-headline h1 em {
  font-style: italic; font-weight: 400; color: #c49b50;
  font-family: 'DM Serif Display', serif;
  font-size: 1.1em; letter-spacing: -0.5px;
}

.left-features { display: flex; flex-direction: column; gap: 10px; }
.feature {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: rgba(138,155,176,0.9); font-weight: 300;
  font-family: 'Outfit', sans-serif;
}
.feature-line {
  display: block; width: 20px; height: 1px;
  background: linear-gradient(to right, #c49b50, rgba(196,155,80,0.2));
  flex-shrink: 0;
}

.trust-strip {
  display: flex; align-items: center; gap: 20px;
  padding-top: 24px; border-top: 1px solid rgba(196,155,80,0.15);
}
.trust-item { display: flex; flex-direction: column; gap: 2px; }
.trust-num { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #f5ede0; line-height: 1; }
.trust-num sup { font-size: 0.55em; vertical-align: super; color: #c49b50; }
.trust-label { font-size: 10px; font-weight: 400; color: rgba(74,85,104,0.9); text-transform: uppercase; letter-spacing: 1.5px; }
.trust-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.06); }

.panel-dest { position: absolute; inset: 0; display: flex; flex-direction: column; }

.dest-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  background-color: #040810; transition: background-image 0.8s ease;
}

.dest-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(4,8,16,0.5) 0%, rgba(4,8,16,0.15) 30%, rgba(4,8,16,0.45) 65%, rgba(4,8,16,0.94) 100%);
}
.dest-overlay-bottom {
  position: absolute; bottom: 0; left: 0; right: 0; height: 60%;
  background: linear-gradient(to top, rgba(2,4,10,0.98) 0%, transparent 100%);
}

.dest-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column;
  justify-content: space-between;
  height: 100%; padding: 36px 48px;
}

.brand-light .brand-name { color: rgba(255,255,255,0.88); }
.dest-info { margin-top: auto; padding-top: 24px; }

.dest-eyebrow {
  display: flex; align-items: center; gap: 6px;
  font-size: 9.5px; font-weight: 600; letter-spacing: 3.5px;
  text-transform: uppercase; color: #c49b50; margin-bottom: 10px;
  font-family: 'Outfit', sans-serif;
}

.dest-nome {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 700; color: #fff; line-height: 1.1;
  margin-bottom: 12px; text-shadow: 0 2px 30px rgba(0,0,0,0.5); letter-spacing: -0.5px;
}

.dest-descricao {
  font-size: 13px; color: rgba(255,255,255,0.65);
  font-weight: 300; line-height: 1.7;
  margin-bottom: 18px; max-width: 320px; font-family: 'Outfit', sans-serif;
}

.dest-badges { display: flex; flex-wrap: wrap; gap: 7px; }
.dest-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 11px; border-radius: 100px;
  font-size: 11px; font-weight: 500;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.8); backdrop-filter: blur(8px); font-family: 'Outfit', sans-serif;
}
.dest-badge-preco { background: rgba(196,155,80,0.12); border-color: rgba(196,155,80,0.35); color: #e8c87a; }

.dest-footer {
  display: flex; align-items: flex-end; justify-content: space-between;
  padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 20px;
}
.dest-total-label { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 300; letter-spacing: 0.5px; margin-bottom: 4px; font-family: 'Outfit', sans-serif; }
.dest-total-valor { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; color: #c49b50; line-height: 1; }

.right-panel {
  flex: 1; background: #f7f4ef;
  display: flex; flex-direction: column;
  padding: 0 36px 24px;
  overflow-y: auto; height: 100vh;
}

.top-bar {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 14px; padding: 16px 0; flex-shrink: 0;
}
.usuario-info { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #64748b; }
.usuario-nome { font-weight: 500; color: #0f172a; }
.btn-logout {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; background: white;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 12.5px; color: #64748b; cursor: pointer;
  transition: all 0.2s; font-family: 'Outfit', sans-serif;
}
.btn-logout:hover { border-color: #dc2626; color: #dc2626; background: #fef2f2; }

.form-wrapper { width: 100%; max-width: 460px; margin: 0 auto; flex: 1; }

.form-header { margin-bottom: 18px; }
.form-header h2 { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
.form-header p { font-size: 13px; color: #94a3b8; font-weight: 300; }

.form-steps { display: flex; align-items: center; margin-bottom: 22px; }
.step { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; }
.step-circle {
  width: 26px; height: 26px; border-radius: 50%;
  background: #e2e8f0; border: 2px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; color: #94a3b8; transition: all 0.3s;
}
.step.active .step-circle { background: #0f172a; border-color: #0f172a; color: white; }
.step.done .step-circle  { background: #c49b50; border-color: #c49b50; color: white; }
.step-label { font-size: 9.5px; font-weight: 500; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; transition: color 0.3s; }
.step.active .step-label, .step.done .step-label { color: #64748b; }
.step-line { flex: 1; height: 2px; background: #e2e8f0; margin: 0 8px; margin-bottom: 20px; transition: background 0.3s; }
.step-line.active { background: #c49b50; }

.form { display: flex; flex-direction: column; }
.slide-step-enter-active, .slide-step-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.slide-step-enter-from { opacity: 0; transform: translateX(16px); }
.slide-step-leave-to   { opacity: 0; transform: translateX(-16px); }

.step-section { display: flex; flex-direction: column; gap: 14px; }
.section-title { font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; padding-bottom: 10px; border-bottom: 1px solid #e9e3d8; }

.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }

input[type="text"], input[type="email"] {
  width: 100%; padding: 11px 14px;
  background: white; border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; color: #0f172a;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus { border-color: #c49b50; box-shadow: 0 0 0 3px rgba(196,155,80,0.1); }
input.filled { border-color: #cbd5e1; }
input.error { border-color: #f87171; }
.field-error { font-size: 11.5px; color: #ef4444; }

.select-wrap { position: relative; }
.select-wrap select {
  width: 100%; padding: 11px 38px 11px 14px;
  background: white; border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; color: #0f172a;
  outline: none; appearance: none; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
}
.select-wrap select:focus { border-color: #c49b50; box-shadow: 0 0 0 3px rgba(196,155,80,0.1); }
.select-wrap select.filled { border-color: #cbd5e1; }
.select-chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }

.counter-wrap { display: flex; align-items: center; background: white; border: 1.5px solid #e2e8f0; border-radius: 9px; overflow: hidden; width: fit-content; }
.counter-btn { width: 40px; height: 40px; background: transparent; border: none; font-size: 17px; color: #475569; cursor: pointer; transition: background 0.15s, color 0.15s; display: flex; align-items: center; justify-content: center; }
.counter-btn:hover { background: #f1f5f9; color: #c49b50; }
.counter-val { min-width: 44px; text-align: center; font-size: 14px; font-weight: 600; color: #0f172a; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; height: 40px; display: flex; align-items: center; justify-content: center; }
.counter-hint { padding: 0 12px; font-size: 12.5px; color: #94a3b8; font-weight: 300; }

.cal-container { background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; user-select: none; }

.cal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-bottom: 1px solid #f0ece6; background: #faf8f4;
}

.cal-titulo { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 600; color: #0f172a; letter-spacing: 0.3px; }

.cal-nav {
  width: 30px; height: 30px; background: white; border: 1px solid #e2e8f0; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #64748b; transition: all 0.15s;
}
.cal-nav:hover { background: #f8f5f0; border-color: #c49b50; color: #c49b50; }

.cal-semana { display: grid; grid-template-columns: repeat(7, 1fr); padding: 8px 12px 4px; border-bottom: 1px solid #f0ece6; }
.cal-semana span { text-align: center; font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; padding: 2px 0; }

.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); padding: 6px 10px 10px; gap: 2px; }

.cal-dia {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font-size: 12.5px; font-weight: 400; color: #0f172a; border-radius: 7px;
  cursor: pointer; transition: all 0.13s; position: relative;
}
.cal-dia:not(.cal-vazio):not(.cal-passado):hover { background: #f8f0e3; color: #c49b50; }
.cal-vazio { pointer-events: none; }
.cal-passado { color: #cbd5e1 !important; cursor: not-allowed; pointer-events: none; }
.cal-hoje { font-weight: 700; color: #c49b50; }
.cal-hoje::after { content: ''; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: #c49b50; }
.cal-selecionado { background: #0f172a !important; color: white !important; font-weight: 600; border-radius: 7px; z-index: 1; }
.cal-selecionado.cal-inicio { background: #c49b50 !important; border-radius: 7px; }
.cal-selecionado.cal-fim { background: #0f172a !important; border-radius: 7px; }
.cal-range { background: rgba(196,155,80,0.12) !important; color: #92620a !important; border-radius: 0; }
.cal-inicio { border-radius: 7px !important; }
.cal-fim    { border-radius: 7px !important; }

.cal-legenda {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; background: #faf8f4; border-top: 1px solid #f0ece6;
  font-size: 11.5px; color: #64748b; flex-wrap: wrap;
}
.cal-leg-item { display: flex; align-items: center; gap: 5px; }
.cal-leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.cal-leg-ida   { background: #c49b50; }
.cal-leg-volta { background: #0f172a; }
.cal-leg-sep { color: #cbd5e1; font-weight: 300; }
.cal-limpar { margin-left: auto; background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 11px; padding: 2px 6px; border-radius: 4px; transition: all 0.15s; }
.cal-limpar:hover { background: #fee2e2; color: #dc2626; }

.duracao-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 13px; background: #f0fdf4;
  border: 1px solid #bbf7d0; border-radius: 100px;
  font-size: 12px; font-weight: 500; color: #16a34a;
  width: fit-content; margin-top: 2px;
}

.resumo-card { background: white; border: 1.5px solid #e9e3d8; border-radius: 12px; overflow: hidden; }
.resumo-img-wrap { position: relative; height: 110px; overflow: hidden; }
.resumo-img { width: 100%; height: 100%; object-fit: cover; }
.resumo-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%); }
.resumo-img-nome { position: absolute; bottom: 12px; left: 16px; font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; color: white; }
.resumo-rows { padding: 14px 16px 2px; display: flex; flex-direction: column; gap: 10px; }
.resumo-row { display: flex; align-items: flex-start; gap: 10px; }
.resumo-icon { width: 28px; height: 28px; background: #f8f7f4; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #94a3b8; }
.resumo-row > div { display: flex; flex-direction: column; gap: 1px; }
.resumo-label { font-size: 9.5px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.resumo-row strong { font-size: 13px; color: #0f172a; font-weight: 500; }
.resumo-total { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; margin-top: 12px; border-top: 1px solid #e9e3d8; background: #faf8f4; }
.total-label { font-size: 10.5px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
.total-valor { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #c49b50; }

.step-nav { display: flex; gap: 10px; }
.btn-back {
  display: flex; align-items: center; gap: 7px;
  padding: 12px 18px; background: white;
  border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.btn-back:hover { border-color: #c49b50; color: #c49b50; }
.btn-next, .btn-submit {
  flex: 1; padding: 13px 22px; background: #0f172a; color: white;
  border: none; border-radius: 9px;
  font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 9px;
}
.btn-next { width: 100%; }
.btn-next:hover, .btn-submit:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.18); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-loading { display: flex; align-items: center; gap: 9px; }
.spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .page { flex-direction: column; height: auto; }
  .right-panel { height: auto; padding: 16px; }
  .step-nav { flex-direction: column; }
}
</style>