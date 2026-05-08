<template>
  <div class="admin-container">
    <h1>Painel do Administrador</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Carregando dados...
    </div>

    <!-- Cards -->
    <div v-else class="cards">
      <div class="card users">
        <h3>👤 Usuários</h3>
        <p>{{ usuarios.length }}</p>
      </div>

      <div class="card comments">
        <h3>💬 Comentários</h3>
        <p>{{ comentarios.length }}</p>
      </div>

      <div class="card trips">
        <h3>✈️ Viagens</h3>
        <p>{{ viagens.length }}</p>
      </div>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="erro">
      {{ erro }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuarios: [],
      comentarios: [],
      viagens: [],
      loading: true,
      erro: null
    }
  },

  async mounted() {
    try {
      const usuario = JSON.parse(sessionStorage.getItem("usuario"))

      // 🔒 Proteção de rota
      if (!usuario || !usuario.admin) {
        this.$router.push("/")
        return
      }

      // 🚀 Requisições paralelas
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
      const [usuarios, comentarios, viagens] = await Promise.all([
        fetch(`${API_URL}/usuarios`).then(r => r.json()),
        fetch(`${API_URL}/comentarios`).then(r => r.json()),
        fetch(`${API_URL}/viagens`).then(r => r.json())
      ])

      this.usuarios = usuarios
      this.comentarios = comentarios
      this.viagens = viagens

    } catch (e) {
      console.error(e)
      this.erro = "Erro ao carregar dados 😢"
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 40px;
  background: #f5f7fa;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

/* GRID RESPONSIVO */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

/* CARD BASE */
.card {
  padding: 25px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  text-align: center;
}

.card p {
  font-size: 28px;
  margin-top: 10px;
}

/* HOVER */
.card:hover {
  transform: translateY(-5px) scale(1.02);
}

/* CORES */
.users {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.comments {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.trips {
  background: linear-gradient(135deg, #fa709a, #fee140);
}

/* LOADING */
.loading {
  font-size: 18px;
  color: #555;
}

/* ERRO */
.erro {
  margin-top: 20px;
  color: red;
  font-weight: bold;
}
</style>