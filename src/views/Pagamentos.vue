<template>
  <div class="pagamento-container">

    <!-- BG EFFECTS -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-grain"></div>

    <div class="page-inner">

      <!-- ─── TOPO ─────────────────────────────────── -->
      <div class="page-top">
        <router-link to="/viagens" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Voltar
        </router-link>
        <div class="steps">
          <div class="step done">
            <span class="step-dot">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span>Destino</span>
          </div>
          <div class="step-line done"></div>
          <div class="step done">
            <span class="step-dot">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span>Dados</span>
          </div>
          <div class="step-line done"></div>
          <div class="step active">
            <span class="step-dot">3</span>
            <span>Pagamento</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-dot">4</span>
            <span>Confirmação</span>
          </div>
        </div>
      </div>

      <!-- ─── GRID PRINCIPAL ────────────────────────── -->
      <div class="main-grid">

        <!-- ══ COLUNA ESQUERDA — FORMULÁRIO ══ -->
        <div class="form-col">

          <!-- Método de pagamento -->
          <div class="card" style="animation-delay: 0ms">
            <div class="card-header">
              <div class="card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
              <h2>Forma de pagamento</h2>
            </div>

            <div class="metodos">
              <button
                v-for="m in metodos"
                :key="m.id"
                class="metodo-btn"
                :class="{ ativo: metodoPagamento === m.id }"
                @click="metodoPagamento = m.id"
              >
                <span class="metodo-icon" v-html="m.icon"></span>
                <span>{{ m.label }}</span>
              </button>
            </div>

            <!-- CARTÃO -->
            <div v-if="metodoPagamento === 'cartao'" class="metodo-content">
              <div class="card-visual" :class="{ flipped: showBack }">
                <div class="card-visual-front">
                  <div class="card-chip">
                    <svg width="28" height="22" viewBox="0 0 28 22"><rect width="28" height="22" rx="4" fill="rgba(255,255,255,0.15)"/><line x1="9" y1="0" x2="9" y2="22" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><line x1="19" y1="0" x2="19" y2="22" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><line x1="0" y1="8" x2="28" y2="8" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><line x1="0" y1="14" x2="28" y2="14" stroke="rgba(255,255,255,0.2)" stroke-width="1"/></svg>
                  </div>
                  <div class="card-number-display">
                    {{ cartao.numero ? formatarNumeroCartao(cartao.numero) : '•••• •••• •••• ••••' }}
                  </div>
                  <div class="card-bottom">
                    <div>
                      <p class="card-label-sm">Titular</p>
                      <p class="card-value">{{ cartao.nome || 'SEU NOME' }}</p>
                    </div>
                    <div>
                      <p class="card-label-sm">Validade</p>
                      <p class="card-value">{{ cartao.validade || 'MM/AA' }}</p>
                    </div>
                    <div class="card-brand">
                      <svg width="42" height="28" viewBox="0 0 42 28">
                        <circle cx="16" cy="14" r="13" fill="#eb001b" opacity="0.9"/>
                        <circle cx="26" cy="14" r="13" fill="#f79e1b" opacity="0.9"/>
                        <path d="M21 5.6a13 13 0 010 16.8A13 13 0 0121 5.6z" fill="#ff5f00"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="card-visual-back">
                  <div class="card-strip"></div>
                  <div class="card-cvv-row">
                    <span class="card-label-sm">CVV</span>
                    <div class="cvv-box">{{ cartao.cvv || '•••' }}</div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Número do cartão</label>
                <div class="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <input v-model="cartao.numero" type="text" placeholder="1234 5678 9012 3456" maxlength="19" @input="mascararNumero" />
                </div>
              </div>

              <div class="form-group">
                <label>Nome no cartão</label>
                <div class="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="cartao.nome" type="text" placeholder="NOME SOBRENOME" @input="cartao.nome = cartao.nome.toUpperCase()" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Validade</label>
                  <div class="input-wrap">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <input v-model="cartao.validade" type="text" placeholder="MM/AA" maxlength="5" @input="mascararValidade" />
                  </div>
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <div class="input-wrap">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <input v-model="cartao.cvv" type="text" placeholder="•••" maxlength="3" @focus="showBack = true" @blur="showBack = false" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Parcelamento</label>
                <div class="input-wrap select-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                  <select v-model="parcelas">
                    <option v-for="p in parcelasOpcoes" :key="p.value" :value="p.value">{{ p.label }}</option>
                  </select>
                  <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <!-- PIX -->
            <div v-if="metodoPagamento === 'pix'" class="metodo-content pix-content">
              <div class="pix-box">
                <div class="pix-qr">
                  <svg viewBox="0 0 100 100" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" rx="8" fill="#0d1b30"/>
                    <g fill="#38bdf8">
                      <rect x="8" y="8" width="26" height="26" rx="3"/><rect x="12" y="12" width="18" height="18" rx="2" fill="#0d1b30"/><rect x="16" y="16" width="10" height="10" rx="1"/>
                      <rect x="66" y="8" width="26" height="26" rx="3"/><rect x="70" y="12" width="18" height="18" rx="2" fill="#0d1b30"/><rect x="74" y="16" width="10" height="10" rx="1"/>
                      <rect x="8" y="66" width="26" height="26" rx="3"/><rect x="12" y="70" width="18" height="18" rx="2" fill="#0d1b30"/><rect x="16" y="74" width="10" height="10" rx="1"/>
                      <rect x="42" y="8" width="6" height="6"/><rect x="50" y="8" width="6" height="6"/><rect x="42" y="16" width="6" height="6"/><rect x="50" y="24" width="6" height="6"/>
                      <rect x="42" y="42" width="6" height="6"/><rect x="50" y="42" width="6" height="6"/><rect x="58" y="42" width="6" height="6"/>
                      <rect x="42" y="50" width="6" height="6"/><rect x="58" y="50" width="6" height="6"/>
                      <rect x="42" y="58" width="6" height="6"/><rect x="50" y="58" width="6" height="6"/><rect x="58" y="58" width="6" height="6"/>
                      <rect x="66" y="42" width="6" height="6"/><rect x="74" y="42" width="6" height="6"/><rect x="82" y="42" width="6" height="6"/>
                      <rect x="66" y="50" width="6" height="6"/><rect x="82" y="50" width="6" height="6"/>
                      <rect x="66" y="58" width="6" height="6"/><rect x="74" y="58" width="6" height="6"/>
                      <rect x="8" y="42" width="6" height="6"/><rect x="16" y="42" width="6" height="6"/><rect x="24" y="42" width="6" height="6"/>
                      <rect x="8" y="50" width="6" height="6"/><rect x="24" y="50" width="6" height="6"/>
                      <rect x="8" y="58" width="6" height="6"/><rect x="16" y="58" width="6" height="6"/>
                      <rect x="66" y="66" width="6" height="6"/><rect x="74" y="74" width="6" height="6"/><rect x="82" y="66" width="6" height="6"/><rect x="82" y="82" width="6" height="6"/><rect x="66" y="82" width="6" height="6"/>
                    </g>
                  </svg>
                </div>
                <p class="pix-label">Escaneie o QR Code</p>
                <p class="pix-sub">O pagamento é confirmado em até <strong>30 segundos</strong></p>
                <div class="pix-key-row">
                  <span class="pix-key">viaplan@pagamento.com.br</span>
                  <button class="btn-copy" @click="copiarChave">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    {{ copiado ? 'Copiado!' : 'Copiar' }}
                  </button>
                </div>
                <div class="pix-timer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  QR Code expira em <strong>{{ timerStr }}</strong>
                </div>
              </div>
            </div>

            <!-- BOLETO -->
            <div v-if="metodoPagamento === 'boleto'" class="metodo-content boleto-content">
              <div class="boleto-box">
                <div class="boleto-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
                </div>
                <h3>Boleto Bancário</h3>
                <p>Válido por <strong>3 dias úteis</strong>. Após o pagamento, a confirmação pode levar até <strong>2 dias úteis</strong>.</p>
                <div class="boleto-codigo"><span>1234.5678 9012.3456 7890.1234 5 67890000012345</span></div>
                <button class="btn-boleto">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Gerar e baixar boleto
                </button>
              </div>
            </div>
          </div>

          <!-- Dados pessoais — pré-preenchidos -->
          <div class="card" style="animation-delay: 80ms">
            <div class="card-header">
              <div class="card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h2>Dados do viajante</h2>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Nome</label>
                <div class="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="viajante.nome" type="text" placeholder="Seu nome" />
                </div>
              </div>
              <div class="form-group">
                <label>Sobrenome</label>
                <div class="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="viajante.sobrenome" type="text" placeholder="Seu sobrenome" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>E-mail</label>
              <div class="input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input v-model="viajante.email" type="email" placeholder="seu@email.com" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>CPF</label>
                <div class="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <input v-model="viajante.cpf" type="text" placeholder="000.000.000-00" maxlength="14" @input="mascararCpf" />
                </div>
              </div>
              <div class="form-group">
                <label>Telefone</label>
                <div class="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.18a16 16 0 006.29 6.29l1.5-1.5a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  <input v-model="viajante.telefone" type="text" placeholder="(00) 00000-0000" maxlength="15" @input="mascararTelefone" />
                </div>
              </div>
            </div>
          </div>

          <!-- Segurança -->
          <div class="seguranca-row">
            <div class="seg-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              SSL 256-bit
            </div>
            <div class="seg-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              PCI DSS
            </div>
            <div class="seg-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              3D Secure
            </div>
          </div>
        </div>

        <!-- ══ COLUNA DIREITA — RESUMO ══ -->
        <div class="summary-col">
          <div class="summary-card">
            <div class="summary-header">
              <span class="section-tag">Resumo</span>
              <h3>Sua viagem</h3>
            </div>

            <div class="destino-preview">
              <div class="destino-img-wrap">
                <div class="destino-img-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                </div>
                <div class="destino-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  Internacional
                </div>
              </div>
              <div class="destino-info">
                <h4>{{ destino.nome || '—' }}</h4>
                <p class="destino-aeroporto">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                  {{ passageiros }} {{ passageiros === 1 ? 'passageiro' : 'passageiros' }}
                </p>
                <div class="destino-tags">
                  <span class="tag">✈ Voo incluso</span>
                  <span class="tag">🏨 Hotel</span>
                </div>
              </div>
            </div>

            <div class="summary-divider"></div>

            <!-- Datas vindas do formulário -->
            <div class="info-row">
              <div class="info-item">
                <p class="info-label">Ida</p>
                <p class="info-value">{{ dataIdaFormatada }}</p>
              </div>
              <div class="info-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <div class="info-item" style="text-align:right">
                <p class="info-label">Volta</p>
                <p class="info-value">{{ dataVoltaFormatada }}</p>
              </div>
            </div>

            <div class="info-row" style="margin-top:10px">
              <div class="info-item">
                <p class="info-label">Passageiros</p>
                <p class="info-value">{{ passageiros }} {{ passageiros === 1 ? 'adulto' : 'adultos' }}</p>
              </div>
              <div class="info-item" style="text-align:right">
                <p class="info-label">Duração</p>
                <p class="info-value">{{ duracaoNoites }} {{ duracaoNoites === 1 ? 'noite' : 'noites' }}</p>
              </div>
            </div>

            <div class="summary-divider"></div>

            <!-- Valores -->
            <div class="valores">
              <div class="valor-row">
                <span>Passagens ({{ passageiros }}x)</span>
                <span>R$ {{ valorPassagens }}</span>
              </div>
              <div class="valor-row">
                <span>Hospedagem ({{ duracaoNoites }} noites)</span>
                <span>R$ {{ valorHospedagem }}</span>
              </div>
              <div class="valor-row">
                <span>Taxas e serviços</span>
                <span>R$ {{ valorTaxas }}</span>
              </div>
              <div class="valor-row desconto" v-if="cupomAplicado">
                <span>Desconto ({{ cupomAplicado }})</span>
                <span>- R$ {{ valorDesconto }}</span>
              </div>
            </div>

            <!-- Cupom -->
            <div class="cupom-row">
              <div class="input-wrap cupom-input">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <input v-model="cupom" type="text" placeholder="Código de desconto" />
              </div>
              <button class="btn-cupom" @click="aplicarCupom">Aplicar</button>
            </div>

            <div class="summary-divider"></div>

            <!-- Total -->
            <div class="total-row">
              <div>
                <p class="total-label">Total</p>
                <p class="total-sub" v-if="metodoPagamento === 'cartao'">{{ parcelas }}x de R$ {{ valorParcela }}</p>
                <p class="total-sub" v-else>à vista</p>
              </div>
              <p class="total-valor">R$ {{ totalFormatado }}</p>
            </div>

            <!-- Botão pagar -->
            <button class="btn-pagar" @click="pagar" :class="{ loading: pagando }">
              <span v-if="!pagando">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Confirmar pagamento
              </span>
              <span v-else class="spinner"></span>
            </button>

            <p class="fine-print">
              Ao confirmar, você concorda com os
              <a href="#">Termos de uso</a> e a
              <a href="#">Política de privacidade</a> da ViaPlan.
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL SUCESSO -->
    <div class="modal-overlay" v-if="sucesso" @click.self="sucesso = false">
      <div class="modal-sucesso">
        <div class="modal-check">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3>Pagamento confirmado!</h3>
        <p>
          Seu pedido <strong>#VP-{{ codigoPedido }}</strong> foi registrado com sucesso.<br>
          A confirmação foi enviada para <strong>{{ viajante.email || 'seu e-mail' }}</strong>.
        </p>
        <div class="modal-resumo">
          <div class="modal-resumo-row">
            <span>Destino</span>
            <strong>{{ destino.nome }}</strong>
          </div>
          <div class="modal-resumo-row">
            <span>Ida</span>
            <strong>{{ dataIdaFormatada }}</strong>
          </div>
          <div class="modal-resumo-row">
            <span>Volta</span>
            <strong>{{ dataVoltaFormatada }}</strong>
          </div>
          <div class="modal-resumo-row">
            <span>Passageiros</span>
            <strong>{{ passageiros }}</strong>
          </div>
          <div class="modal-resumo-row total">
            <span>Total pago</span>
            <strong>R$ {{ totalFormatado }}</strong>
          </div>
        </div>
        <router-link to="/" class="btn-modal">Voltar ao início</router-link>
      </div>
    </div>

  </div>
