<template>
  <div class="fundo-turismo">
    <div class="turismo-container">
      <h1>Lugares para Turismo</h1>
      <p>Explore destinos incríveis ao redor do mundo!</p>

      <div class="cards-container">
        <div class="card" v-for="destino in destinos" :key="destino.nome">
          <img :src="destino.img" :alt="destino.nome" />
          <h2>{{ destino.nome }}</h2>
          <router-link :to="destino.link" class="btn-detalhes">Detalhes</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Turismo",
  data() {
    return {
      destinos: [
        { nome: "Paris", img: "/img/Paris.jpg", link: "/Paris" },
        { nome: "Rio de Janeiro", img: "/img/Rio.jpg", link: "/Rio" },
        { nome: "Tokyo", img: "/img/Tokyo.jpg", link: "/Tokyo" },
        { nome: "Nova York", img: "/img/Nova-york.jpg", link: "/Nova-york" },
        { nome: "Londres", img: "/img/Londres.jpg", link: "/Londres" },
        { nome: "Canadá", img: "/img/canada.jpg", link: "/Canada" },
        { nome: "Egito", img: "/img/egito.jpg", link: "/Egito" },
        { nome: "Venezuela", img: "/img/venezuela.jpg", link: "/Venezuela" },
        { nome: "Roma", img: "/img/roma.jpg", link: "/Roma" },
        { nome: "Portugal", img: "/img/portugal.jpg", link: "/Portugal" },
      ],
    };
  },
};
</script>

<style scoped>
.fundo-turismo {
  min-height: 100vh;
  background-image: url('/img/Navefundo.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 20px;
}

.turismo-container {
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
}

.turismo-container h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.turismo-container p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card:hover {
  transform: translateY(-10px);
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card h2 {
  padding: 1rem 0 0.5rem;
  font-size: 1.3rem;
  color: #2c3e50;
}

.btn-detalhes {
  
  display: inline-block;
  margin: 1rem 0 1.5rem;
  padding: 10px 20px;
 background: linear-gradient(135deg, #0077ff, #00c6ff);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-detalhes:hover {
 background: linear-gradient(135deg, #00c6ff, #0077ff);
}

</style>
