<template>
  <div class="admin">

    <!-- HEADER -->
    <header class="admin-header">
      <div class="header-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="grain"></div>
      </div>
      <div class="header-content">
        <span class="label">⚙ Painel de controle</span>
        <h1>Gerenciar <em>Destinos</em></h1>
        <p class="subtitle">Cadastre, edite, visualize e remova destinos da plataforma</p>
      </div>
    </header>

    <div class="admin-body">

      <!-- FORM -->
      <section class="form-section">
        <div class="section-title">
          <div class="section-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          </div>
          <h2>Novo destino</h2>
        </div>

        <div class="form">
          <!-- Nome e Preço -->
          <div class="form-row">
            <div class="field">
              <label>Nome do destino</label>
              <input v-model="form.nome" placeholder="Ex: Paris, França" />
            </div>
            <div class="field">
              <label>Preço (R$)</label>
              <input v-model="form.preco" placeholder="Ex: 3500" type="number" />
            </div>
          </div>

          <!-- Datas e Categoria -->
          <div class="form-row form-row-dates">

            <!-- CALENDÁRIO CUSTOMIZADO -->
            <div class="field" v-click-outside="() => calAberto = false">
              <label>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Período da viagem
              </label>

              <!-- Trigger -->
              <div class="date-trigger" :class="{ active: calAberto }" @click="calAberto = !calAberto">
                <div class="date-trigger-inner">
                  <div class="date-segment">
                    <span class="date-seg-label">Ida</span>
                    <span class="date-seg-value" :class="{ placeholder: !form.dataIda }">
                      {{ form.dataIda ? formatarData(form.dataIda) : 'Selecionar data' }}
                    </span>
                  </div>
                  <div class="date-divider"></div>
                  <div class="date-segment">
                    <span class="date-seg-label">Volta</span>
                    <span class="date-seg-value" :class="{ placeholder: !form.dataVolta }">
                      {{ form.dataVolta ? formatarData(form.dataVolta) : 'Selecionar data' }}
                    </span>
                  </div>
                </div>
                <div class="trigger-right">
                  <span v-if="duracaoCalculada" class="duration-pill">
                    {{ duracaoCalculada }} {{ duracaoCalculada === 1 ? 'dia' : 'dias' }}
                  </span>
                  <svg class="trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
              </div>

              <!-- Popup calendário -->
              <div v-if="calAberto" class="cal-popup">
                <div class="cal-header">
                  <button type="button" class="cal-nav" @click.stop="calMesAnterior">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="cal-titulo">{{ calTituloMeses }}</span>
                  <button type="button" class="cal-nav" @click.stop="calProximoMes">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>

                <div class="cal-meses-grid">
                  <div class="cal-mes" v-for="(mes, mi) in [calMes1, calMes2]" :key="mi">
                    <div class="cal-mes-nome">{{ mes.nome }}</div>
                    <div class="cal-semana">
                      <span v-for="(wd, wi) in ['D','S','T','Q','Q','S','S']" :key="wi" class="cal-wd">{{ wd }}</span>
                    </div>
                    <div class="cal-dias">
                      <div
                        v-for="(dia, di) in mes.dias"
                        :key="di"
                        class="cal-dia"
                        :class="calClasseDia(dia)"
                        @click.stop="dia && !calDiaPassado(dia) && calClicarDia(dia)"
                        @mouseenter="dia && !calDiaPassado(dia) ? calHover = dia : null"
                        @mouseleave="calHover = null"
                      >
                        <span v-if="dia">{{ dia.getDate() }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="cal-footer">
                  <div class="cal-footer-info">
                    <span class="cal-info-dot"></span>
                    <span v-if="!form.dataIda" class="cal-info-txt">Selecione a <b>data de ida</b></span>
                    <span v-else-if="!form.dataVolta" class="cal-info-txt">Agora selecione a <b>data de volta</b></span>
                    <span v-else class="cal-info-txt"><b>{{ duracaoCalculada }} {{ duracaoCalculada === 1 ? 'dia' : 'dias' }}</b> de viagem</span>
                  </div>
                  <div class="cal-acoes">
                    <button type="button" class="cal-btn-limpar" @click.stop="calLimpar">Limpar</button>
                    <button type="button" class="cal-btn-confirmar" :disabled="!form.dataIda || !form.dataVolta" @click.stop="calAberto = false">Confirmar</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="field">
              <label>Categoria</label>
              <div class="select-wrap">
                <select v-model="form.categoria">
                  <option value="nacional">Nacional</option>
                  <option value="internacional">Internacional</option>
                  <option value="praia">Praia</option>
                  <option value="montanha">Montanha</option>
                  <option value="cidade">Cidade</option>
                  <option value="aventura">Aventura</option>
                  <option value="romantico">Romântico</option>
                </select>
                <svg class="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <!-- Aeroporto -->
          <div class="field">
            <label>Aeroporto de origem</label>
            <div class="select-wrap">
              <select v-model="form.aeroporto">
                <option disabled value="">Selecione o aeroporto</option>
                <optgroup label="São Paulo">
                  <option>Guarulhos (GRU - SP)</option>
                  <option>Congonhas (CGH - SP)</option>
                </optgroup>
                <optgroup label="Rio de Janeiro">
                  <option>Galeão (GIG - RJ)</option>
                  <option>Santos Dumont (SDU - RJ)</option>
                </optgroup>
                <optgroup label="Brasil">
                  <option>Confins (CNF - BH)</option>
                  <option>Brasília (BSB)</option>
                  <option>Salvador (SSA)</option>
                  <option>Recife (REC)</option>
                  <option>Fortaleza (FOR)</option>
                  <option>Curitiba (CWB)</option>
                  <option>Porto Alegre (POA)</option>
                  <option>Manaus (MAO)</option>
                  <option>Belém (BEL)</option>
                  <option>Florianópolis (FLN)</option>
                </optgroup>
                <optgroup label="Internacional">
                  <option>Lisboa (LIS)</option>
                  <option>Paris (CDG)</option>
                  <option>Nova York (JFK)</option>
                  <option>Dubai (DXB)</option>
                  <option>Tóquio (HND)</option>
                </optgroup>
              </select>
              <svg class="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          <!-- Descrição -->
          <div class="field">
            <label>Descrição</label>
            <textarea v-model="form.descricao" placeholder="Descreva o destino, atrações, clima..."></textarea>
          </div>

          <!-- Toggle Switches -->
          <div class="form-row toggles-row">
            <label class="toggle-label">
              <input type="checkbox" v-model="form.hotelIncluso" />
              <span class="toggle-switch"></span>
              <span class="toggle-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Hotel incluso
              </span>
            </label>

            <label class="toggle-label">
              <input type="checkbox" v-model="form.cafeDaManhaIncluso" />
              <span class="toggle-switch"></span>
              <span class="toggle-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
                Café da manhã incluso
              </span>
            </label>
          </div>

          <!-- Itens Inclusos -->
          <div class="field">
            <label>Itens inclusos na viagem</label>
            <div class="tags-input">
              <div class="tags-list">
                <span v-for="(item, index) in form.itensInclusos" :key="index" class="tag">
                  {{ item }}
                  <button type="button" @click="removerItem(index)" class="tag-remove">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </span>
              </div>
              <input
                v-model="novoItem"
                @keydown.enter.prevent="adicionarItem"
                placeholder="Digite um item e pressione Enter (ex: Translado, Passeio guiado, Seguro viagem...)"
              />
            </div>
          </div>

          <!-- Imagem -->
          <div class="field">
            <label>Imagem do destino</label>
            <div class="file-upload" @click="$refs.fileInput.click()" :class="{ 'has-file': imagem }">
              <input ref="fileInput" type="file" @change="selecionarImagem" accept="image/*" />
              <div class="file-upload-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                <span v-if="!imagem">Clique para selecionar uma imagem</span>
                <span v-else class="file-name">{{ imagem.name }}</span>
              </div>
            </div>
          </div>

          <button class="btn-submit" @click="cadastrar" :disabled="loading">
            <span v-if="!loading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              Cadastrar Destino
            </span>
            <span v-else class="loading-text">
              <span class="spinner"></span>
              Cadastrando...
            </span>
          </button>
        </div>
      </section>

      <!-- GRID -->
      <section class="grid-section">
        <div class="section-title">
          <div class="section-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <h2>Destinos cadastrados <span class="count">{{ destinos.length }}</span></h2>
        </div>

        <div class="grid">
          <div
            class="card"
            v-for="(d, i) in destinos"
            :key="d._id"
            @click="abrirDetalhes(d)"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <div class="card-image-wrap">
              <img :src="`${$options.API_URL}${d.imagem}`" :alt="d.nome" />
              <div class="card-image-overlay"></div>

              <span v-if="d.categoria" class="card-category">{{ formatarCategoria(d.categoria) }}</span>

              <span v-if="d.dataIda && d.dataVolta" class="card-duration">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ calcularDias(d.dataIda, d.dataVolta) }} dias
              </span>

              <div class="card-actions">
                <button class="btn-card-action btn-card-edit" @click.stop="editarDestino(d._id)" title="Editar destino">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-card-action btn-card-delete" @click.stop="abrirModal(d._id)" title="Excluir destino">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6"/></svg>
                </button>
              </div>

              <span v-if="d.aeroporto" class="card-airport">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                {{ d.aeroporto.split('(')[0].trim() }}
              </span>
            </div>
            <div class="card-body">
              <h3>{{ d.nome }}</h3>
              <p class="card-desc">{{ d.descricao }}</p>

              <div class="card-badges" v-if="d.hotelIncluso || d.cafeDaManhaIncluso">
                <span v-if="d.hotelIncluso" class="badge badge-hotel">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Hotel
                </span>
                <span v-if="d.cafeDaManhaIncluso" class="badge badge-cafe">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
                  Café
                </span>
              </div>

              <div class="card-footer">
                <div class="preco">
                  <span class="preco-label">A partir de</span>
                  <span class="preco-value">R$ {{ Number(d.preco).toLocaleString('pt-BR') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="destinos.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          <p>Nenhum destino cadastrado ainda.</p>
        </div>
      </section>
    </div>

    <!-- MODAL EXCLUSÃO -->
    <Transition name="modal">
      <div v-if="mostrarModal" class="modal-overlay" @click.self="fecharModal">
        <div class="modal modal-confirm">
          <div class="modal-icon danger">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </div>
          <h2>Excluir destino?</h2>
          <p>Essa ação é permanente e não pode ser desfeita.</p>
          <div class="acoes">
            <button class="btn-cancelar" @click="fecharModal">Cancelar</button>
            <button class="btn-excluir" @click="confirmarExclusao">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL DETALHES -->
    <Transition name="modal">
      <div v-if="modalDetalhes" class="modal-overlay" @click.self="fecharDetalhes">
        <div class="modal modal-detalhes">
          <button class="modal-close" @click="fecharDetalhes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div class="modal-image-wrap">
            <img :src="`${$options.API_URL}${destinoSelecionado.imagem}`" :alt="destinoSelecionado.nome" />
            <div class="modal-image-gradient"></div>
            <div class="modal-image-title">
              <h2>{{ destinoSelecionado.nome }}</h2>
              <span v-if="destinoSelecionado.categoria" class="modal-category">{{ formatarCategoria(destinoSelecionado.categoria) }}</span>
            </div>
          </div>
          <div class="modal-body">
            <p class="modal-desc">{{ destinoSelecionado.descricao }}</p>

            <div v-if="destinoSelecionado.itensInclusos && destinoSelecionado.itensInclusos.length" class="modal-itens">
              <h4>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Itens inclusos
              </h4>
              <div class="itens-list">
                <span v-for="(item, idx) in destinoSelecionado.itensInclusos" :key="idx" class="item-tag">
                  {{ item }}
                </span>
              </div>
            </div>

            <div class="modal-info-row">
              <div class="modal-info-item">
                <span class="info-label">Valor</span>
                <span class="info-value green">R$ {{ Number(destinoSelecionado.preco).toLocaleString('pt-BR') }}</span>
              </div>
              <div class="modal-info-item" v-if="destinoSelecionado.aeroporto">
                <span class="info-label">Aeroporto</span>
                <span class="info-value">✈ {{ destinoSelecionado.aeroporto }}</span>
              </div>
              <div class="modal-info-item" v-if="destinoSelecionado.dataIda">
                <span class="info-label">Ida</span>
                <span class="info-value">{{ formatarData(destinoSelecionado.dataIda) }}</span>
              </div>
              <div class="modal-info-item" v-if="destinoSelecionado.dataVolta">
                <span class="info-label">Volta</span>
                <span class="info-value">{{ formatarData(destinoSelecionado.dataVolta) }}</span>
              </div>
              <div class="modal-info-item" v-if="destinoSelecionado.dataIda && destinoSelecionado.dataVolta">
                <span class="info-label">Duração</span>
                <span class="info-value">{{ calcularDias(destinoSelecionado.dataIda, destinoSelecionado.dataVolta) }} dias</span>
              </div>
            </div>

            <div class="modal-inclusos" v-if="destinoSelecionado.hotelIncluso || destinoSelecionado.cafeDaManhaIncluso">
              <span v-if="destinoSelecionado.hotelIncluso" class="incluso-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Hotel incluso
              </span>
              <span v-if="destinoSelecionado.cafeDaManhaIncluso" class="incluso-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
                Café da manhã incluso
              </span>
            </div>

            <div class="acoes">
              <button class="btn-cancelar" @click="fecharDetalhes">Fechar</button>
              <button class="btn-editar-modal" @click="editarDestino(destinoSelecionado._id); fecharDetalhes()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar Destino
              </button>
              <button class="btn-agendar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default {
  API_URL,
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutside = (e) => {
          if (!el.contains(e.target)) binding.value(e)
        }
        document.addEventListener('mousedown', el._clickOutside)
      },
      unmounted(el) {
        document.removeEventListener('mousedown', el._clickOutside)
      }
    }
  },

  data() {
    return {
      destinos: [],
      form: {
        nome: "",
        descricao: "",
        preco: "",
        aeroporto: "",
        hotelIncluso: false,
        cafeDaManhaIncluso: false,
        itensInclusos: [],
        dataIda: "",
        dataVolta: "",
        categoria: "nacional"
      },
      novoItem: "",
      imagem: null,
      loading: false,
      mostrarModal: false,
      idParaExcluir: null,
      modalDetalhes: false,
      destinoSelecionado: {},
      // Calendário
      calAberto: false,
      calAno: new Date().getFullYear(),
      calMesIdx: new Date().getMonth(),
      calHover: null
    }
  },

  computed: {
    hoje() {
      return new Date().toISOString().split('T')[0]
    },
    duracaoCalculada() {
      if (!this.form.dataIda || !this.form.dataVolta) return null
      const dias = this.calcularDias(this.form.dataIda, this.form.dataVolta)
      return dias > 0 ? dias : null
    },
    calTituloMeses() {
      const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
      const m2 = new Date(this.calAno, this.calMesIdx + 1, 1)
      return `${meses[this.calMesIdx]} ${this.calAno}  –  ${meses[m2.getMonth()]} ${m2.getFullYear()}`
    },
    calMes1() {
      return this.calGerarMes(this.calAno, this.calMesIdx)
    },
    calMes2() {
      const d = new Date(this.calAno, this.calMesIdx + 1, 1)
      return this.calGerarMes(d.getFullYear(), d.getMonth())
    }
  },

  methods: {
    calcularDias(dataIda, dataVolta) {
      const ida = new Date(dataIda)
      const volta = new Date(dataVolta)
      const diff = (volta - ida) / (1000 * 60 * 60 * 24)
      return Math.round(diff)
    },

    formatarData(data) {
      if (!data) return '—'
      const [y, m, d] = data.split('-')
      return `${d}/${m}/${y}`
    },

    async carregar() {
      this.destinos = await api.get("/destinos").then(r => r.data)
    },

    selecionarImagem(e) {
      this.imagem = e.target.files[0]
    },

    adicionarItem() {
      const item = this.novoItem.trim()
      if (item && !this.form.itensInclusos.includes(item)) {
        this.form.itensInclusos.push(item)
      }
      this.novoItem = ""
    },

    removerItem(index) {
      this.form.itensInclusos.splice(index, 1)
    },

    formatarCategoria(cat) {
      const map = {
        nacional: "Nacional",
        internacional: "Internacional",
        praia: "Praia",
        montanha: "Montanha",
        cidade: "Cidade",
        aventura: "Aventura",
        romantico: "Romântico"
      }
      return map[cat] || cat
    },

    async cadastrar() {
      if (!this.form.nome || !this.form.preco || !this.form.aeroporto) {
        alert("Preencha todos os campos obrigatórios 😅")
        return
      }
      if (!this.imagem) {
        alert("Escolha uma imagem")
        return
      }

      this.loading = true

      try {
        const formData = new FormData()
        formData.append("nome", this.form.nome)
        formData.append("descricao", this.form.descricao)
        formData.append("preco", this.form.preco)
        formData.append("aeroporto", this.form.aeroporto)
        formData.append("hotelIncluso", this.form.hotelIncluso)
        formData.append("cafeDaManhaIncluso", this.form.cafeDaManhaIncluso)
        formData.append("dataIda", this.form.dataIda)
        formData.append("dataVolta", this.form.dataVolta)
        formData.append("categoria", this.form.categoria)
        formData.append("itensInclusos", JSON.stringify(this.form.itensInclusos))
        formData.append("imagem", this.imagem)

        await api.post("/destinos", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })

        alert("Destino cadastrado 🚀")

        this.form = {
          nome: "",
          descricao: "",
          preco: "",
          aeroporto: "",
          hotelIncluso: false,
          cafeDaManhaIncluso: false,
          itensInclusos: [],
          dataIda: "",
          dataVolta: "",
          categoria: "nacional"
        }
        this.imagem = null
        this.carregar()
      } catch (e) {
        alert("Erro ao cadastrar 😭")
      }

      this.loading = false
    },

    editarDestino(id) {
      this.$router.push(`/destinos/editar/${id}`)
    },

    abrirModal(id) {
      this.idParaExcluir = id
      this.mostrarModal = true
    },

    fecharModal() {
      this.mostrarModal = false
      this.idParaExcluir = null
    },

    async confirmarExclusao() {
      await api.delete(`/destinos/${this.idParaExcluir}`)
      this.fecharModal()
      this.carregar()
    },

    abrirDetalhes(destino) {
      this.destinoSelecionado = destino
      this.modalDetalhes = true
      document.body.style.overflow = 'hidden'
    },

    fecharDetalhes() {
      this.modalDetalhes = false
      this.destinoSelecionado = {}
      document.body.style.overflow = ''
    },

    // ── CALENDÁRIO ──────────────────────────────────────
    calGerarMes(ano, mes) {
      const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
      const primeiro = new Date(ano, mes, 1).getDay()
      const total = new Date(ano, mes + 1, 0).getDate()
      const dias = []
      for (let i = 0; i < primeiro; i++) dias.push(null)
      for (let d = 1; d <= total; d++) dias.push(new Date(ano, mes, d))
      return { nome: `${meses[mes]} ${ano}`, dias }
    },

    calDiaPassado(d) {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      return d < hoje
    },

    calChave(d) {
      return d ? d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate() : null
    },

    calClicarDia(d) {
      if (!this.form.dataIda || (this.form.dataIda && this.form.dataVolta)) {
        this.form.dataIda = d.toISOString().split('T')[0]
        this.form.dataVolta = ''
      } else {
        const ida = new Date(this.form.dataIda + 'T00:00:00')
        if (d < ida) {
          this.form.dataVolta = this.form.dataIda
          this.form.dataIda = d.toISOString().split('T')[0]
        } else if (this.calChave(d) === this.calChave(ida)) {
          this.form.dataIda = ''
        } else {
          this.form.dataVolta = d.toISOString().split('T')[0]
        }
      }
    },

    calLimpar() {
      this.form.dataIda = ''
      this.form.dataVolta = ''
    },

    calMesAnterior() {
      const d = new Date(this.calAno, this.calMesIdx - 1, 1)
      this.calAno = d.getFullYear()
      this.calMesIdx = d.getMonth()
    },

    calProximoMes() {
      const d = new Date(this.calAno, this.calMesIdx + 1, 1)
      this.calAno = d.getFullYear()
      this.calMesIdx = d.getMonth()
    },

    calClasseDia(dia) {
      if (!dia) return ['vazio']
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const cls = []

      if (dia < hoje) {
        cls.push('passado')
        return cls
      }

      if (this.calChave(dia) === this.calChave(hoje)) cls.push('hoje')

      const start = this.form.dataIda ? new Date(this.form.dataIda + 'T00:00:00') : null
      const effEnd = (!this.form.dataVolta && this.calHover && start && this.calHover > start)
        ? this.calHover
        : (this.form.dataVolta ? new Date(this.form.dataVolta + 'T00:00:00') : null)

      const isStart = start && this.calChave(dia) === this.calChave(start)
      const isEnd = effEnd && this.calChave(dia) === this.calChave(effEnd)
      const inRange = start && effEnd && dia > start && dia < effEnd

      if (isStart) cls.push('inicio')
      if (isEnd && !isStart) cls.push('fim')
      if (inRange) cls.push('no-range')

      return cls
    }
  },

  mounted() {
    this.carregar()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; }