</template>

<script>
import api from "@/services/api"

export default {
  name: 'Pagamento',

  data() {
    return {
      id: "",

      metodoPagamento: 'cartao',
      showBack: false,
      pagando: false,
      sucesso: false,
      copiado: false,
      cupomAplicado: null,
      cupom: '',
      parcelas: 1,
      timerSegundos: 600,
      timerInterval: null,
      codigoPedido: null,

      passageiros: 1,
      precoPorPessoa: 0,

      cartao: { numero: '', nome: '', validade: '', cvv: '' },

      viajante: { nome: '', sobrenome: '', email: '', cpf: '', telefone: '' },

      destino: { nome: '' },

      metodos: [
        { id: 'cartao', label: 'Cartão' },
        { id: 'pix', label: 'Pix' },
        { id: 'boleto', label: 'Boleto' }
      ]
    }
  },

  computed: {
    dataIdaFormatada() {
      const d = this.$route.query.dataIda
      if (!d) return '—'
      return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
    },

    dataVoltaFormatada() {
      const d = this.$route.query.dataVolta
      if (!d) return '—'
      return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
    },

    duracaoNoites() {
      const { dataIda, dataVolta } = this.$route.query
      if (!dataIda || !dataVolta) return 0
      const diff = new Date(dataVolta) - new Date(dataIda)
      return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
    },

    baseTotal() {
      return this.precoPorPessoa * this.passageiros
    },

    total() {
      return this.cupomAplicado ? this.baseTotal * 0.9 : this.baseTotal
    },

    totalFormatado() {
      return Number(this.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    },

    valorParcela() {
      return Number(this.total / this.parcelas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    },

    // 🔥 AQUI TÁ O FIX DO PARCELAMENTO
    parcelasOpcoes() {
      const maxParcelas = 12
      const opcoes = []

      for (let i = 1; i <= maxParcelas; i++) {
        opcoes.push({
          value: i,
          label: i === 1
            ? `À vista R$ ${this.total.toFixed(2).replace('.', ',')}`
            : `${i}x de R$ ${(this.total / i).toFixed(2).replace('.', ',')}`
        })
      }

      return opcoes
    },

    timerStr() {
      const m = Math.floor(this.timerSegundos / 60).toString().padStart(2, '0')
      const s = (this.timerSegundos % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    }
  },

  watch: {
    metodoPagamento(val) {
      if (val === 'pix') this.iniciarTimer()
      else this.pararTimer()
    }
  },

  methods: {
    formatarNumeroCartao(numero) {
      return numero.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()
    },

    async carregarDestino(nomeDestino) {
      try {
        const { data } = await api.get('/destinos')
        const encontrado = data.find(d => d.nome === nomeDestino)
        if (encontrado) this.precoPorPessoa = Number(encontrado.preco)
      } catch (e) {
        console.error('Erro ao buscar destino:', e)
      }
    },

    mascararNumero(e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 16)
      this.cartao.numero = v.replace(/(.{4})/g, '$1 ').trim()
    },

    mascararValidade(e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 4)
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
      this.cartao.validade = v
    },

    mascararCpf(e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11)
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      this.viajante.cpf = v
    },

    mascararTelefone(e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11)
      v = v.replace(/^(\d{2})(\d)/, '($1) $2')
           .replace(/(\d{5})(\d)/, '$1-$2')
      this.viajante.telefone = v
    },

    aplicarCupom() {
      if (this.cupom.trim().toUpperCase() === 'VIAPLAN10') {
        this.cupomAplicado = 'VIAPLAN10'
        this.cupom = ''
      }
    },

    copiarChave() {
      navigator.clipboard.writeText('viaplan@pagamento.com.br')
      this.copiado = true
      setTimeout(() => this.copiado = false, 2000)
    },

    iniciarTimer() {
      this.pararTimer()
      this.timerSegundos = 600

      this.timerInterval = setInterval(() => {
        if (this.timerSegundos > 0) this.timerSegundos--
        else this.pararTimer()
      }, 1000)
    },

    pararTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    async pagar() {
      try {
        if (!this.id) throw new Error("ID não encontrado")

        this.pagando = true

        await api.post(`/viagens/pagar/${this.id}`)

        this.sucesso = true
        alert("Pagamento realizado com sucesso!")

        this.$router.push("/")
      } catch (erro) {
        console.error("Erro ao pagar:", erro)
        alert("Erro ao processar pagamento.")
      } finally {
        this.pagando = false
      }
    }
  },

  async mounted() {
    const q = this.$route.query

    this.id = q.id

    if (!this.id) {
      alert("Erro: ID não encontrado")
      this.$router.push("/")
      return
    }

    if (q.destino) this.destino.nome = q.destino
    if (q.pessoas) this.passageiros = Number(q.pessoas)

    if (q.nome) {
      const partes = q.nome.trim().split(' ')
      this.viajante.nome = partes[0] || ''
      this.viajante.sobrenome = partes.slice(1).join(' ') || ''
    }

    if (q.email) this.viajante.email = q.email

    if (q.destino) await this.carregarDestino(q.destino)
  },

  beforeUnmount() {
    this.pararTimer()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.pagamento-container {
  min-height: 100vh;
  background: #080e1a;
  color: #e2e8f0;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 80px;
}

.bg-orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
.orb-1 { width: 600px; height: 600px; top: -200px; left: -200px; background: radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%); }
.orb-2 { width: 500px; height: 500px; bottom: -100px; right: -150px; background: radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%); }
.bg-grain {
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.03; pointer-events: none; z-index: 0;
}

