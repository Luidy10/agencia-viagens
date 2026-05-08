<template>
  <div class="terms-page">

    <!-- HERO -->
    <section class="hero">
      <h1>Termos de Uso</h1>
      <p>Leia atentamente as condições para utilizar a ViaPlan</p>
      <span>Atualizado em 2026</span>
    </section>

    <!-- CONTEÚDO EM CARDS -->
    <section class="terms-container">
      <div class="term-card" v-for="term in terms" :key="term.title">
        <h2>{{ term.title }}</h2>
        <p>{{ term.text }}</p>
      </div>
    </section>

  </div>
</template>

<script setup>
const terms = [
  {
    title: '1. Aceitação dos Termos',
    text: 'Ao acessar a ViaPlan, você concorda integralmente com estes termos e com nossa Política de Privacidade.'
  },
  {
    title: '2. Uso da Plataforma',
    text: 'Você se compromete a utilizar a plataforma de forma legal, ética e sem prejudicar outros usuários ou o sistema.'
  },
  {
    title: '3. Conta do Usuário',
    text: 'A segurança da sua conta é sua responsabilidade. Todas as ações realizadas serão atribuídas ao usuário.'
  },
  {
    title: '4. Pagamentos',
    text: 'Os preços podem variar conforme disponibilidade. A confirmação ocorre apenas após a finalização da compra.'
  },
  {
    title: '5. Cancelamentos',
    text: 'As regras de cancelamento e reembolso dependem dos fornecedores parceiros.'
  },
  {
    title: '6. Responsabilidade',
    text: 'A ViaPlan atua como intermediadora e não se responsabiliza por falhas de terceiros.'
  },
  {
    title: '7. Propriedade Intelectual',
    text: 'Todo o conteúdo da plataforma é protegido por direitos autorais.'
  },
  {
    title: '8. Suspensão de Conta',
    text: 'Contas podem ser suspensas em caso de uso indevido ou violação dos termos.'
  },
  {
    title: '9. Alterações',
    text: 'Os termos podem ser atualizados a qualquer momento sem aviso prévio.'
  },
]
</script>

<style scoped>
.terms-page {
  font-family: 'Inter', sans-serif;
  background: #070305;
  color: #e6edf5;
  min-height: 100vh;
}

/* HERO */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #0a1f3d, #050b18);
}

.hero h1 {
  font-size: 42px;
  margin-bottom: 10px;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: -0.5px;
}

.hero p {
  color: #94a3b8;
}

.hero span {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}

/* CARDS */
.terms-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.term-card {
  background: rgba(226, 24, 24, 0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 1.5rem;
  transition: 0.3s;
}

.term-card:hover {
  transform: translateY(-5px);
  border-color: #60a5fa;
}

.term-card h2 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #60a5fa;
}

.term-card p {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.6;
}
</style>