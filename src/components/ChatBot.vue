<template>
  <div class="chatbot-wrapper">
    <!-- Botão flutuante -->
    <button
      class="chatbot-toggle"
      @click="toggleChat"
      :class="{ open: isOpen }"
      aria-label="Abrir chat de suporte"
    >
      <span class="toggle-icon">
        <svg v-if="!isOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </span>
      <span v-if="!isOpen" class="toggle-label">Assistente</span>
    </button>

    <!-- Janela do chat -->
    <Transition name="chat-slide">
      <div v-if="isOpen" class="chatbot-window">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="agent-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <div>
              <p class="agent-name">Via<em>Plan</em> Assistente</p>
              <span class="agent-status">
                <span class="status-dot"></span>
                Online agora
              </span>
            </div>
          </div>

        </div>

        <!-- Mensagens -->
        <div class="chat-messages" ref="messagesEl">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="message-row"
            :class="msg.role"
          >
            <div v-if="msg.role === 'assistant'" class="msg-avatar">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <div class="msg-bubble" v-html="formatMessage(msg.content)"></div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isLoading" class="message-row assistant">
            <div class="msg-avatar">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <div class="msg-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-area">
          <!-- Sugestões rápidas sempre visíveis acima do input -->
          <div class="quick-suggestions">
            <button
              v-for="sugestao in sugestoes"
              :key="sugestao"
              class="suggestion-chip"
              @click="sendSuggestion(sugestao)"
              :disabled="isLoading"
            >
              {{ sugestao }}
            </button>
          </div>
          <div class="chat-input-row">
            <input
              ref="inputEl"
              v-model="inputText"
              @keydown.enter="sendMessage"
              placeholder="Pergunte sobre destinos, preços..."
              :disabled="isLoading"
              class="chat-input"
            />
            <button
              class="send-btn"
              @click="sendMessage"
              :disabled="isLoading || !inputText.trim()"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import api from '../services/api.js';

export default {
  name: 'ChatBot',

  data() {
    return {
      isOpen: false,
      inputText: '',
      isLoading: false,
      messages: [
        {
          role: 'assistant',
          content: 'Olá! 👋 Sou o assistente da **ViaPlan**. Posso te ajudar a encontrar destinos, verificar preços, informações sobre viagens e muito mais. Como posso te ajudar hoje?'
        }
      ],
      sugestoes: [
        'Destinos até R$ 2.000',
        'Viagens para praia 🏖️',
        'Destinos internacionais',
        'O que está incluso nas viagens?'
      ]
    };
  },

  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$nextTick(() => {
          this.$refs.inputEl?.focus();
          this.scrollToBottom();
        });
      }
    },

    sendSuggestion(text) {
      this.inputText = text;
      this.sendMessage();
    },

    async sendMessage() {
      const text = this.inputText.trim();
      if (!text || this.isLoading) return;

      this.messages.push({ role: 'user', content: text });
      this.inputText = '';
      this.isLoading = true;
      this.$nextTick(() => this.scrollToBottom());

      try {
        const conversationHistory = this.messages.map(m => ({
          role: m.role,
          content: m.content
        }));

        // Chama o endpoint do próprio backend (evita CORS e protege a API key)
        const response = await api.post('/chatbot', {
          messages: conversationHistory
        });

        const reply = response.data.reply || 'Desculpe, não consegui processar sua pergunta. Tente novamente.';
        this.messages.push({ role: 'assistant', content: reply });

      } catch (e) {
        console.error('Erro no chatbot:', e);
        this.messages.push({
          role: 'assistant',
          content: 'Ops, tive um probleminha técnico. 😅 Por favor, tente novamente em instantes.'
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => this.scrollToBottom());
      }
    },

    scrollToBottom() {
      const el = this.$refs.messagesEl;
      if (el) el.scrollTop = el.scrollHeight;
    },

    formatMessage(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    }
  }
};
</script>

<style scoped>
/* ── Wrapper ── */
.chatbot-wrapper {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* ── Botão flutuante ── */
.chatbot-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px 12px 14px;
  background: linear-gradient(135deg, #c49b50 0%, #a07830 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 24px rgba(196, 155, 80, 0.45), 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.chatbot-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(196, 155, 80, 0.55), 0 4px 12px rgba(0,0,0,0.25);
}

.chatbot-toggle.open {
  padding: 12px;
  border-radius: 50%;
  background: #1a1d24;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-label {
  white-space: nowrap;
}

/* ── Janela do chat ── */
.chatbot-window {
  width: 360px;
  max-height: 520px;
  background: #111318;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4);
}

/* ── Header ── */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  background: #0d0f14;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #c49b50, #a07830);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.agent-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 2px;
  font-family: 'Segoe UI', sans-serif;
}

.agent-name em {
  font-style: italic;
  color: #c49b50;
}

.agent-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #64748b;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.header-close {
  background: transparent;
  border: none;
  color: #475569;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.header-close:hover { color: #94a3b8; }

/* ── Mensagens ── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-row.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #c49b50, #a07830);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.msg-bubble {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.55;
  font-family: 'Segoe UI', sans-serif;
}

.message-row.assistant .msg-bubble {
  background: #1a1d24;
  color: #cbd5e1;
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(255,255,255,0.06);
}

.message-row.user .msg-bubble {
  background: linear-gradient(135deg, #c49b50, #a07830);
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* Typing indicator */
.msg-bubble.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.msg-bubble.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c49b50;
  animation: typing-bounce 1.4s infinite;
}

.msg-bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
.msg-bubble.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* ── Input area + sugestões ── */
.chat-input-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px 12px;
  background: #0d0f14;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.quick-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-chip {
  padding: 5px 11px;
  background: rgba(196, 155, 80, 0.08);
  border: 1px solid rgba(196, 155, 80, 0.25);
  border-radius: 20px;
  color: #c49b50;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.suggestion-chip:hover:not(:disabled) {
  background: rgba(196, 155, 80, 0.18);
  border-color: rgba(196, 155, 80, 0.5);
}

.suggestion-chip:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.chat-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-input {
  flex: 1;
  background: #1a1d24;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 9px 13px;
  color: #e2e8f0;
  font-size: 13px;
  font-family: 'Segoe UI', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input::placeholder { color: #475569; }

.chat-input:focus {
  border-color: rgba(196, 155, 80, 0.4);
}

.chat-input:disabled { opacity: 0.5; cursor: not-allowed; }

.send-btn {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #c49b50, #a07830);
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) { transform: scale(1.05); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Animação de entrada/saída ── */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom right;
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .chatbot-wrapper {
    bottom: 16px;
    right: 16px;
  }

  .chatbot-window {
    width: calc(100vw - 32px);
    max-height: 70vh;
  }
}
</style>