.admin {
  font-family: 'DM Sans', sans-serif;
  background: #080e1a;
  min-height: 100vh;
  color: #e2e8f0;
}

/* ─── HEADER ────────────────────────────────────────── */
.admin-header {
  position: relative;
  padding: 70px 48px 60px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}
.orb-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #1d4ed8, transparent 70%);
  top: -160px; left: -80px;
}
.orb-2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #0ea5e9, transparent 70%);
  top: -80px; right: -60px;
}
.grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.04;
}

.header-content { position: relative; z-index: 1; }

.label {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.2);
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 20px;
}

.admin-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  margin: 0 0 12px;
  color: #f1f5f9;
  line-height: 1.15;
}

.admin-header h1 em {
  font-style: italic;
  background: linear-gradient(135deg, #38bdf8, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 300;
  margin: 0;
}

/* ─── BODY ──────────────────────────────────────────── */
.admin-body {
  padding: 0 48px 80px;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* ─── SECTION TITLE ─────────────────────────────────── */
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.section-icon {
  width: 36px; height: 36px;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.15);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: #38bdf8;
  flex-shrink: 0;
}
.section-title h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  margin: 0;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
}
.count {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(56,189,248,0.1);
  border: 1px solid rgba(56,189,248,0.2);
  color: #38bdf8;
  padding: 2px 10px;
  border-radius: 100px;
}

