  <template>
    <div class="contact-page">

      <!-- HERO -->
      <section class="hero">
        <div class="hero-badge">Suporte & Contato</div>
        <h1>Fale com a<br/><em>ViaPlan</em></h1>
        <p>Estamos prontos para ajudar você em qualquer etapa da sua viagem.</p>
      </section>

      <!-- CANAIS -->
      <div class="grid-wrap">
        <div class="channels-grid">

          <div class="channel" @click="openModal('whatsapp')">
            <div class="channel-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 10a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 2.08 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3>WhatsApp</h3>
            <p>Atendimento rápido via mensagem</p>
            <svg class="channel-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </div>

          <div class="channel-divider"></div>

          <div class="channel" @click="openModal('email')">
            <div class="channel-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3>E-mail</h3>
            <p>Resposta em até 24 horas úteis</p>
            <svg class="channel-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </div>

          <div class="channel-divider"></div>

          <div class="channel" @click="openModal('chat')">
            <div class="channel-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3>Chat online</h3>
            <p>Suporte em tempo real</p>
            <svg class="channel-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </div>

        </div>
      </div>

      <!-- MODAL -->
      <div v-if="activeModal" class="overlay" @click.self="closeModal">
        <div class="modal">

          <div class="modal-header">
            <h2>{{ modalTitles[activeModal] }}</h2>
            <button class="modal-close" @click="closeModal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">

            <!-- WHATSAPP -->
            <div v-if="activeModal === 'whatsapp'">
              <p class="modal-desc">Converse diretamente com nossa equipe de suporte. Geralmente respondemos em minutos durante o horário de atendimento.</p>
              <div class="info-row">
                <div class="info-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div class="info-label">Horário de atendimento</div>
                  <div class="info-value">Seg–Sex 8h–20h · Sáb 9h–14h</div>
                </div>
              </div>
              <div class="modal-actions">
                <a href="https://wa.me/5531988836094" target="_blank" class="modal-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 10a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 2.08 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Abrir conversa
                </a>
              </div>
            </div>

            <!-- EMAIL -->
            <div v-if="activeModal === 'email'">
              <p class="modal-desc">Envie sua dúvida ou solicitação e nossa equipe responderá com atenção em até 24 horas úteis.</p>
              <div class="info-row">
                <div class="info-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <div class="info-label">Endereço</div>
                  <div class="info-value">viaplan.contato@gmail.com</div>
                </div>
              </div>
              <div class="info-row">
                <div class="info-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div class="info-label">Tempo de resposta</div>
                  <div class="info-value">Até 24 horas úteis</div>
                </div>
              </div>
              <div class="modal-actions">
                <a 
  href="https://mail.google.com/mail/?view=cm&fs=1&to=viaplan.contato@gmail.com&su=Contato%20ViaPlan&body=Olá,%20gostaria%20de%20informações"
  target="_blank"
  class="modal-btn"
>
  Enviar e-mail
