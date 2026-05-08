<template>
  <div class="perfil-page">

    <!-- ── TOP HERO BANNER ───────────────────────── -->
    <div class="hero-banner">
      <div class="hero-noise"></div>
      <div class="hero-orb-a"></div>
      <div class="hero-orb-b"></div>

      <div class="hero-inner">
        <!-- Avatar -->
        <div class="hero-avatar-wrap">
          <img :src="fotoUsuario" class="hero-avatar" />
          <label class="hero-avatar-edit" title="Alterar foto">
            <svg v-if="!uploading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            <span class="spin-xs" v-else></span>
            <input type="file" hidden @change="uploadFoto" accept="image/*" />
          </label>
        </div>

        <!-- Info -->
        <div class="hero-info">
          <div class="hero-meta">
            <span class="hero-role-badge">
              <span class="role-dot"></span>
              Membro ativo
            </span>
            <div class="hero-mini-stats">
              <span class="hero-stat">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17h18M6.5 17l1-5.5L12 13l4.5-8 1 8L21 17"/></svg>
                {{ totalViagens }} viagens
              </span>
              <span class="hero-stat-sep">·</span>
              <span class="hero-stat">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                {{ viagensPagas }} confirmadas
              </span>
            </div>
          </div>
          <h1 class="hero-name">{{ usuario.nome || "Viajante" }}</h1>
          <p class="hero-email">{{ usuario.email }}</p>
        </div>

        <!-- Logout -->
        <button class="hero-logout" @click="logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sair
        </button>
      </div>

      <!-- Tabs de navegação -->
      <div class="hero-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="hero-tab"
          :class="{ active: tabAtiva === tab.id }"
          @click="tabAtiva = tab.id"
        >
          <component :is="'svg'" v-bind="tab.svgProps" v-html="tab.svgPath"></component>
          {{ tab.label }}
          <span v-if="tab.id === 'historico'" class="tab-badge">{{ totalViagens }}</span>
        </button>
      </div>
    </div>

    <!-- ── CONTEÚDO ────────────────────────────────── -->
    <div class="perfil-body">

      <!-- Feedback global -->
      <transition name="fade-msg">
        <div v-if="msgGlobal" :class="['msg-banner', msgGlobal.tipo]">
          <svg v-if="msgGlobal.tipo === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ msgGlobal.texto }}
        </div>
      </transition>

      <!-- ══════════════════════════════════════════
           ABA: CONTA
      ══════════════════════════════════════════ -->
      <div v-if="tabAtiva === 'conta'" class="sections-grid">

        <!-- CARD: DADOS PESSOAIS -->
        <div class="section-card" :class="{ 'card-active': abaAtiva === 'dados' }">
          <div class="card-header" @click="toggleAba('dados')">
            <div class="card-header-left">
              <div class="card-icon-wrap icon-amber">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <p class="card-title">Dados pessoais</p>
                <p class="card-sub">Nome e informações básicas</p>
              </div>
            </div>
            <span class="card-chevron" :class="{ open: abaAtiva === 'dados' }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </div>
          <transition name="expand">
            <div v-if="abaAtiva === 'dados'" class="card-body">
              <div v-if="!editando">
                <div class="info-field-row">
                  <span class="info-field-label">Nome completo</span>
                  <span class="info-field-value">{{ usuario.nome }}</span>
                </div>
                <div class="info-field-row">
                  <span class="info-field-label">E-mail</span>
                  <span class="info-field-value">{{ usuario.email }}</span>
                </div>
                <button class="btn-edit" @click="iniciarEdicao">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Editar nome
                </button>
              </div>
              <div v-else>
                <div class="field-group">
                  <label class="field-label">Nome completo</label>
                  <input v-model="usuarioEdit.nome" type="text" placeholder="Seu nome completo" />
                </div>
                <div class="btn-row">
                  <button class="btn-cancel" @click="cancelar">Cancelar</button>
                  <button class="btn-save" @click="salvarPerfil" :disabled="loading">
                    <span class="spin-xs" v-if="loading"></span>
                    {{ loading ? "Salvando…" : "Salvar" }}
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- CARD: TROCAR E-MAIL -->
        <div class="section-card" :class="{ 'card-active': abaAtiva === 'email' }">
          <div class="card-header" @click="toggleAba('email')">
            <div class="card-header-left">
              <div class="card-icon-wrap icon-blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p class="card-title">Endereço de e-mail</p>
                <p class="card-sub">{{ usuario.email }}</p>
              </div>
            </div>
            <span class="card-chevron" :class="{ open: abaAtiva === 'email' }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </div>
          <transition name="expand">
            <div v-if="abaAtiva === 'email'" class="card-body">
              <div v-if="emailStep === 1">
                <div class="field-group">
                  <label class="field-label">Novo e-mail</label>
                  <input v-model="emailNovo" type="email" placeholder="novo@email.com" />
                </div>
                <div class="notice-box">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Um código será enviado ao seu e-mail <strong>atual</strong> para confirmar a alteração.
                </div>
                <button class="btn-save full-w" @click="enviarCodigoEmail" :disabled="loading">
                  <span class="spin-xs" v-if="loading"></span>
                  {{ loading ? "Enviando…" : "Enviar código de confirmação" }}
                </button>
              </div>
              <div v-if="emailStep === 2">
                <div class="sent-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Código enviado para <strong>{{ usuario.email }}</strong>
                </div>
                <div class="field-group">
                  <label class="field-label">Código de 6 dígitos</label>
                  <input v-model="emailCodigo" type="text" maxlength="6" placeholder="000000" class="code-input" />
                </div>
                <div class="btn-row">
                  <button class="btn-cancel" @click="emailStep = 1; emailCodigo = ''">Voltar</button>
                  <button class="btn-save" @click="confirmarTrocaEmail" :disabled="loading">
                    <span class="spin-xs" v-if="loading"></span>
                    {{ loading ? "Confirmando…" : "Confirmar troca" }}
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- CARD: TROCAR SENHA -->
        <div class="section-card" :class="{ 'card-active': abaAtiva === 'senha' }">
          <div class="card-header" @click="toggleAba('senha')">
            <div class="card-header-left">
              <div class="card-icon-wrap icon-slate">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div>
                <p class="card-title">Segurança da conta</p>
                <p class="card-sub">Alterar senha de acesso</p>
              </div>
            </div>
            <span class="card-chevron" :class="{ open: abaAtiva === 'senha' }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </div>
          <transition name="expand">
            <div v-if="abaAtiva === 'senha'" class="card-body">
              <div class="method-switch">
                <button class="method-btn" :class="{ active: senhaMetodo === 'atual' }" @click="senhaMetodo = 'atual'; resetarSenha()">Tenho minha senha</button>
                <button class="method-btn" :class="{ active: senhaMetodo === 'codigo' }" @click="senhaMetodo = 'codigo'; resetarSenha()">Esqueci minha senha</button>
              </div>

              <div v-if="senhaMetodo === 'atual'">
                <div class="field-group">
                  <label class="field-label">Senha atual</label>
                  <div class="input-eye">
                    <input v-model="senhaAtual" :type="verSenhaAtual ? 'text' : 'password'" placeholder="••••••••" />
                    <button type="button" class="eye-btn" @click="verSenhaAtual = !verSenhaAtual">
                      <svg v-if="!verSenhaAtual" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Nova senha</label>
                  <div class="input-eye">
                    <input v-model="senhaNova" :type="verSenhaNova ? 'text' : 'password'" placeholder="••••••••" />
                    <button type="button" class="eye-btn" @click="verSenhaNova = !verSenhaNova">
                      <svg v-if="!verSenhaNova" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Confirmar nova senha</label>
                  <div class="input-eye">
                    <input v-model="senhaConfirm" :type="verSenhaConfirm ? 'text' : 'password'" placeholder="••••••••" />
                    <button type="button" class="eye-btn" @click="verSenhaConfirm = !verSenhaConfirm">
                      <svg v-if="!verSenhaConfirm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  </div>
                </div>
                <div class="strength-row" v-if="senhaNova">
                  <div class="strength-track">
                    <div class="strength-fill" :style="{ width: forcaSenha.pct + '%', background: forcaSenha.cor }"></div>
                  </div>
                  <span class="strength-text" :style="{ color: forcaSenha.cor }">{{ forcaSenha.texto }}</span>
                </div>
                <button class="btn-save full-w" @click="trocarSenhaComAtual" :disabled="loading">
                  <span class="spin-xs" v-if="loading"></span>
                  {{ loading ? "Salvando…" : "Alterar senha" }}
                </button>
              </div>

              <div v-if="senhaMetodo === 'codigo'">
                <div v-if="senhaStep === 1">
                  <div class="notice-box">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Enviaremos um código de verificação para <strong>{{ usuario.email }}</strong>.
                  </div>
                  <button class="btn-save full-w" @click="enviarCodigoSenha" :disabled="loading">
                    <span class="spin-xs" v-if="loading"></span>
                    {{ loading ? "Enviando…" : "Enviar código de recuperação" }}
                  </button>
                </div>
                <div v-if="senhaStep === 2">
                  <div class="sent-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Código enviado para <strong>{{ usuario.email }}</strong>
                  </div>
                  <div class="field-group">
                    <label class="field-label">Código de 6 dígitos</label>
                    <input v-model="senhaCodigo" type="text" maxlength="6" placeholder="000000" class="code-input" />
                  </div>
                  <div class="field-group">
                    <label class="field-label">Nova senha</label>
                    <div class="input-eye">
                      <input v-model="senhaNova" :type="verSenhaNova ? 'text' : 'password'" placeholder="••••••••" />
                      <button type="button" class="eye-btn" @click="verSenhaNova = !verSenhaNova">
                        <svg v-if="!verSenhaNova" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      </button>
                    </div>
                  </div>
                  <div class="field-group">
                    <label class="field-label">Confirmar nova senha</label>
                    <div class="input-eye">
                      <input v-model="senhaConfirm" :type="verSenhaConfirm ? 'text' : 'password'" placeholder="••••••••" />
                      <button type="button" class="eye-btn" @click="verSenhaConfirm = !verSenhaConfirm">
                        <svg v-if="!verSenhaConfirm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      </button>
                    </div>
                  </div>
                  <div class="strength-row" v-if="senhaNova">
                    <div class="strength-track">
                      <div class="strength-fill" :style="{ width: forcaSenha.pct + '%', background: forcaSenha.cor }"></div>
                    </div>
                    <span class="strength-text" :style="{ color: forcaSenha.cor }">{{ forcaSenha.texto }}</span>
                  </div>
                  <div class="btn-row">
                    <button class="btn-cancel" @click="senhaStep = 1; senhaCodigo = ''">Voltar</button>
                    <button class="btn-save" @click="confirmarTrocaSenhaCodigo" :disabled="loading">
                      <span class="spin-xs" v-if="loading"></span>
                      {{ loading ? "Salvando…" : "Redefinir senha" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

      </div>

      <!-- ══════════════════════════════════════════
           ABA: HISTÓRICO DE VIAGENS
      ══════════════════════════════════════════ -->
      <div v-if="tabAtiva === 'historico'" class="historico-section">

        <!-- Sumário de status -->
        <div class="status-summary">
          <div class="summary-card summary-pendente">
            <div class="summary-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <p class="summary-num">{{ contarStatus('aguardando') }}</p>
              <p class="summary-label">Pendentes</p>
            </div>
          </div>
          <div class="summary-card summary-pago">
            <div class="summary-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p class="summary-num">{{ contarStatus('pago') }}</p>
              <p class="summary-label">Confirmadas</p>
            </div>
          </div>
          <div class="summary-card summary-cancelado">
            <div class="summary-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div>
              <p class="summary-num">{{ contarStatus('cancelado') }}</p>
              <p class="summary-label">Canceladas</p>
            </div>
          </div>
          <div class="summary-card summary-total">
            <div class="summary-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17h18M6.5 17l1-5.5L12 13l4.5-8 1 8L21 17"/></svg>
            </div>
            <div>
              <p class="summary-num">{{ totalViagens }}</p>
              <p class="summary-label">Total</p>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="hist-filtros">
          <button
            v-for="f in filtrosViagem"
            :key="f.id"
            class="hist-filtro-btn"
            :class="{ active: filtroAtivo === f.id }"
            @click="filtroAtivo = f.id"
          >
            <span class="filtro-dot" :class="f.id"></span>
            {{ f.label }}
            <span class="filtro-count">{{ f.id === 'todas' ? totalViagens : contarStatus(f.id) }}</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loadingViagens" class="hist-vazio">
          <div class="hist-loading-ring"></div>
          <p>Buscando suas viagens...</p>
        </div>

        <!-- Sem viagens -->
        <div v-else-if="viagensFiltradas.length === 0" class="hist-vazio">
          <div class="hist-vazio-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 17h18M6.5 17l1-5.5L12 13l4.5-8 1 8L21 17"/></svg>
          </div>
          <p class="hist-vazio-titulo">Nenhuma viagem {{ filtroAtivo !== 'todas' ? 'com este status' : 'encontrada' }}</p>
          <p class="hist-vazio-sub">{{ filtroAtivo === 'todas' ? 'Você ainda não fez nenhuma reserva.' : 'Tente outro filtro.' }}</p>
          <button class="btn-nova-viagem" @click="$router.push('/destinos')">
            Explorar destinos
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Lista -->
        <div v-else class="viagens-lista">
          <div
            v-for="(viagem, idx) in viagensFiltradas"
            :key="viagem._id"
            class="viagem-item"
            :style="{ animationDelay: idx * 0.05 + 's' }"
            :class="{ 'item-expandido': expandido === viagem._id, [`border-${viagem.status}`]: true }"
          >
            <!-- Cabeçalho do item -->
            <div class="item-header" @click="toggleExpandir(viagem._id)">
              <div class="item-left">
                <span class="status-badge" :class="viagem.status">
                  <span class="status-dot-sm"></span>
                  {{ statusLabel(viagem.status) }}
                </span>
                <div class="item-destino">
                  <h4>{{ viagem.destino }}</h4>
                  <p class="item-datas">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {{ formatarData(viagem.dataIda) }} → {{ formatarData(viagem.dataVolta) }}
                    <span v-if="calcularDias(viagem.dataIda, viagem.dataVolta)" class="duracao-badge">{{ calcularDias(viagem.dataIda, viagem.dataVolta) }}d</span>
                  </p>
                </div>
              </div>
              <div class="item-right">
                <div class="item-preco-wrap">
                  <span class="item-preco-label">Total</span>
                  <span class="item-preco">R$ {{ Number(viagem.precoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
                </div>
                <div class="item-chevron" :class="{ rotated: expandido === viagem._id }">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <!-- Detalhes expandidos -->
            <Transition name="expand-item">
              <div v-if="expandido === viagem._id" class="item-body">
                <div class="item-sep"></div>
                <div class="item-details-grid">
                  <div class="detail-group">
                    <span class="detail-label">Passageiros</span>
                    <span class="detail-val">{{ viagem.pessoas }} {{ viagem.pessoas === 1 ? 'pessoa' : 'pessoas' }}</span>
                  </div>
                  <div class="detail-group" v-if="viagem.horarioIda">
                    <span class="detail-label">Horário de ida</span>
                    <span class="detail-val">{{ viagem.horarioIda }}</span>
                  </div>
                  <div class="detail-group" v-if="viagem.horarioVolta">
                    <span class="detail-label">Horário de volta</span>
                    <span class="detail-val">{{ viagem.horarioVolta }}</span>
                  </div>
                  <div class="detail-group">
                    <span class="detail-label">Reservado em</span>
                    <span class="detail-val">{{ formatarDataCriacao(viagem.createdAt) }}</span>
                  </div>
                </div>

                <!-- Assentos -->
                <div v-if="viagem.assentos && viagem.assentos.length" class="assentos-row">
                  <span class="detail-label">Assentos:</span>
                  <div class="assentos-chips">
                    <span v-for="a in viagem.assentos" :key="a.numero" class="assento-chip" :class="a.tipo?.toLowerCase()">
                      {{ a.numero }} <em>{{ a.tipo }}</em>
                    </span>
                  </div>
                </div>

                <!-- Rodapé com ID e botões -->
                <div class="item-footer">
                  <code class="reserva-id">ID: {{ viagem._id }}</code>

                  <div class="item-footer-btns">
                    <!-- Botão cancelar — só para pendentes -->
                    <button
                      v-if="viagem.status === 'aguardando'"
                      class="btn-cancelar-item"
                      :disabled="cancelando === viagem._id"
                      @click.stop="confirmarCancelamento(viagem)"
                    >
                      <span class="spin-cancel-sm" v-if="cancelando === viagem._id"></span>
                      <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      {{ cancelando === viagem._id ? 'Cancelando...' : 'Cancelar reserva' }}
                    </button>

                    <!-- Botão reagendar — só para confirmadas -->
                    <button
                      v-if="viagem.status === 'pago'"
                      class="btn-reagendar-item"
                      @click.stop="abrirReagendar(viagem)"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      Reagendar
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

      </div>

    </div>

    <!-- ═══════════ MODAL CONFIRMAÇÃO CANCELAMENTO ═══════════ -->
    <Transition name="modal-fade">
      <div v-if="modalCancelar" class="modal-overlay" @click.self="modalCancelar = null">
        <div class="modal-box">
          <div class="modal-icon-wrap">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3 class="modal-titulo">Cancelar esta reserva?</h3>
          <p class="modal-destino-nome">{{ modalCancelar?.destino }}</p>
          <p class="modal-desc">Esta ação não pode ser desfeita. Você receberá uma confirmação por e-mail.</p>
          <div class="modal-btns">
            <button class="modal-btn-manter" @click="modalCancelar = null">Manter reserva</button>
            <button class="modal-btn-confirmar" @click="executarCancelamento">Sim, cancelar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast-anim">
      <div v-if="toastMsg" :class="['toast-notif', toastMsg.tipo]">
        <svg v-if="toastMsg.tipo === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ toastMsg.texto }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import api from "@/services/api"

const router = useRouter()

// ── Estado da conta ───────────────────────────────
const usuario     = ref({})
const usuarioEdit = ref({})
const editando    = ref(false)
const loading     = ref(false)
const uploading   = ref(false)
const abaAtiva    = ref(null)
const tabAtiva    = ref("conta")

const msgGlobal = ref(null)
function mostrarMsg(texto, tipo = "success") {
  msgGlobal.value = { texto, tipo }
  setTimeout(() => { msgGlobal.value = null }, 4000)
}
function resetarMensagens() { msgGlobal.value = null }

function toggleAba(id) {
  abaAtiva.value = abaAtiva.value === id ? null : id
  resetarMensagens()
}

// ── Tabs ──────────────────────────────────────────
const tabs = [
  {
    id: "conta", label: "Minha conta",
    svgProps: { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2" },
    svgPath: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>'
  },
  {
    id: "historico", label: "Minhas viagens",
    svgProps: { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2" },
    svgPath: '<path d="M3 17h18M6.5 17l1-5.5L12 13l4.5-8 1 8L21 17"/>'
  }
]

// ── Storage ───────────────────────────────────────
function getUsuarioStorage() {
  return JSON.parse(sessionStorage.getItem("usuario") || localStorage.getItem("usuario") || "{}")
}
function setUsuarioStorage(user) {
  sessionStorage.setItem("usuario", JSON.stringify(user))
  if (localStorage.getItem("usuario")) localStorage.setItem("usuario", JSON.stringify(user))
}

const fotoUsuario = computed(() =>
  usuario.value.foto
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${usuario.value.foto}`
    : "/img/perfil.png"
)

// ── Perfil ────────────────────────────────────────
function iniciarEdicao() { usuarioEdit.value = { ...usuario.value }; editando.value = true }
function cancelar() { usuarioEdit.value = { ...usuario.value }; editando.value = false }

async function salvarPerfil() {
  try {
    loading.value = true
    const res = await api.put(`/usuarios/${usuario.value._id}`, { nome: usuarioEdit.value.nome })
    usuario.value = res.data; setUsuarioStorage(res.data); editando.value = false
    mostrarMsg("Nome atualizado com sucesso!")
  } catch (e) { mostrarMsg(e.response?.data?.message || "Erro ao atualizar perfil", "error") }
  finally { loading.value = false }
}

async function uploadFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith("image/")) { mostrarMsg("Arquivo inválido", "error"); return }
  if (file.size > 2 * 1024 * 1024) { mostrarMsg("Máximo: 2MB", "error"); return }
  const formData = new FormData(); formData.append("foto", file)
  try {
    uploading.value = true
    const res = await api.put(`/usuarios/foto/${usuario.value._id}`, formData)
    usuario.value = res.data; setUsuarioStorage(res.data); mostrarMsg("Foto atualizada!")
  } catch { mostrarMsg("Erro no upload", "error") }
  finally { uploading.value = false }
}

// ── E-mail ────────────────────────────────────────
const emailStep   = ref(1)
const emailNovo   = ref("")
const emailCodigo = ref("")

async function enviarCodigoEmail() {
  if (!emailNovo.value) { mostrarMsg("Informe o novo email.", "error"); return }
  try {
    loading.value = true
    await api.post(`/usuarios/${usuario.value._id}/trocar-email/enviar`, { novoEmail: emailNovo.value })
    emailStep.value = 2; mostrarMsg("Código enviado para seu email atual.")
  } catch (e) { mostrarMsg(e.response?.data?.erro || "Erro ao enviar código.", "error") }
  finally { loading.value = false }
}

async function confirmarTrocaEmail() {
  if (!emailCodigo.value) { mostrarMsg("Insira o código recebido.", "error"); return }
  try {
    loading.value = true
    const res = await api.put(`/usuarios/${usuario.value._id}/trocar-email/confirmar`, { codigo: emailCodigo.value })
    usuario.value = res.data.usuario; setUsuarioStorage(res.data.usuario)
    emailStep.value = 1; emailNovo.value = ""; emailCodigo.value = ""
    mostrarMsg("E-mail atualizado com sucesso!")
  } catch (e) { mostrarMsg(e.response?.data?.erro || "Código inválido ou expirado.", "error") }
  finally { loading.value = false }
}

// ── Senha ─────────────────────────────────────────
const senhaMetodo     = ref("atual")
const senhaStep       = ref(1)
const senhaAtual      = ref("")
const senhaNova       = ref("")
const senhaConfirm    = ref("")
const senhaCodigo     = ref("")
const verSenhaAtual   = ref(false)
const verSenhaNova    = ref(false)
const verSenhaConfirm = ref(false)

function resetarSenha() {
  senhaStep.value = 1; senhaAtual.value = ""; senhaNova.value = ""
  senhaConfirm.value = ""; senhaCodigo.value = ""; msgGlobal.value = null
}

const forcaSenha = computed(() => {
  const v = senhaNova.value; if (!v) return { pct: 0, cor: "#e2e8f0", texto: "" }
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return [
    { pct: 20, cor: "#ef4444", texto: "Muito fraca" },
    { pct: 40, cor: "#f97316", texto: "Fraca" },
    { pct: 65, cor: "#eab308", texto: "Média" },
    { pct: 85, cor: "#22c55e", texto: "Forte" },
    { pct: 100, cor: "#10b981", texto: "Muito forte" }
  ][score] || { pct: 20, cor: "#ef4444", texto: "Muito fraca" }
})

async function trocarSenhaComAtual() {
  if (!senhaAtual.value || !senhaNova.value || !senhaConfirm.value) { mostrarMsg("Preencha todos os campos.", "error"); return }
  if (senhaNova.value !== senhaConfirm.value) { mostrarMsg("As senhas não coincidem.", "error"); return }
  try {
    loading.value = true
    await api.put(`/usuarios/${usuario.value._id}/trocar-senha`, { senhaAtual: senhaAtual.value, novaSenha: senhaNova.value })
    resetarSenha(); mostrarMsg("Senha alterada com sucesso!")
  } catch (e) { mostrarMsg(e.response?.data?.erro || "Erro ao alterar senha.", "error") }
  finally { loading.value = false }
}

async function enviarCodigoSenha() {
  try {
    loading.value = true
    await api.post("/usuarios/recuperar-senha/enviar", { email: usuario.value.email })
    senhaStep.value = 2; mostrarMsg("Código enviado para seu email!")
  } catch (e) { mostrarMsg(e.response?.data?.erro || "Erro ao enviar código.", "error") }
  finally { loading.value = false }
}

async function confirmarTrocaSenhaCodigo() {
  if (!senhaCodigo.value || !senhaNova.value || !senhaConfirm.value) { mostrarMsg("Preencha todos os campos.", "error"); return }
  if (senhaNova.value !== senhaConfirm.value) { mostrarMsg("As senhas não coincidem.", "error"); return }
  try {
    loading.value = true
    await api.put(`/usuarios/${usuario.value._id}/recuperar-senha/confirmar`, { codigo: senhaCodigo.value, novaSenha: senhaNova.value })
    resetarSenha(); mostrarMsg("Senha redefinida com sucesso!")
  } catch (e) { mostrarMsg(e.response?.data?.erro || "Código inválido ou expirado.", "error") }
  finally { loading.value = false }
}

// ── Histórico de viagens ──────────────────────────
const viagens         = ref([])
const loadingViagens  = ref(false)
const filtroAtivo     = ref("todas")
const expandido       = ref(null)
const cancelando      = ref(null)
const modalCancelar   = ref(null)
const toastMsg        = ref(null)

const filtrosViagem = [
  { id: "todas",      label: "Todas"       },
  { id: "aguardando", label: "Pendentes"   },
  { id: "pago",       label: "Confirmadas" },
  { id: "cancelado",  label: "Canceladas"  },
]

const totalViagens = computed(() => viagens.value.length)
const viagensPagas = computed(() => viagens.value.filter(v => v.status === "pago").length)

const viagensFiltradas = computed(() => {
  const lista = [...viagens.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (filtroAtivo.value === "todas") return lista
  return lista.filter(v => v.status === filtroAtivo.value)
})

function contarStatus(status) {
  return viagens.value.filter(v => v.status === status).length
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

function toggleExpandir(id) {
  expandido.value = expandido.value === id ? null : id
}

function mostrarToast(texto, tipo = "success") {
  toastMsg.value = { texto, tipo }
  setTimeout(() => { toastMsg.value = null }, 3500)
}

// ── Cancelamento ──────────────────────────────────
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
    mostrarToast(e.response?.data?.erro || "Erro ao cancelar. Tente novamente.", "error")
  } finally {
    cancelando.value = null
    expandido.value = null
  }
}

// ── Reagendamento — redireciona para /viagens com destino preenchido ──
function abrirReagendar(viagem) {
  router.push({ name: "Viagens", query: { destino: viagem.destino } })
}

// ── Logout ────────────────────────────────────────
function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("usuario")
  sessionStorage.removeItem("usuario")
  window.location.href = "/"
}

// ── Mount ─────────────────────────────────────────
onMounted(async () => {
  usuario.value = getUsuarioStorage()
  if (usuario.value.email) {
    loadingViagens.value = true
    try {
      const { data } = await api.get("/viagens")
      viagens.value = data.filter(v => v.email === usuario.value.email)
    } catch (e) {
      console.error("Erro ao buscar viagens:", e)
    } finally {
      loadingViagens.value = false
    }
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,500;0,600;1,400&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.perfil-page {
  flex: 1;
  min-height: 100vh;
  background: #f4f2ee;
  font-family: 'Sora', sans-serif;
  display: flex;
  flex-direction: column;
}

/* ═══════════════════════════════════════
  HERO BANNER
═══════════════════════════════════════ */
.hero-banner {
  position: relative;
  background: #0d0f14;
  overflow: hidden;
  flex-shrink: 0;
}

.hero-noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.04; pointer-events: none; z-index: 0;
}
.hero-orb-a {
  position: absolute; width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(181,136,74,0.13) 0%, transparent 65%);
  top: -200px; left: -100px; pointer-events: none; z-index: 0;
}
.hero-orb-b {
  position: absolute; width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%);
  bottom: -120px; right: -50px; pointer-events: none; z-index: 0;
}

.hero-inner {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 28px;
  padding: 36px 48px 28px;
}

.hero-avatar-wrap { position: relative; flex-shrink: 0; width: 80px; height: 80px; }
.hero-avatar {
  width: 100%; height: 100%;
  border-radius: 20px; object-fit: cover; display: block;
  border: 2.5px solid rgba(181,136,74,0.4);
  box-shadow: 0 8px 28px rgba(0,0,0,0.4);
}
.hero-avatar-edit {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.6); border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; cursor: pointer; transition: opacity 0.2s;
  color: white; backdrop-filter: blur(2px);
}
.hero-avatar-wrap:hover .hero-avatar-edit { opacity: 1; }

.hero-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.hero-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.hero-role-badge {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 500;
  color: rgba(240,232,218,0.55);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 4px 12px; border-radius: 100px;
}
.role-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 2.5px rgba(52,211,153,0.2); flex-shrink: 0; }

.hero-mini-stats { display: flex; align-items: center; gap: 8px; }
.hero-stat { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(148,163,184,0.65); font-weight: 400; }
.hero-stat-sep { color: rgba(148,163,184,0.3); font-size: 10px; }

.hero-name { font-family: 'Lora', serif; font-size: 1.9rem; font-weight: 600; color: #f0e8da; line-height: 1.15; letter-spacing: -0.02em; }
.hero-email { font-size: 12.5px; color: rgba(148,163,184,0.7); font-weight: 300; }

.hero-logout {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 16px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 500;
  color: rgba(148,163,184,0.8); cursor: pointer; transition: all 0.2s; flex-shrink: 0;
}
.hero-logout:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #f87171; }

.hero-tabs {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 4px;
  padding: 0 48px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.hero-tab {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 18px;
  background: transparent; border: none; border-bottom: 2px solid transparent;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
  color: rgba(148,163,184,0.6); cursor: pointer; transition: all 0.2s;
  position: relative; bottom: -1px;
}
.hero-tab:hover { color: rgba(240,232,218,0.75); }
.hero-tab.active { color: #f0e8da; border-bottom-color: #b5884a; }
.hero-tab svg { flex-shrink: 0; }

.tab-badge {
  background: rgba(181,136,74,0.2); color: #c49b50;
  border-radius: 100px; padding: 1px 7px; font-size: 10.5px; font-weight: 600;
}
.hero-tab.active .tab-badge { background: rgba(181,136,74,0.3); }

/* ═══════════════════════════════════════
  BODY
═══════════════════════════════════════ */
.perfil-body {
  flex: 1;
  padding: 32px 48px 60px;
  max-width: 820px;
  width: 100%;
}

.msg-banner {
  display: flex; align-items: center; gap: 10px;
  padding: 13px 18px; border-radius: 10px;
  font-size: 13.5px; font-weight: 500;
  margin-bottom: 24px; animation: fadeUp 0.25s ease;
}
.msg-banner.success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.msg-banner.error   { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

.fade-msg-enter-active, .fade-msg-leave-active { transition: all 0.25s ease; }
.fade-msg-enter-from, .fade-msg-leave-to { opacity: 0; transform: translateY(-6px); }

/* ═══════════════════════════════════════
  SECTION CARDS
═══════════════════════════════════════ */
.sections-grid { display: flex; flex-direction: column; gap: 10px; }

.section-card {
  background: white; border: 1.5px solid #e8e2d8; border-radius: 14px;
  overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s;
}
.section-card:hover { border-color: #d4c9b8; }
.section-card.card-active { border-color: #b5884a; box-shadow: 0 4px 20px rgba(181,136,74,0.1); }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 22px; cursor: pointer; user-select: none;
}
.card-header:hover { background: #faf9f7; }
.card-header-left { display: flex; align-items: center; gap: 14px; }

.card-icon-wrap {
  width: 40px; height: 40px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.icon-amber { background: #fef9ec; color: #b5884a; border: 1px solid #f5e6c3; }
.icon-blue  { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; }
.icon-slate { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }

.card-title { font-size: 14px; font-weight: 600; color: #1a1614; margin-bottom: 2px; }
.card-sub   { font-size: 12px; color: #94a3b8; font-weight: 300; }

.card-chevron { color: #94a3b8; transition: transform 0.25s ease; flex-shrink: 0; }
.card-chevron.open { transform: rotate(180deg); color: #b5884a; }

.card-body { padding: 0 22px 22px; }

.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; padding-bottom: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 700px; }

.info-field-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0; border-bottom: 1px solid #f0ebe2;
}
.info-field-row:last-of-type { margin-bottom: 18px; }
.info-field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; }
.info-field-value { font-size: 14px; font-weight: 500; color: #1a1614; }

.btn-edit {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 18px; background: #1a1614; color: white;
  border: none; border-radius: 9px;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: background 0.2s, transform 0.15s;
}
.btn-edit:hover { background: #2d2520; transform: translateY(-1px); }

.field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; }

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%; padding: 12px 16px;
  background: #faf9f7; border: 1.5px solid #e2d9cc; border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 13.5px; color: #1a1614;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus { border-color: #b5884a; box-shadow: 0 0 0 3px rgba(181,136,74,0.1); background: white; }

.code-input {
  font-size: 24px !important; font-weight: 700 !important;
  letter-spacing: 12px !important; text-align: center;
  font-family: 'Courier New', monospace !important;
}

.input-eye { position: relative; }
.input-eye input { padding-right: 44px; }
.eye-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #94a3b8;
  display: flex; align-items: center; padding: 4px; transition: color 0.2s;
}
.eye-btn:hover { color: #475569; }

.notice-box {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 13px 15px; border-radius: 9px;
  background: #fef9ec; border: 1px solid #f5e6c3;
  font-size: 12.5px; color: #92400e; line-height: 1.55; margin-bottom: 16px;
}

.sent-badge {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 9px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  font-size: 12.5px; color: #15803d; margin-bottom: 16px;
}

.method-switch { display: flex; gap: 6px; margin-bottom: 20px; }
.method-btn {
  flex: 1; padding: 9px 12px;
  background: #faf9f7; border: 1.5px solid #e2d9cc; border-radius: 9px;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; color: #94a3b8;
  cursor: pointer; transition: all 0.2s;
}
.method-btn.active { background: white; border-color: #b5884a; color: #1a1614; box-shadow: 0 2px 8px rgba(181,136,74,0.12); }
.method-btn:not(.active):hover { border-color: #c8b99a; color: #64748b; }

.strength-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; margin-top: -6px; }
.strength-track { flex: 1; height: 4px; background: #e8e2d8; border-radius: 100px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 100px; transition: width 0.3s ease, background 0.3s; }
.strength-text { font-size: 11px; font-weight: 600; white-space: nowrap; }

.btn-row { display: flex; gap: 10px; margin-top: 8px; }
.btn-cancel {
  flex: 1; padding: 12px; background: transparent;
  border: 1.5px solid #e2d9cc; border-radius: 9px;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500; color: #94a3b8;
  cursor: pointer; transition: all 0.2s;
}
.btn-cancel:hover { border-color: #c8b99a; color: #475569; background: #faf9f7; }

.btn-save {
  flex: 2; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #b5884a 0%, #c9964f 100%);
  color: white; border: none; border-radius: 9px;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 16px rgba(181,136,74,0.28);
}
.btn-save.full-w { flex: none; width: 100%; }
.btn-save:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.spin-xs {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ═══════════════════════════════════════
  HISTÓRICO DE VIAGENS
═══════════════════════════════════════ */
.historico-section { display: flex; flex-direction: column; gap: 20px; }

.status-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.summary-card {
  background: white; border-radius: 12px;
  padding: 16px 18px; display: flex; align-items: center; gap: 12px;
  border: 1.5px solid #e8e2d8; transition: box-shadow 0.2s;
}
.summary-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

.summary-icon { width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.summary-pendente .summary-icon { background: #fffbeb; color: #d97706; }
.summary-pago .summary-icon { background: #f0fdf4; color: #16a34a; }
.summary-cancelado .summary-icon { background: #fef2f2; color: #dc2626; }
.summary-total .summary-icon { background: #f1f5f9; color: #475569; }

.summary-num { font-family: 'Lora', serif; font-size: 1.4rem; font-weight: 600; color: #0f172a; line-height: 1; margin-bottom: 2px; }
.summary-label { font-size: 11px; color: #94a3b8; font-weight: 400; text-transform: uppercase; letter-spacing: 0.7px; }

.hist-filtros { display: flex; gap: 6px; flex-wrap: wrap; }
.hist-filtro-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; background: white;
  border: 1.5px solid #e2d9cc; border-radius: 100px;
  font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.hist-filtro-btn.active { background: #1a1614; border-color: #1a1614; color: white; }
.hist-filtro-btn:not(.active):hover { border-color: #b5884a; color: #b5884a; }

.filtro-dot { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; }
.hist-filtro-btn.active .filtro-dot { background: rgba(255,255,255,0.4); }
.filtro-dot.pago { background: #22c55e; }
.filtro-dot.aguardando { background: #f59e0b; }
.filtro-dot.cancelado { background: #ef4444; }

.filtro-count { background: rgba(0,0,0,0.07); border-radius: 100px; padding: 1px 7px; font-size: 10.5px; font-weight: 600; }
.hist-filtro-btn.active .filtro-count { background: rgba(255,255,255,0.12); }

.hist-vazio { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; text-align: center; }
.hist-loading-ring { width: 36px; height: 36px; border: 3px solid #e2d9cc; border-top-color: #b5884a; border-radius: 50%; animation: spin 0.8s linear infinite; }
.hist-vazio-icon { width: 60px; height: 60px; background: white; border: 1.5px solid #e8e2d8; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #b5884a; }
.hist-vazio-titulo { font-size: 14.5px; font-weight: 600; color: #1a1614; }
.hist-vazio-sub { font-size: 13px; color: #94a3b8; font-weight: 300; }

.btn-nova-viagem {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 20px; background: #1a1614; color: white;
  border: none; border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; margin-top: 4px; transition: all 0.2s;
}
.btn-nova-viagem:hover { background: #2d2520; transform: translateY(-1px); }

.viagens-lista { display: flex; flex-direction: column; gap: 8px; }

.viagem-item {
  background: white; border-radius: 13px;
  border-left: 3.5px solid #e2d9cc;
  border-top: 1.5px solid #e8e2d8;
  border-right: 1.5px solid #e8e2d8;
  border-bottom: 1.5px solid #e8e2d8;
  overflow: hidden; transition: all 0.2s;
  animation: slideIn 0.35s ease both;
}
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.viagem-item.border-pago { border-left-color: #22c55e; }
.viagem-item.border-aguardando { border-left-color: #f59e0b; }
.viagem-item.border-cancelado { border-left-color: #ef4444; }
.viagem-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
.viagem-item.item-expandido { box-shadow: 0 6px 24px rgba(181,136,74,0.1); border-top-color: #d4c9b8; border-right-color: #d4c9b8; border-bottom-color: #d4c9b8; }

.item-header {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 16px 18px; cursor: pointer;
}
.item-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
.item-right { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }

.status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 100px;
  font-size: 10.5px; font-weight: 600; white-space: nowrap; flex-shrink: 0;
}
.status-dot-sm { width: 5px; height: 5px; border-radius: 50%; }
.status-badge.pago { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.status-badge.pago .status-dot-sm { background: #22c55e; }
.status-badge.aguardando { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.status-badge.aguardando .status-dot-sm { background: #f59e0b; }
.status-badge.cancelado { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
.status-badge.cancelado .status-dot-sm { background: #ef4444; }

.item-destino h4 { font-family: 'Lora', serif; font-size: 1rem; font-weight: 600; color: #1a1614; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-datas { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: #64748b; font-weight: 300; }
.duracao-badge { background: #f1f5f9; color: #64748b; border-radius: 5px; padding: 1px 6px; font-size: 10px; font-weight: 600; }

.item-preco-wrap { text-align: right; }
.item-preco-label { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 1px; }
.item-preco { font-family: 'Lora', serif; font-size: 1rem; font-weight: 600; color: #b5884a; }

.item-chevron { color: #94a3b8; transition: transform 0.25s ease; }
.item-chevron.rotated { transform: rotate(180deg); }

.expand-item-enter-active, .expand-item-leave-active { transition: all 0.3s ease; overflow: hidden; }
.expand-item-enter-from, .expand-item-leave-to { opacity: 0; max-height: 0; }
.expand-item-enter-to, .expand-item-leave-from { opacity: 1; max-height: 500px; }

.item-body { padding: 0 18px 18px; }
.item-sep { height: 1px; background: #f0ebe2; margin-bottom: 16px; }

.item-details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 14px; }
.detail-group { display: flex; flex-direction: column; gap: 3px; }
.detail-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; }
.detail-val { font-size: 13px; font-weight: 500; color: #1a1614; }

.assentos-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.assentos-chips { display: flex; flex-wrap: wrap; gap: 5px; }
.assento-chip {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 6px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  font-size: 12px; font-weight: 600; color: #1a1614;
}
.assento-chip em { font-style: normal; font-size: 10px; font-weight: 400; color: #94a3b8; }
.assento-chip.executiva, .assento-chip.business { background: #fef9ec; border-color: #f5e6c3; }
.assento-chip.primeira { background: #f8f0ff; border-color: #e9d5ff; }

.item-footer {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
}
.reserva-id {
  font-family: 'Courier New', monospace; font-size: 10.5px;
  color: #94a3b8; background: #f8fafc; border-radius: 5px;
  padding: 4px 8px; letter-spacing: 0.3px;
}
.item-footer-btns { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

/* Botão cancelar */
.btn-cancelar-item {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  background: transparent; color: #dc2626;
  border: 1.5px solid #fecaca; border-radius: 8px;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-cancelar-item:hover:not(:disabled) { background: #dc2626; color: white; border-color: #dc2626; box-shadow: 0 4px 12px rgba(220,38,38,0.2); }
.btn-cancelar-item:disabled { opacity: 0.6; cursor: not-allowed; }

.spin-cancel-sm {
  width: 11px; height: 11px;
  border: 2px solid rgba(220,38,38,0.3); border-top-color: #dc2626;
  border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
}

/* Botão reagendar */
.btn-reagendar-item {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  background: transparent; color: #2563eb;
  border: 1.5px solid #bfdbfe; border-radius: 8px;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-reagendar-item:hover { background: #2563eb; color: white; border-color: #2563eb; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }

/* ═══════════════════════════════════════
  MODAIS
═══════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.52);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 20px;
}
.modal-box {
  background: white; border-radius: 18px;
  padding: 36px 30px 28px; max-width: 400px; width: 100%;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  text-align: center;
}

.modal-icon-wrap {
  width: 58px; height: 58px; border-radius: 50%;
  background: #fef2f2; color: #dc2626;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px; border: 1.5px solid #fecaca;
}

.modal-titulo { font-family: 'Lora', serif; font-size: 1.35rem; font-weight: 600; color: #1a1614; margin-bottom: 6px; }
.modal-destino-nome { font-size: 14px; font-weight: 600; color: #b5884a; margin-bottom: 12px; }
.modal-desc { font-size: 13px; color: #64748b; line-height: 1.65; margin-bottom: 22px; font-weight: 300; }

.modal-btns { display: flex; gap: 10px; }
.modal-btn-manter {
  flex: 1; padding: 12px;
  background: transparent; border: 1.5px solid #e2d9cc; border-radius: 9px;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.modal-btn-manter:hover { border-color: #c8b99a; background: #faf9f7; }
.modal-btn-confirmar {
  flex: 1; padding: 12px;
  background: #dc2626; color: white; border: none; border-radius: 9px;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(220,38,38,0.26);
}
.modal-btn-confirmar:hover { background: #b91c1c; transform: translateY(-1px); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ═══════════════════════════════════════
  TOAST
═══════════════════════════════════════ */
.toast-notif {
  position: fixed; bottom: 28px; right: 28px;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px; border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 28px rgba(0,0,0,0.14); z-index: 200;
}
.toast-notif.success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.toast-notif.error   { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

.toast-anim-enter-active, .toast-anim-leave-active { transition: all 0.3s ease; }
.toast-anim-enter-from { opacity: 0; transform: translateY(10px); }
.toast-anim-leave-to   { opacity: 0; transform: translateY(6px); }

/* ═══════════════════════════════════════
  RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 768px) {
  .hero-inner { padding: 24px 20px 20px; }
  .hero-tabs { padding: 0 20px; }
  .hero-mini-stats { display: none; }
  .hero-name { font-size: 1.5rem; }
  .perfil-body { padding: 24px 16px 48px; }
  .status-summary { grid-template-columns: repeat(2, 1fr); }
  .modal-btns { flex-direction: column; }
  .item-footer { flex-direction: column; align-items: flex-start; }
  .item-footer-btns { width: 100%; }
  .btn-cancelar-item, .btn-reagendar-item { width: 100%; justify-content: center; }
}
</style>