/* ─── FORM ──────────────────────────────────────────── */
.form-section {
  background: #0d1b30;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px;
  padding: 32px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  position: relative;
}

.field label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 5px;
}

input, textarea {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 12px 16px;
  color: #e2e8f0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
}

input:focus, textarea:focus {
  border-color: rgba(56,189,248,0.4);
  background: rgba(56,189,248,0.03);
}

input::placeholder, textarea::placeholder {
  color: #334155;
}

textarea {
  resize: vertical;
  min-height: 90px;
}

/* Select */
.select-wrap {
  position: relative;
}
.select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 12px 40px 12px 16px;
  color: #e2e8f0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  width: 100%;
  cursor: pointer;
  transition: border-color 0.2s;
}
.select-wrap select:focus {
  border-color: rgba(56,189,248,0.4);
}
.select-wrap select option, .select-wrap select optgroup {
  background: #0d1b30;
  color: #e2e8f0;
}
.select-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
  pointer-events: none;
}

/* Toggle Switches */
.toggles-row {
  display: flex;
  gap: 24px;
  padding: 8px 0;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.toggle-label input {
  display: none;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
  border: 1px solid rgba(255,255,255,0.1);
  flex-shrink: 0;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #94a3b8;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s, background 0.3s;
}

.toggle-label input:checked + .toggle-switch {
  background: rgba(52,211,153,0.2);
  border-color: rgba(52,211,153,0.3);
}

.toggle-label input:checked + .toggle-switch::after {
  transform: translateX(20px);
  background: #34d399;
}

.toggle-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
}