</a>
              </div>
            </div>

            <!-- CHAT -->
            <div v-if="activeModal === 'chat'" class="chat-wrap">
              <div class="messages" ref="chatRef">
                <div
                  v-for="(msg, index) in messages"
                  :key="index"
                  :class="['message', msg.from]"
                >
                  {{ msg.text }}
                </div>
              </div>
              <div class="chat-input">
                <input
                  v-model="userInput"
                  @keyup.enter="sendMessage"
                  placeholder="Digite sua mensagem..."
                />
                <button @click="sendMessage">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
              <button class="end-chat" @click="endChat">Encerrar conversa</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  </template>

  <script setup>
  import { ref, nextTick } from 'vue'

  const activeModal = ref(null)
  const userInput = ref('')
  const chatRef = ref(null)

  const modalTitles = {
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    chat: 'Chat online',
  }

  const defaultMessages = [
    { from: 'bot', text: 'Olá! Sou o assistente da ViaPlan. Como posso te ajudar hoje?' }
  ]

  const messages = ref([...defaultMessages])

  function openModal(type) {
    activeModal.value = type
  }

  function closeModal() {
    activeModal.value = null
    messages.value = [...defaultMessages]
  }

  function getBotResponse(text) {
  const t = text.toLowerCase()

  // SAUDAÇÕES
  if (/(oi|olá|ola|bom dia|boa tarde|boa noite)/.test(t)) {
    return 'Olá! 😊 Sou o assistente da ViaPlan. Posso te ajudar com destinos, preços, reservas ou dúvidas gerais de viagem. O que você gostaria de saber? Precisa de mais alguma coisa?'
  }

  // SOBRE A EMPRESA
  if (/(viaplan|o que é|quem são)/.test(t)) {
    return 'A ViaPlan é uma plataforma completa para planejar, comparar e reservar viagens com segurança e praticidade. Aqui você encontra destinos, pacotes e suporte em todas as etapas da sua viagem. Precisa de mais alguma coisa?'
  }

  // PREÇO
  if (/(preço|valor|custa|quanto)/.test(t)) {
    return 'Os preços variam bastante dependendo do destino, datas e tipo de pacote. Recomendo acessar a área de pacotes para ver opções atualizadas ou me dizer para onde você quer ir 😊 Precisa de mais alguma coisa?'
  }

  // DESTINOS
  if (/(destino|viajar|lugares|sugestão)/.test(t)) {
    return 'Temos diversos destinos incríveis! ✈️ Desde praias paradisíacas até viagens internacionais. Se quiser, me diga seu orçamento ou preferência que te sugiro algo ideal. Precisa de mais alguma coisa?'
  }

  // RESERVA / COMPRA
  if (/(reserva|reservar|comprar|agendar)/.test(t)) {
    return 'Você pode fazer sua reserva diretamente pela plataforma ViaPlan de forma simples e segura. Basta escolher o destino, datas e seguir o processo de compra. Se precisar, posso te orientar passo a passo. Precisa de mais alguma coisa?'
  }

  // CANCELAMENTO
  if (/(cancelar|cancelamento|reembolso|devolver)/.test(t)) {
    return 'Os cancelamentos e reembolsos seguem as regras de cada fornecedor. Você pode verificar ou solicitar isso na área "Minhas viagens". Se quiser, te explico como fazer. Precisa de mais alguma coisa?'
  }

  // PAGAMENTO
  if (/(pagamento|pagar|cartão|pix|boleto)/.test(t)) {
    return 'Aceitamos diversas formas de pagamento como cartão de crédito, débito, Pix e boleto. Tudo com segurança para sua tranquilidade. Precisa de mais alguma coisa?'
  }

  // PRAZO / SUPORTE
  if (/(demora|tempo|resposta|atendimento)/.test(t)) {
    return 'Nosso atendimento varia conforme o canal. No chat e WhatsApp é mais rápido, e por e-mail pode levar até 24 horas úteis. Precisa de mais alguma coisa?'
  }

  // AGRADECIMENTO
  if (/(obrigado|valeu|tchau|até mais)/.test(t)) {
    return 'Nós que agradecemos! 😊 Foi um prazer te ajudar. Se precisar novamente, estaremos por aqui. Precisa de mais alguma coisa?'
  }

  // FALLBACK INTELIGENTE
  return 'Entendi sua mensagem, mas ainda não tenho uma resposta exata para isso. 😅 Você pode reformular ou me dar mais detalhes? Assim consigo te ajudar melhor. Precisa de mais alguma coisa?'
}

  function sendMessage() {
    if (!userInput.value.trim()) return
    messages.value.push({ from: 'user', text: userInput.value })
    const response = getBotResponse(userInput.value)
    userInput.value = ''
    setTimeout(async () => {
      messages.value.push({ from: 'bot', text: response })
      await nextTick()
      if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
    }, 400)
  }