.page-inner { position: relative; z-index: 1; max-width: 1160px; margin: 0 auto; padding: 32px 24px 0; }

/* TOPO */
.page-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap; gap: 20px; }
.back-link { display: inline-flex; align-items: center; gap: 7px; color: #64748b; text-decoration: none; font-size: 13.5px; font-weight: 500; transition: color 0.2s; }
.back-link:hover { color: #94a3b8; }
.steps { display: flex; align-items: center; }
.step { display: flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 500; color: #334155; }
.step.done { color: #38bdf8; }
.step.active { color: #f1f5f9; }
.step-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }
.step.done .step-dot { background: rgba(56,189,248,0.15); border-color: rgba(56,189,248,0.3); color: #38bdf8; }
.step.active .step-dot { background: linear-gradient(135deg, #0ea5e9, #38bdf8); border-color: transparent; color: #080e1a; box-shadow: 0 0 16px rgba(56,189,248,0.4); }
.step-line { width: 48px; height: 1px; background: rgba(255,255,255,0.08); margin: 0 8px; }
.step-line.done { background: rgba(56,189,248,0.3); }

/* GRID */
.main-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }

/* CARD */
.card { background: #0d1b30; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 28px; margin-bottom: 20px; animation: fadeUp 0.5s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.card-icon { width: 36px; height: 36px; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #38bdf8; flex-shrink: 0; }
.card-header h2 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #f1f5f9; font-weight: 700; }

/* MÉTODOS */
.metodos { display: flex; gap: 10px; margin-bottom: 24px; }
.metodo-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #64748b; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.metodo-btn:hover { background: rgba(255,255,255,0.06); color: #94a3b8; }
.metodo-btn.ativo { background: rgba(56,189,248,0.1); border-color: rgba(56,189,248,0.3); color: #38bdf8; }

/* CARD VISUAL 3D */
.card-visual { width: 100%; height: 180px; border-radius: 16px; margin-bottom: 24px; position: relative; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(.4,0,.2,1); }
.card-visual.flipped { transform: rotateY(180deg); }
.card-visual-front, .card-visual-back { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 16px; padding: 22px 24px; }
.card-visual-front { background: linear-gradient(135deg, #0c2340 0%, #0a3060 40%, #0d1b30 100%); border: 1px solid rgba(56,189,248,0.2); box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; justify-content: space-between; }
.card-visual-back { background: linear-gradient(135deg, #0a1e38 0%, #0c2a50 100%); border: 1px solid rgba(56,189,248,0.15); transform: rotateY(180deg); display: flex; flex-direction: column; justify-content: center; gap: 16px; }
.card-chip { width: 36px; }
.card-number-display { font-size: 1.2rem; font-weight: 600; letter-spacing: 3px; color: #e2e8f0; }
.card-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.card-label-sm { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #475569; margin-bottom: 3px; }
.card-value { font-size: 12.5px; font-weight: 600; color: #cbd5e1; }
.card-strip { height: 44px; background: rgba(0,0,0,0.5); margin: -22px -24px 0; border-radius: 4px 4px 0 0; }
.card-cvv-row { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
.cvv-box { background: #f1f5f9; color: #0d1b30; padding: 6px 16px; border-radius: 6px; font-weight: 700; font-size: 14px; letter-spacing: 3px; min-width: 60px; text-align: center; }

/* FORM */
.form-group { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.form-group label { font-size: 12px; font-weight: 600; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.input-wrap { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 11px 14px; transition: border-color 0.2s, background 0.2s; color: #475569; }
.input-wrap:focus-within { border-color: rgba(56,189,248,0.35); background: rgba(56,189,248,0.04); color: #38bdf8; }
.input-wrap input, .input-wrap select { background: transparent; border: none; outline: none; color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 14px; flex: 1; min-width: 0; }
.input-wrap input::placeholder { color: #334155; }
.input-wrap select option { background: #0d1b30; }
.select-wrap { position: relative; }
.select-arrow { position: absolute; right: 14px; color: #475569; pointer-events: none; }

/* SEGURANÇA */
.seguranca-row { display: flex; align-items: center; gap: 20px; padding: 14px 0; animation: fadeUp 0.5s 160ms ease both; }
.seg-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #334155; font-weight: 500; }

/* PIX */
.pix-content { text-align: center; }
.pix-box { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 10px 0; }
.pix-qr { background: #0d1b30; border: 1px solid rgba(56,189,248,0.15); border-radius: 16px; padding: 16px; box-shadow: 0 0 40px rgba(56,189,248,0.08); }
.pix-label { font-size: 15px; font-weight: 600; color: #f1f5f9; }
.pix-sub { font-size: 13px; color: #64748b; }
.pix-key-row { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; }
.pix-key { font-size: 12.5px; color: #94a3b8; font-family: monospace; }
.btn-copy { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #38bdf8; background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); padding: 5px 10px; border-radius: 7px; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
.btn-copy:hover { background: rgba(56,189,248,0.15); }
.pix-timer { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }

/* BOLETO */
.boleto-content { text-align: center; }
.boleto-box { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 10px 0; }
.boleto-icon { width: 72px; height: 72px; background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #38bdf8; }
.boleto-box h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #f1f5f9; }
.boleto-box p { font-size: 13px; color: #64748b; line-height: 1.6; max-width: 340px; }
.boleto-codigo { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px; font-size: 11.5px; font-family: monospace; color: #94a3b8; word-break: break-all; text-align: left; }
.btn-boleto { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #38bdf8; background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); padding: 10px 20px; border-radius: 10px; cursor: pointer; transition: background 0.2s; }
.btn-boleto:hover { background: rgba(56,189,248,0.15); }

/* SUMMARY */
.summary-col { position: sticky; top: 80px; }
.summary-card { background: #0d1b30; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 26px; animation: fadeUp 0.5s 120ms ease both; }
.summary-header { margin-bottom: 20px; }
.section-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #38bdf8; margin-bottom: 6px; }
.summary-header h3 { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #f1f5f9; }

.destino-preview { display: flex; gap: 14px; margin-bottom: 20px; }
.destino-img-wrap { position: relative; flex-shrink: 0; }
.destino-img-placeholder { width: 72px; height: 72px; border-radius: 12px; background: linear-gradient(135deg, #0c2340, #0a3060); border: 1px solid rgba(56,189,248,0.15); display: flex; align-items: center; justify-content: center; color: #334155; }
.destino-badge { position: absolute; bottom: -6px; right: -6px; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.25); border-radius: 20px; padding: 2px 7px; font-size: 9px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 3px; white-space: nowrap; }
.destino-info { flex: 1; min-width: 0; }
.destino-info h4 { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f1f5f9; margin-bottom: 4px; }
.destino-aeroporto { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: #475569; margin-bottom: 8px; }
.destino-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag { font-size: 10.5px; font-weight: 600; color: #64748b; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 20px; }
.summary-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 18px 0; }
.info-row { display: flex; align-items: center; justify-content: space-between; }
.info-label { font-size: 11px; color: #475569; font-weight: 500; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
.info-value { font-size: 13.5px; font-weight: 600; color: #cbd5e1; }
.info-arrow { color: #334155; }

.valores { display: flex; flex-direction: column; gap: 10px; }
.valor-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #64748b; }
.valor-row.desconto { color: #34d399; }

.cupom-row { display: flex; gap: 8px; margin-top: 14px; }
.cupom-input { flex: 1; padding: 9px 12px; }
.cupom-input input { font-size: 13px; }
.btn-cupom { padding: 9px 16px; background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; color: #38bdf8; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
.btn-cupom:hover { background: rgba(56,189,248,0.15); }

.total-row { display: flex; align-items: flex-end; justify-content: space-between; }
.total-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
.total-sub { font-size: 12px; color: #475569; }
.total-valor { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; background: linear-gradient(135deg, #38bdf8, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

.btn-pagar { width: 100%; margin-top: 18px; padding: 15px; background: linear-gradient(135deg, #0ea5e9, #34d399); border: none; border-radius: 14px; color: #080e1a; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s; box-shadow: 0 6px 24px rgba(14,165,233,0.3); }
.btn-pagar:hover { opacity: 0.92; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(14,165,233,0.4); }
.btn-pagar.loading { opacity: 0.7; pointer-events: none; }

.spinner { width: 20px; height: 20px; border: 2.5px solid rgba(8,14,26,0.3); border-top-color: #080e1a; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

.fine-print { margin-top: 14px; font-size: 11.5px; color: #334155; text-align: center; line-height: 1.6; }
.fine-print a { color: #475569; text-decoration: underline; text-underline-offset: 2px; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(8,14,26,0.85); backdrop-filter: blur(12px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal-sucesso { background: #0d1b30; border: 1px solid rgba(52,211,153,0.2); border-radius: 24px; padding: 44px 40px; max-width: 460px; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; animation: modalIn 0.4s cubic-bezier(.22,.68,0,1.2) both; box-shadow: 0 20px 80px rgba(0,0,0,0.6), 0 0 60px rgba(52,211,153,0.08); }
@keyframes modalIn { from { opacity: 0; transform: scale(0.88) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.modal-check { width: 72px; height: 72px; background: rgba(52,211,153,0.12); border: 2px solid rgba(52,211,153,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #34d399; box-shadow: 0 0 40px rgba(52,211,153,0.2); }
.modal-sucesso h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #f1f5f9; }
.modal-sucesso > p { font-size: 14px; color: #64748b; line-height: 1.7; }

.modal-resumo { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; }
.modal-resumo-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.modal-resumo-row:last-child { border-bottom: none; }
.modal-resumo-row span { color: #64748b; }
.modal-resumo-row strong { color: #cbd5e1; }
.modal-resumo-row.total { background: rgba(52,211,153,0.06); }
.modal-resumo-row.total span { color: #6ee7b7; }
.modal-resumo-row.total strong { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #34d399; }

.btn-modal { display: inline-flex; align-items: center; padding: 12px 28px; background: linear-gradient(135deg, #34d399, #059669); color: #080e1a; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; border-radius: 12px; text-decoration: none; margin-top: 4px; transition: opacity 0.2s, transform 0.2s; box-shadow: 0 6px 20px rgba(52,211,153,0.3); }
.btn-modal:hover { opacity: 0.9; transform: translateY(-2px); }

/* RESPONSIVE */
@media (max-width: 900px) {
  .main-grid { grid-template-columns: 1fr; }
  .summary-col { position: static; }
  .steps span { display: none; }
  .step-line { width: 24px; }
}
@media (max-width: 560px) {
  .page-inner { padding: 20px 16px 0; }
  .form-row { grid-template-columns: 1fr; }
  .metodos { flex-wrap: wrap; }
  .card { padding: 20px; }
  .card-number-display { font-size: 1rem; letter-spacing: 2px; }
  .cupom-row { flex-direction: column; }
  .modal-sucesso { padding: 32px 24px; }
}
</style>