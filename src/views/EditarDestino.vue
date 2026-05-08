<template>
  <div class="editar-page">
    <div class="bg-grid"></div>

    <div class="editar-card">
      
      <div class="card-header">
        <span class="logo-icon">✏️</span>
        <div class="header-text">
          <h1>Editar Destino</h1>
          <p>Atualize as informações do destino</p>
        </div>
      </div>

      <form @submit.prevent="salvarDestino" v-if="destino">

        <!-- Preview da imagem atual -->
        <div class="imagem-preview-section">
          <div class="preview-container" @click="triggerFileInput">
            <img 
              v-if="previewImagem || destino.imagem" 
              :src="previewImagem || getImageUrl(destino.imagem)" 
              alt="Preview"
              class="imagem-preview"
            />
            <div v-else class="preview-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>Clique para alterar imagem</span>
            </div>
            <div class="preview-overlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Alterar imagem</span>
            </div>
          </div>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            @change="handleFileChange" 
            class="hidden-input"
          />
          <span v-if="novaImagem" class="file-name">{{ novaImagem.name }}</span>
        </div>

        <div class="field">
          <label>Nome do Destino</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <input 
              v-model="form.nome" 
              type="text" 
              placeholder="Ex: Paris, França" 
              required 
            />
          </div>
        </div>

        <div class="field">
          <label>Aeroporto</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </span>
            <input 
              v-model="form.aeroporto" 
              type="text" 
              placeholder="Ex: CDG - Charles de Gaulle" 
              required 
            />
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label>Preço Base (R$)</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </span>
              <input 
                v-model.number="form.preco" 
                type="number" 
                min="0" 
                step="0.01"
                placeholder="0,00" 
                required 
              />
            </div>
          </div>
        </div>

        <div class="field">
          <label>Descrição</label>
          <div class="input-wrapper textarea-wrapper">
            <textarea 
              v-model="form.descricao" 
              rows="4" 
              placeholder="Descreva o destino, atrações, melhor época para visitar..."
              required
            ></textarea>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="btn-voltar" @click="voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Voltar
          </button>
          
          <button type="submit" class="btn-salvar" :disabled="salvando">
            <span v-if="salvando" class="spinner"></span>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>

      </form>

      <div v-else-if="carregando" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando destino...</p>
      </div>

      <div v-else class="error-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Destino não encontrado</p>
        <button class="btn-voltar" @click="voltar">Voltar para lista</button>
      </div>

      <transition name="fade">
        <div v-if="mensagem" :class="['toast', mensagem.tipo]">
          {{ mensagem.texto }}
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "EditarDestino",
  
  data() {
    return {
      destino: null,
      carregando: true,
      salvando: false,
      mensagem: null,
      novaImagem: null,
      previewImagem: null,
      form: {
        nome: "",
        descricao: "",
        preco: 0,
        aeroporto: ""
      }
    };
  },

  mounted() {
    this.carregarDestino();
  },

  methods: {
    async carregarDestino() {
      const id = this.$route.params.id;
      
      try {
        const res = await api.get(`/destinos/${id}`);
        this.destino = res.data;
        
        // Preenche o formulário com dados existentes
        this.form = {
          nome: this.destino.nome || "",
          descricao: this.destino.descricao || "",
          preco: this.destino.preco || 0,
          aeroporto: this.destino.aeroporto || ""
        };
        
      } catch (err) {
        console.error("Erro ao carregar destino:", err);
        this.mostrarMensagem("Erro ao carregar destino", "erro");
      } finally {
        this.carregando = false;
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validações
      if (!file.type.startsWith('image/')) {
        this.mostrarMensagem("Selecione uma imagem válida", "erro");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.mostrarMensagem("Imagem deve ter menos que 5MB", "erro");
        return;
      }

      this.novaImagem = file;
      
      // Cria preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImagem = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    getImageUrl(path) {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${path}`;
    },

    async salvarDestino() {
      this.salvando = true;
      this.mensagem = null;

      try {
        const formData = new FormData();
        
        // Adiciona campos do formulário
        formData.append("nome", this.form.nome);
        formData.append("descricao", this.form.descricao);
        formData.append("preco", this.form.preco);
        formData.append("aeroporto", this.form.aeroporto);
        
        // Adiciona imagem apenas se houver nova
        if (this.novaImagem) {
          formData.append("imagem", this.novaImagem);
        }

        const id = this.$route.params.id;
        
        // Usa PUT para atualização (você precisará adicionar esta rota no backend)
        const res = await api.put(`/destinos/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "userId": this.getAdminId() // Header necessário para verificar admin
          }
        });

        this.mostrarMensagem("Destino atualizado com sucesso!", "sucesso");
        
        // Atualiza o destino local com resposta
        this.destino = res.data.destino || res.data;
        this.novaImagem = null;
        
        // Pequeno delay antes de redirecionar ou limpar
        setTimeout(() => {
          // Opcional: redirecionar para lista de destinos
          // this.$router.push("/destinos");
        }, 1500);

      } catch (err) {
        console.error("Erro ao salvar:", err);
        const msg = err.response?.data?.erro || "Erro ao atualizar destino";
        this.mostrarMensagem(msg, "erro");
      } finally {
        this.salvando = false;
      }
    },

    getAdminId() {
      // Recupera ID do admin do sessionStorage (ajuste conforme sua lógica de auth)
      const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
      return usuario._id || usuario.id || "";
    },

    voltar() {
      this.$router.go(-1);
    },

    mostrarMensagem(texto, tipo) {
      this.mensagem = { texto, tipo };
      setTimeout(() => (this.mensagem = null), 4000);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.editar-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #0d0f14;
  font-family: 'DM Sans', sans-serif;
  padding: 40px 16px;
  position: relative;
  overflow-x: hidden;
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

/* Card */
.editar-card {
  background: #111318;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  padding: 40px;
  box-shadow: 0 32px 80px rgba(0,0,0,.5);
  position: relative;
  z-index: 1;
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.logo-icon {
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
}

.header-text h1 {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -.02em;
}

.header-text p {
  font-size: 13px;
  color: #475569;
  margin-top: 3px;
}

/* Imagem Preview */
.imagem-preview-section {
  margin-bottom: 24px;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 2px dashed rgba(255,255,255,.1);
  transition: border-color .2s;
  background: #0d0f14;
}

.preview-container:hover {
  border-color: rgba(99,102,241,.4);
}

.imagem-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #475569;
  gap: 10px;
}

.preview-placeholder svg {
  width: 40px;
  height: 40px;
}

.preview-placeholder span {
  font-size: 13px;
  font-weight: 500;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity .2s;
  color: #fff;
}

.preview-container:hover .preview-overlay {
  opacity: 1;
}

.preview-overlay svg {
  width: 24px;
  height: 24px;
}

.preview-overlay span {
  font-size: 13px;
  font-weight: 600;
}

.hidden-input {
  display: none;
}

.file-name {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #6366f1;
  text-align: center;
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 18px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 17px;
  height: 17px;
  color: #475569;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 2;
}

.input-icon svg { width: 100%; height: 100%; }

input, textarea {
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: #0d0f14;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 11px;
  color: #e2e8f0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  transition: border-color .2s, box-shadow .2s;
  outline: none;
}

input::placeholder, textarea::placeholder { color: #334155; }

input:focus, textarea:focus {
  border-color: rgba(99,102,241,.5);
  box-shadow: 0 0 0 3px rgba(99,102,241,.1);
}

/* Textarea específico */
.textarea-wrapper {
  align-items: flex-start;
}

textarea {
  padding: 12px 14px;
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

/* Ações */
.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-voltar, .btn-salvar {
  padding: 13px 20px;
  border-radius: 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all .18s;
  border: none;
}

.btn-voltar {
  background: rgba(255,255,255,.05);
  color: #94a3b8;
  border: 1px solid rgba(255,255,255,.08);
  flex: 1;
}

.btn-voltar:hover {
  background: rgba(255,255,255,.08);
  color: #e2e8f0;
}

.btn-salvar {
  background: #6366f1;
  color: #fff;
  flex: 2;
  box-shadow: 0 4px 20px rgba(99,102,241,.3);
}

.btn-salvar:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(99,102,241,.4);
}

.btn-salvar:disabled { opacity: .6; cursor: not-allowed; }
.btn-salvar svg, .btn-voltar svg { width: 16px; height: 16px; }

/* Spinner */
.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Toast */
.toast {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: center;
}

.toast.sucesso {
  background: rgba(34,197,94,.12);
  color: #4ade80;
  border: 1px solid rgba(34,197,94,.2);
}

.toast.erro {
  background: rgba(239,68,68,.12);
  color: #f87171;
  border: 1px solid rgba(239,68,68,.2);
}

/* Estados de loading/error */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: #475569;
}

.loading-state .spinner {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.error-state svg {
  width: 48px;
  height: 48px;
  color: #ef4444;
}

.error-state p {
  font-size: 15px;
  color: #94a3b8;
}

/* Fade */
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Responsivo */
@media (max-width: 480px) {
  .editar-card {
    padding: 24px;
  }
  
  .field-row {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-voltar, .btn-salvar {
    width: 100%;
  }
}
</style>