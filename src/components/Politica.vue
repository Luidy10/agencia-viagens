<template>
  <div class="privacy-page">

    <header class="header">
      <h1>Política de Privacidade</h1>
      <p>ViaPlan • Transparência, segurança e respeito aos seus dados</p>
      <span class="update">Última atualização: 2026</span>
    </header>

    <section class="content">

      <p class="intro">
        Na <strong>ViaPlan</strong>, valorizamos a sua privacidade e estamos comprometidos
        em proteger seus dados pessoais. Esta Política explica de forma clara como
        coletamos, usamos e protegemos suas informações.
      </p>

      <h2>1. Informações que coletamos</h2>
      <p>
        Coletamos dados pessoais fornecidos por você, como nome, e-mail, telefone,
        documentos e informações de pagamento ao utilizar nossos serviços, realizar
        reservas ou entrar em contato conosco.
      </p>

      <h2>2. Finalidade do uso dos dados</h2>
      <p>
        Seus dados são utilizados para:
      </p>
      <ul>
        <li>Processar reservas e pagamentos</li>
        <li>Gerenciar sua conta</li>
        <li>Oferecer suporte ao cliente</li>
        <li>Enviar comunicações importantes</li>
        <li>Melhorar sua experiência na plataforma</li>
      </ul>

      <h2>3. Compartilhamento de informações</h2>
      <p>
        Compartilhamos seus dados apenas quando necessário com parceiros como
        companhias aéreas, hotéis e operadoras de pagamento, sempre respeitando
        a legislação vigente.
      </p>

      <h2>4. Segurança das informações</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger seus dados contra
        acessos não autorizados, perda, alteração ou divulgação indevida.
      </p>

      <h2>5. Uso de cookies</h2>
      <p>
        Utilizamos cookies e tecnologias semelhantes para melhorar sua navegação,
        analisar o uso do site e personalizar conteúdos e ofertas.
      </p>

      <h2>6. Direitos do usuário</h2>
      <p>
        De acordo com a LGPD, você pode solicitar:
      </p>
      <ul>
        <li>Acesso aos seus dados</li>
        <li>Correção de informações</li>
        <li>Exclusão dos dados</li>
        <li>Revogação do consentimento</li>
      </ul>

      <h2>7. Retenção de dados</h2>
      <p>
        Seus dados serão armazenados apenas pelo tempo necessário para cumprir as
        finalidades descritas nesta política, respeitando obrigações legais.
      </p>

      <h2>8. Alterações nesta política</h2>
      <p>
        Esta Política pode ser atualizada a qualquer momento. Recomendamos a revisão
        periódica desta página.
      </p>

      <h2>9. Contato</h2>
      <p>
        Em caso de dúvidas ou solicitações relacionadas aos seus dados, entre em
        contato pelo e-mail: <strong>suporte@viaplan.com.br</strong>
      </p>

    </section>

  </div>
</template>

<script setup>
// Página estática
</script>

<style scoped>
.privacy-page {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #060d1a 0%, #0b1320 100%);
  color: #e6edf5;
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header h1 {
  font-size: 36px;
  font-weight: 500;
  color: #e8f4ff;
  margin-bottom: 0.5rem;
}

.header p {
  color: #94a3b8;
  font-size: 14px;
}

.update {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(200,216,234,0.5);
}

.content {
  max-width: 820px;
  margin: 0 auto;
  line-height: 1.8;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 2rem;
  border-radius: 12px;
}

.intro {
  margin-bottom: 1.5rem;
  font-size: 14px;
  color: #cbd5e1;
}

.content h2 {
  margin-top: 1.8rem;
  font-size: 18px;
  color: #60a5fa;
}

.content p {
  margin-top: 0.6rem;
  font-size: 14px;
  color: #cbd5e1;
}

.content ul {
  margin-top: 0.6rem;
  padding-left: 1.2rem;
  color: #cbd5e1;
}

.content li {
  margin-bottom: 6px;
  font-size: 14px;
}

@media (max-width: 600px) {
  .header h1 {
    font-size: 28px;
  }

  .content {
    padding: 1.5rem;
  }
}
</style>