.toggle-label input:checked ~ .toggle-text {
  color: #e2e8f0;
}

/* Tags Input */
.tags-input {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 10px 12px;
  transition: border-color 0.2s;
}

.tags-input:focus-within {
  border-color: rgba(56,189,248,0.4);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(56,189,248,0.12);
  border: 1px solid rgba(56,189,248,0.2);
  color: #38bdf8;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 8px;
}

.tag-remove {
  background: none;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.tag-remove:hover {
  opacity: 1;
}

.tags-input input {
  background: transparent;
  border: none;
  padding: 6px 4px;
  width: 100%;
}

.tags-input input:focus {
  box-shadow: none;
  background: transparent;
}

/* File upload */
.file-upload {
  background: rgba(255,255,255,0.02);
  border: 1.5px dashed rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  text-align: center;
}
.file-upload:hover {
  border-color: rgba(56,189,248,0.3);
  background: rgba(56,189,248,0.03);
}
.file-upload.has-file {
  border-color: rgba(52,211,153,0.3);
  background: rgba(52,211,153,0.03);
}
.file-upload input[type="file"] {
  display: none;
}
.file-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 13px;
}
.file-upload.has-file .file-upload-content { color: #34d399; }
.file-name { font-weight: 500; }

/* ─── DATE TRIGGER ──────────────────────────────────── */
.form-row-dates {
  grid-template-columns: 1.6fr 1fr;
}

.date-trigger {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 14px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.2s, background 0.2s;
  user-select: none;
}
.date-trigger:hover,
.date-trigger.active {
  border-color: rgba(56,189,248,0.35);
  background: rgba(56,189,248,0.04);
}
.date-trigger-inner { display: flex; align-items: center; flex: 1; }
.date-segment { display: flex; flex-direction: column; flex: 1; }
.date-seg-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #475569;
  margin-bottom: 3px;
}
.date-seg-value { font-size: 14px; font-weight: 500; color: #e2e8f0; }
.date-seg-value.placeholder { color: #334155; font-weight: 400; }
.date-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.07);
  margin: 0 18px;
  flex-shrink: 0;
}
.trigger-right { display: flex; align-items: center; gap: 10px; }
.duration-pill {
  font-size: 11px;
  font-weight: 600;
  color: #38bdf8;
  background: rgba(56,189,248,0.1);
  border: 1px solid rgba(56,189,248,0.2);
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.trigger-icon { color: #475569; transition: color 0.2s; }
.date-trigger:hover .trigger-icon,
.date-trigger.active .trigger-icon { color: #38bdf8; }

/* ─── POPUP ─────────────────────────────────────────── */
.cal-popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #0d1b30;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6);
  animation: calPopIn 0.2s cubic-bezier(.22,.68,0,1.2);
  z-index: 200;
  min-width: 560px;
}
@keyframes calPopIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.cal-nav {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: #64748b;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.cal-nav:hover {
  background: rgba(56,189,248,0.1);
  border-color: rgba(56,189,248,0.25);
  color: #38bdf8;
}
.cal-titulo { font-size: 13px; font-weight: 600; color: #e2e8f0; }

.cal-meses-grid { display: grid; grid-template-columns: 1fr 1fr; }
.cal-mes { padding: 16px 18px 20px; }
.cal-mes + .cal-mes { border-left: 1px solid rgba(255,255,255,0.05); }
.cal-mes-nome {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  text-align: center;
}
.cal-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 6px;
}
.cal-wd {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: #334155;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 4px 0;
}
.cal-dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.cal-dia {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.12s;
  position: relative;
}
.cal-dia:not(.vazio):not(.passado):not(.inicio):not(.fim):hover {
  background: rgba(255,255,255,0.07);
  color: #e2e8f0;
}
.cal-dia.vazio { cursor: default; }
.cal-dia.passado { color: #1e293b; cursor: not-allowed; }
.cal-dia.hoje { color: #38bdf8; font-weight: 700; }
.cal-dia.hoje::after {
  content: '';
  position: absolute;
  bottom: 3px; left: 50%;
  transform: translateX(-50%);
  width: 3px; height: 3px;
  border-radius: 50%;
  background: #38bdf8;
}
.cal-dia.no-range {
  background: rgba(56,189,248,0.08);
  color: #7dd3fc;
  border-radius: 0;
}
.cal-dia.inicio {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(14,165,233,0.35);
  border-radius: 8px 0 0 8px;
}
.cal-dia.fim {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(14,165,233,0.35);
  border-radius: 0 8px 8px 0;
}

.cal-footer {
  padding: 14px 20px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.cal-footer-info { display: flex; align-items: center; gap: 8px; }
.cal-info-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  flex-shrink: 0;
}
.cal-info-txt { font-size: 12px; color: #475569; }
.cal-info-txt b { color: #38bdf8; font-weight: 600; }
.cal-acoes { display: flex; gap: 8px; }
.cal-btn-limpar {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.08);
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.15s;
}
.cal-btn-limpar:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
.cal-btn-confirmar {
  padding: 7px 18px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  color: #fff;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: opacity 0.15s, transform 0.15s;
  box-shadow: 0 4px 14px rgba(14,165,233,0.25);
}
.cal-btn-confirmar:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.cal-btn-confirmar:disabled { opacity: 0.35; cursor: not-allowed; }

/* Submit button */
.btn-submit {
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 6px 20px rgba(14,165,233,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-submit span {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 10px;
}
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── GRID ──────────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
}

/* ─── CARD ──────────────────────────────────────────── */
.card {
  background: #0d1b30;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(.22,.68,0,1.2),
              box-shadow 0.3s ease,
              border-color 0.3s ease;
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.12);
  border-color: rgba(56,189,248,0.15);
}

.card-image-wrap {
  position: relative;
  height: 185px;
  overflow: hidden;
}
.card-image-wrap img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.card:hover .card-image-wrap img { transform: scale(1.06); }
.card-image-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(8,14,26,0.75));
}

.card-category {
  position: absolute;
  top: 10px; left: 10px;
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 1px;
  color: #f1f5f9;
  background: rgba(99,102,241,0.6);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 4px 10px;
  border-radius: 100px;
}

.card-duration {
  position: absolute;
  top: 10px; right: 10px;
  font-size: 11px; font-weight: 500;
  color: #f1f5f9;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 100px;
  display: flex; align-items: center; gap: 5px;
}

.card-actions {
  position: absolute;
  bottom: 10px; right: 10px;
  display: flex; gap: 6px;
  z-index: 5;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.card:hover .card-actions { opacity: 1; transform: translateY(0); }

.btn-card-action {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  color: #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-card-action:hover { transform: scale(1.1); }
.btn-card-edit:hover {
  background: rgba(56,189,248,0.25);
  border-color: rgba(56,189,248,0.4);
  color: #38bdf8;
}
.btn-card-delete:hover {
  background: rgba(239,68,68,0.25);
  border-color: rgba(239,68,68,0.4);
  color: #f87171;
}

.card-airport {
  position: absolute;
  bottom: 10px; left: 12px;
  font-size: 11px; font-weight: 500;
  color: #bae6fd;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 100px;
  display: flex; align-items: center; gap: 5px;
}

.card-body { padding: 16px 18px 18px; }
.card-body h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  margin: 0 0 6px;
  color: #f1f5f9;
}
.card-desc {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-badges {
  display: flex; gap: 8px;
  margin-bottom: 12px; flex-wrap: wrap;
}
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600;
  padding: 4px 10px; border-radius: 100px;
}
.badge-hotel {
  background: rgba(99,102,241,0.12);
  border: 1px solid rgba(99,102,241,0.2);
  color: #818cf8;
}
.badge-cafe {
  background: rgba(245,158,11,0.12);
  border: 1px solid rgba(245,158,11,0.2);
  color: #fbbf24;
}

.card-footer { display: flex; align-items: center; justify-content: space-between; }
.preco { display: flex; flex-direction: column; }
.preco-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #475569; font-weight: 500; }
.preco-value { font-size: 1rem; font-weight: 700; color: #34d399; }

.empty-state { text-align: center; padding: 60px; color: #334155; }
.empty-state svg { margin-bottom: 16px; display: block; margin-inline: auto; }
.empty-state p { font-size: 0.95rem; }

/* ─── MODAL OVERLAY ─────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(5,9,20,0.85);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
  padding: 20px;
}

.modal {
  background: #0d1b30;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  width: 100%; max-width: 480px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
}

.modal-confirm { padding: 36px; text-align: center; }
.modal-icon {
  width: 60px; height: 60px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.modal-icon.danger {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #f87171;
}
.modal-confirm h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem; margin: 0 0 8px; color: #f1f5f9;
}
.modal-confirm p { font-size: 14px; color: #64748b; margin: 0 0 28px; }

.modal-close {
  position: absolute; top: 14px; right: 14px; z-index: 10;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s;
}
.modal-close:hover { background: rgba(255,255,255,0.1); }

.modal-image-wrap { position: relative; height: 230px; overflow: hidden; }
.modal-image-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
.modal-image-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 30%, #0d1b30); }
.modal-image-title { position: absolute; bottom: 16px; left: 24px; right: 24px; display: flex; flex-direction: column; gap: 6px; }
.modal-image-title h2 { font-family: 'Playfair Display', serif; font-size: 1.6rem; margin: 0; color: #f1f5f9; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }

.modal-category {
  display: inline-block;
  font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;
  color: #f1f5f9; background: rgba(99,102,241,0.7);
  padding: 4px 12px; border-radius: 100px; width: fit-content;
}

.modal-body { padding: 24px; }
.modal-desc { font-size: 0.88rem; color: #94a3b8; line-height: 1.7; margin: 0 0 20px; }

.modal-itens { margin-bottom: 20px; }
.modal-itens h4 {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600; color: #e2e8f0;
  margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px;
}
.itens-list { display: flex; flex-wrap: wrap; gap: 8px; }
.item-tag {
  background: rgba(56,189,248,0.1);
  border: 1px solid rgba(56,189,248,0.2);
  color: #38bdf8; font-size: 12px; font-weight: 500;
  padding: 6px 12px; border-radius: 8px;
}

.modal-info-row { display: flex; gap: 12px; margin-bottom: 20px; }
.modal-info-item {
  flex: 1;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px; padding: 14px;
  display: flex; flex-direction: column; gap: 4px;
}
.info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #475569; font-weight: 600; }
.info-value { font-size: 0.88rem; font-weight: 600; color: #e2e8f0; }
.info-value.green { color: #34d399; font-size: 1.1rem; }

.modal-inclusos { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
.incluso-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 500; padding: 8px 14px; border-radius: 10px;
}
.incluso-tag:nth-child(1) { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #818cf8; }
.incluso-tag:nth-child(2) { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); color: #fbbf24; }

.acoes { display: flex; gap: 12px; }
.btn-cancelar {
  flex: 1; padding: 13px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #94a3b8;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-cancelar:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
.btn-excluir {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 13px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #dc2626, #ef4444); color: white;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 6px 20px rgba(239,68,68,0.25);
}
.btn-excluir:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-agendar {
  flex: 2; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #0ea5e9, #10b981); color: white;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 6px 20px rgba(14,165,233,0.2);
}
.btn-agendar:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-editar-modal {
  flex: 2; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 6px 20px rgba(99,102,241,0.25);
}
.btn-editar-modal:hover { opacity: 0.9; transform: translateY(-1px); }

/* ─── MODAL TRANSITION ──────────────────────────────── */
.modal-enter-active { animation: modalIn 0.3s cubic-bezier(.22,.68,0,1.2); }
.modal-leave-active { animation: modalOut 0.2s ease; }
@keyframes modalIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes modalOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }

/* ─── RESPONSIVE ────────────────────────────────────── */
@media (max-width: 700px) {
  .admin-header { padding: 50px 20px 40px; }
  .admin-body { padding: 0 16px 60px; }
  .form-row { grid-template-columns: 1fr; }
  .form-row-dates { grid-template-columns: 1fr; }
  .toggles-row { flex-direction: column; gap: 12px; }
  .grid { grid-template-columns: 1fr; }
  .card-actions { opacity: 1; transform: translateY(0); }
  .cal-popup { min-width: unset; }
  .cal-meses-grid { grid-template-columns: 1fr; }
  .cal-mes + .cal-mes { border-left: none; border-top: 1px solid rgba(255,255,255,0.05); }
}
</style>