function endChat() {
  messages.value.push({
    from: 'bot',
    text: 'Obrigado pelo contato! 😊 Sempre que precisar, estaremos por aqui. Precisa de mais alguma coisa?'
  })

  setTimeout(() => {
    closeModal()
  }, 2000)
}
  </script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .contact-page {
    font-family: 'Inter', sans-serif;
    background: #060d1a;
    color: #c8d8ea;
    min-height: 100vh;
  }

  /* ─── Hero ─── */
  .hero {
    padding: 5rem 2rem 4rem;
    text-align: center;
    background: linear-gradient(180deg, #061229 0%, #060d1a 100%);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(24,95,165,0.2) 0%, transparent 70%);
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .hero-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #60a5fa;
    border: 1px solid rgba(96,165,250,0.3);
    padding: 4px 14px;
    border-radius: 20px;
    margin-bottom: 1.5rem;
    background: rgba(96,165,250,0.06);
    position: relative;
  }

  .hero h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px;
    font-weight: 400;
    color: #e8f4ff;
    margin-bottom: 1rem;
    line-height: 1.1;
    letter-spacing: -0.01em;
    position: relative;
  }

  .hero h1 em {
    font-style: italic;
    color: #60a5fa;
  }

  .hero p {
    font-size: 15px;
    color: rgba(200,216,234,0.6);
    font-weight: 300;
    max-width: 420px;
    margin: 0 auto;
    position: relative;
  }

  /* ─── Channels ─── */
  .grid-wrap {
    max-width: 960px;
    margin: 0 auto;
    padding: 3rem 2rem;
  }

  .channels-grid {
    display: grid;
    grid-template-columns: 1fr 1px 1fr 1px 1fr;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
  }

  .channel-divider {
    background: rgba(255,255,255,0.05);
  }

  .channel {
    padding: 2.5rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: background 0.2s;
    position: relative;
  }

  .channel:hover { background: rgba(96,165,250,0.04); }

  .channel-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(96,165,250,0.08);
    border: 1px solid rgba(96,165,250,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    color: #60a5fa;
    transition: all 0.2s;
  }

  .channel:hover .channel-icon {
    background: rgba(96,165,250,0.15);
    border-color: rgba(96,165,250,0.4);
  }

  .channel h3 {
    font-size: 15px;
    font-weight: 500;
    color: #e8f4ff;
    margin-bottom: 6px;
  }

  .channel p {
    font-size: 13px;
    color: rgba(200,216,234,0.5);
    font-weight: 300;
    line-height: 1.5;
  }

  .channel-arrow {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    color: rgba(96,165,250,0.25);
    transition: all 0.2s;
  }

  .channel:hover .channel-arrow {
    color: #60a5fa;
    transform: translate(2px, -2px);
  }

  /* ─── Overlay ─── */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(4,8,18,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 1rem;
  }

  /* ─── Modal ─── */
  .modal {
    background: #0b1524;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    width: 100%;
    max-width: 440px;
    overflow: hidden;
  }

  .modal-header {
    padding: 1.5rem 1.75rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-header h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: #e8f4ff;
  }

  .modal-close {
    background: none;
    border: none;
    color: rgba(200,216,234,0.4);
    cursor: pointer;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.15s;
  }

  .modal-close:hover {
    background: rgba(255,255,255,0.06);
    color: #e8f4ff;
  }

  .modal-body { padding: 1.75rem; }

  .modal-desc {
    font-size: 14px;
    color: rgba(200,216,234,0.55);
    font-weight: 300;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .info-row:last-of-type { border-bottom: none; }

  .info-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(96,165,250,0.08);
    border: 1px solid rgba(96,165,250,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #60a5fa;
    flex-shrink: 0;
  }

  .info-label {
    font-size: 11px;
    color: rgba(200,216,234,0.4);
    margin-bottom: 2px;
    letter-spacing: 0.04em;
  }

  .info-value {
    font-size: 13px;
    color: #c8d8ea;
  }

  .modal-actions { margin-top: 1.5rem; }

  .modal-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 22px;
    border-radius: 8px;
    background: #185FA5;
    color: #e8f4ff;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: background 0.15s;
    border: none;
    cursor: pointer;
  }

  .modal-btn:hover { background: #1a6fc0; }

  /* ─── Chat ─── */
  .chat-wrap { display: flex; flex-direction: column; }

  .messages {
    height: 220px;
    overflow-y: auto;
    background: #060d1a;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    scroll-behavior: smooth;
  }

  .message {
    max-width: 80%;
    padding: 9px 13px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.55;
    font-weight: 300;
  }

  .message.bot {
    background: rgba(255,255,255,0.05);
    color: #c8d8ea;
    align-self: flex-start;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .message.user {
    background: #185FA5;
    color: #e8f4ff;
    align-self: flex-end;
  }

  .chat-input {
    display: flex;
    gap: 8px;
  }

  .chat-input input {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 10px 14px;
    color: #e8f4ff;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 300;
    outline: none;
    transition: border-color 0.2s;
  }

  .chat-input input::placeholder { color: rgba(200,216,234,0.3); }
  .chat-input input:focus { border-color: rgba(96,165,250,0.4); }

  .chat-input button {
    background: #185FA5;
    border: none;
    border-radius: 8px;
    color: #e8f4ff;
    padding: 10px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .chat-input button:hover { background: #1a6fc0; }

  .end-chat {
    margin-top: 10px;
    width: 100%;
    background: none;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(200,216,234,0.4);
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    padding: 9px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.02em;
  }

  .end-chat:hover {
    border-color: rgba(200,216,234,0.25);
    color: #c8d8ea;
  }

  /* ─── Responsive ─── */
  @media (max-width: 640px) {
    .hero h1 { font-size: 36px; }
    .channels-grid {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
    .channel-divider {
      width: 100%;
      height: 1px;
    }
  }
  </style>