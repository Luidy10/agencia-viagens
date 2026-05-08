<template>
  <div class="help-center">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-inner">
        <div class="hero-badge">Central de Ajuda</div>
        <h1>Como podemos<br/><em>ajudar você?</em></h1>
        <p>Respostas rápidas para reservas, destinos, pagamentos e muito mais.</p>
        <div class="search-wrap">
          <span class="search-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ex: cancelar reserva, visto, reembolso..."
            aria-label="Buscar na central de ajuda"
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''" aria-label="Limpar">✕</button>
        </div>
        <div class="hero-tags">
          <span>Popular:</span>
          <button v-for="tag in popularTags.slice(0,5)" :key="tag" @click="applyTag(tag)" class="hero-tag">{{ tag }}</button>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat">
        <strong>32</strong>
        <span>artigos</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <strong>8</strong>
        <span>categorias</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <strong>&lt; 24h</strong>
        <span>tempo de resposta</span>
      </div>
    </div>

    <!-- Body -->
    <div class="body-wrap">

      <!-- Sidebar -->
      <aside class="sidebar">
        <p class="sidebar-label">Categorias</p>
        <nav class="sidebar-nav">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="sidebar-item"
            :class="{ active: activeCategory === cat.id }"
            @click="setCategory(cat.id)"
          >
            <span class="sidebar-icon" v-html="cat.icon"></span>
            <span class="sidebar-title">{{ cat.title }}</span>
            <span class="sidebar-count">{{ countByCategory(cat.id) }}</span>
          </button>
        </nav>

        <div class="sidebar-contact">
          <p class="sidebar-label" style="margin-top:0">Suporte direto</p>
          <a href="mailto:suporte@viaplan.com.br" class="sidebar-email-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            suporte@viaplan.com.br
          </a>
          <p class="sidebar-hours">Seg–Sex 8h–20h · Sáb 9h–14h</p>
        </div>
      </aside>

      <!-- Main -->
      <main class="main-content">

        <!-- FAQ header -->
        <div class="faq-topbar">
          <div class="faq-topbar-left">
            <h2 class="faq-heading">{{ activeCategoryLabel }}</h2>
            <span class="faq-badge">{{ filteredFaqs.length }} perguntas</span>
          </div>
          <button v-if="activeCategory !== 'todos' || searchQuery" class="reset-btn" @click="resetFilters">
            ✕ Limpar filtros
          </button>
        </div>

        <!-- FAQ list -->
        <div class="faq-list">
          <div
            v-for="faq in filteredFaqs"
            :key="faq.id"
            class="faq-item"
            :class="{ open: openFaq === faq.id }"
          >
            <button class="faq-q" @click="toggleFaq(faq.id)" :aria-expanded="openFaq === faq.id">
              <div class="faq-q-left">
                <span class="faq-dot" :style="{ background: catColor(faq.cat) }"></span>
                <span>{{ faq.q }}</span>
              </div>
              <svg class="faq-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="faq-a" :style="{ maxHeight: openFaq === faq.id ? '400px' : '0' }">
              <div class="faq-a-inner">
                <p>{{ faq.a }}</p>
                <a v-if="faq.link" :href="faq.link.href" class="faq-link">{{ faq.link.label }} →</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredFaqs.length === 0" class="no-results">
          <span class="no-icon">🌊</span>
          <p>Nenhum resultado para <strong>"{{ searchQuery }}"</strong></p>
          <span>Tente outros termos ou entre em contato com nosso suporte.</span>
          <a href="mailto:suporte@viaplan.com.br" class="no-cta">Enviar e-mail ao suporte →</a>
        </div>

        <!-- Tags -->
        <div class="tags-section">
          <p class="tags-label">Buscas populares</p>
          <div class="tag-row">
            <button
              v-for="tag in popularTags"
              :key="tag"
              class="tag"
              :class="{ 'tag-active': searchQuery === tag }"
              @click="applyTag(tag)"
            >{{ tag }}</button>
          </div>
        </div>

      </main>
    </div>

    <!-- Footer CTA -->
    <section class="footer-cta">
      <div class="footer-cta-inner">
        <div class="footer-cta-text">
          <h3>Ainda tem dúvidas?</h3>
          <p>Nossa equipe está pronta para ajudar. Respondemos em até 24 horas úteis.</p>
        </div>
        <a href="mailto:suporte@viaplan.com.br" class="footer-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          Enviar mensagem
        </a>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const activeCategory = ref('todos')
const openFaq = ref(null)

const icons = {
  todos:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  reservas:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  pagamentos: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  destinos:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  conta:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  seguro:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  voos:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 10a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 2.08 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  suporte:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
}

const categories = [
  { id: 'todos',      icon: icons.todos,      title: 'Todos os tópicos'   },
  { id: 'reservas',   icon: icons.reservas,   title: 'Reservas'            },
  { id: 'pagamentos', icon: icons.pagamentos, title: 'Pagamentos'          },
  { id: 'destinos',   icon: icons.destinos,   title: 'Destinos & Roteiros' },
  { id: 'conta',      icon: icons.conta,      title: 'Minha Conta'         },
  { id: 'seguro',     icon: icons.seguro,     title: 'Seguro Viagem'       },
  { id: 'voos',       icon: icons.voos,       title: 'Voos & Hospedagem'   },
  { id: 'suporte',    icon: icons.suporte,    title: 'Suporte & Contato'   },
]

const catColors = {
  reservas:   '#60a5fa',
  pagamentos: '#34d399',
  destinos:   '#fb923c',
  conta:      '#a78bfa',
  seguro:     '#fbbf24',
  voos:       '#38bdf8',
  suporte:    '#f472b6',
}

const faqs = [
  { id: 1,  cat: 'reservas',   q: 'Como faço para criar uma reserva?',
    a: 'Acesse "Nova viagem" no menu principal, escolha o destino, as datas desejadas e o número de viajantes. Após confirmar os dados, você receberá um resumo completo por e-mail com o código da sua reserva.' },
  { id: 2,  cat: 'reservas',   q: 'Posso alterar a data da minha reserva?',
    a: 'Sim! Alterações são permitidas até 48h antes do embarque sem custo adicional. Acesse "Minhas viagens", selecione a reserva desejada e clique em "Alterar data". Após esse prazo, pode haver cobrança de taxa conforme o fornecedor.' },
  { id: 3,  cat: 'reservas',   q: 'Como cancelo uma reserva?',
    a: 'Vá em "Minhas viagens", selecione a reserva e clique em "Cancelar reserva". O reembolso segue a política de cancelamento do fornecedor. Reservas canceladas com mais de 72h de antecedência geralmente têm reembolso integral.' },
  { id: 4,  cat: 'reservas',   q: 'Posso adicionar mais viajantes após a reserva?',
    a: 'Depende da disponibilidade de vagas. Abra a reserva e clique em "Adicionar viajante". Se a opção não aparecer, não há mais vagas. Nesse caso, entre em contato com nosso suporte.' },
  { id: 5,  cat: 'reservas',   q: 'Como acompanho o status da minha reserva?',
    a: 'Acesse "Minhas viagens" no menu do perfil. Lá você verá todas as reservas com o status: Pendente, Confirmada, Em andamento ou Concluída. Você também recebe atualizações automáticas por e-mail.' },
  { id: 6,  cat: 'pagamentos', q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos cartão de crédito (Visa, Mastercard, Elo e Amex) em até 12x, cartão de débito, Pix (aprovação imediata) e boleto bancário (vencimento em 3 dias úteis). Parcelamentos acima de 6x podem ter juros.' },
  { id: 7,  cat: 'pagamentos', q: 'Como solicitar reembolso?',
    a: 'Após o cancelamento aprovado, o reembolso é automático. Para Pix e débito, até 7 dias úteis. Para cartão de crédito, o estorno aparece em até 2 faturas seguintes. Acompanhe no histórico de pagamentos do perfil.' },
  { id: 8,  cat: 'pagamentos', q: 'Meu pagamento foi recusado. O que fazer?',
    a: 'Verifique os dados do cartão (número, validade, CVV) e o limite disponível. Se persistir, tente outra forma de pagamento ou entre em contato com sua operadora e nosso suporte.' },
  { id: 9,  cat: 'pagamentos', q: 'Existe parcelamento sem juros?',
    a: 'Sim! Até 6x sem juros no cartão de crédito para compras acima de R$ 500. A partir da 7ª parcela, juros de 1,99% ao mês. O valor é exibido antes da confirmação.' },
  { id: 10, cat: 'pagamentos', q: 'Como obtenho a nota fiscal da compra?',
    a: 'A nota fiscal é enviada por e-mail após o pagamento confirmado. Você também pode baixá-la em "Minhas viagens" > selecionar a reserva > "Documentos".' },
  { id: 11, cat: 'destinos',   q: 'Preciso de visto para viajar ao exterior?',
    a: 'Depende do destino e da sua nacionalidade. Na página de cada destino exibimos os requisitos atualizados. Para brasileiros: EUA, Canadá e Austrália exigem visto. Europa Schengen não exige para estadas de até 90 dias.' },
  { id: 12, cat: 'destinos',   q: 'Vocês oferecem roteiros personalizados?',
    a: 'Sim! Acesse "Montar roteiro", informe interesses, orçamento, datas e número de viajantes. Nosso assistente cria sugestões sob medida e você pode ajustar cada detalhe antes de finalizar.' },
  { id: 13, cat: 'destinos',   q: 'Quais são os destinos mais procurados?',
    a: 'Os mais populares na Via Plan: Fernando de Noronha, Gramado, Lisboa, Cancún, Buenos Aires, Maldivas e Patagônia. Acesse "Destinos em alta" para promoções e dicas atualizadas.' },
  { id: 14, cat: 'destinos',   q: 'Como funcionam as dicas de viagem?',
    a: 'Cada destino tem um guia completo: melhor época para visitar, atrações imperdíveis, restaurantes, transporte local, moeda e câmbio. Conteúdo atualizado mensalmente pela nossa equipe.' },
  { id: 15, cat: 'destinos',   q: 'Vocês organizam viagens em grupo?',
    a: 'Sim! Grupos acima de 10 pessoas têm condições especiais e consultor dedicado. Envie e-mail para suporte@viaplan.com.br com o assunto "Viagem em grupo" para receber uma proposta.' },
  { id: 16, cat: 'conta',      q: 'Esqueci minha senha. Como recuperar?',
    a: 'Na tela de login, clique em "Esqueci minha senha" e insira o e-mail cadastrado. Você receberá um link de redefinição em até 5 minutos. Verifique o spam. O link expira em 30 minutos.' },
  { id: 17, cat: 'conta',      q: 'Como atualizar meus dados pessoais?',
    a: 'Acesse "Meu perfil" no menu superior e clique em "Editar informações". Você pode atualizar nome, telefone, endereço e preferências. O e-mail só pode ser alterado com confirmação de segurança.' },
  { id: 18, cat: 'conta',      q: 'Como excluir minha conta?',
    a: 'Acesse "Configurações" > "Privacidade" > "Excluir conta". Reservas ativas precisam ser canceladas antes. Os dados são removidos em até 30 dias conforme a LGPD.' },
  { id: 19, cat: 'conta',      q: 'Posso ter mais de um perfil de viajante?',
    a: 'Sim! Em "Meu perfil" > "Viajantes", cadastre perfis para familiares ou companheiros com documentos e preferências próprias, facilitando futuras reservas.' },
  { id: 20, cat: 'seguro',     q: 'O seguro viagem é obrigatório?',
    a: 'Para Europa (Schengen), Cuba e alguns países da América do Norte é exigido por lei. Para demais destinos não é obrigatório, mas é altamente recomendado.' },
  { id: 21, cat: 'seguro',     q: 'O que o seguro viagem cobre?',
    a: 'Os planos Via Plan cobrem: assistência médica e hospitalar, cancelamento por imprevistos, extravio de bagagem, atraso de voo acima de 6h e assistência jurídica. A cobertura varia conforme o plano.' },
  { id: 22, cat: 'seguro',     q: 'Como acionar o seguro durante a viagem?',
    a: 'Acesse o app Via Plan > "Minha viagem" > "Acionar seguro", ou ligue para a central 24h indicada no voucher. Tenha em mãos: número da apólice, passaporte e documentos do ocorrido.' },
  { id: 23, cat: 'seguro',     q: 'Posso contratar o seguro depois da reserva?',
    a: 'Sim, até 24h antes do embarque. Para garantir cobertura de cancelamento por imprevistos pré-viagem, recomendamos contratar logo após a reserva.' },
  { id: 24, cat: 'voos',       q: 'Vocês vendem passagens aéreas?',
    a: 'Sim! Busque em "Passagens aéreas" no menu. Trabalhamos com as principais companhias nacionais e internacionais. Combine voo + hotel para obter melhores preços nos pacotes.' },
  { id: 25, cat: 'voos',       q: 'Como funciona o check-in online?',
    a: 'O check-in online é feito no site ou app da companhia aérea, geralmente entre 48h e 2h antes do voo. Enviamos um lembrete por e-mail com o link da sua companhia no dia anterior.' },
  { id: 26, cat: 'voos',       q: 'Qual o limite de bagagem permitido?',
    a: 'O limite varia por companhia e tipo de tarifa. As informações estão detalhadas no voucher do seu voo. Em geral, tarifas econômicas básicas nacionais não incluem bagagem despachada.' },
  { id: 27, cat: 'voos',       q: 'Como escolho meu hotel na Via Plan?',
    a: 'Filtre por destino, datas, hóspedes, categoria (estrelas), preço e comodidades. Exibimos fotos reais, avaliações verificadas e a política de cancelamento antes da confirmação.' },
  { id: 28, cat: 'voos',       q: 'O hotel pode ter política diferente de cancelamento?',
    a: 'Sim. Cada propriedade define sua política. Na página do hotel exibimos se o cancelamento é gratuito (e até quando), reembolsável parcialmente ou não reembolsável.' },
  { id: 29, cat: 'suporte',    q: 'Qual o horário de atendimento da Via Plan?',
    a: 'Suporte por e-mail: segunda a sexta das 8h às 20h, sábados das 9h às 14h. Respondemos em até 24 horas úteis. Para emergências na viagem, consulte o número 24h do seu seguro.' },
  { id: 30, cat: 'suporte',    q: 'Como entro em contato com o suporte?',
    a: 'Envie e-mail para suporte@viaplan.com.br com detalhes da sua dúvida e o código da reserva, se houver. Respondemos em até 24 horas úteis.',
    link: { label: 'Enviar e-mail agora', href: 'mailto:suporte@viaplan.com.br' } },
  { id: 31, cat: 'suporte',    q: 'Como faço uma reclamação formal?',
    a: 'Envie e-mail para suporte@viaplan.com.br com o assunto "Reclamação" e descreva o ocorrido com todos os detalhes. Nossa equipe de qualidade analisa em até 5 dias úteis e retorna com uma solução.' },
  { id: 32, cat: 'suporte',    q: 'Vocês têm programa de fidelidade?',
    a: 'Ainda não temos programa de pontos próprio, mas trabalhamos com fornecedores dos principais programas de milhas. Em breve: Via Plan Rewards — cadastre seu e-mail para ser o primeiro a saber!' },
]

const popularTags = ['Cancelamento', 'Reembolso', 'Visto', 'Seguro', 'Pix', 'Bagagem', 'Roteiro', 'Senha', 'Check-in', 'Pacote']

const filteredFaqs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return faqs.filter(f => {
    const matchCat = activeCategory.value === 'todos' || f.cat === activeCategory.value
    const matchSearch = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    return matchCat && matchSearch
  })
})

const activeCategoryLabel = computed(() => {
  if (activeCategory.value === 'todos') return 'Todas as perguntas'
  return categories.find(c => c.id === activeCategory.value)?.title ?? ''
})

function countByCategory(id) {
  if (id === 'todos') return faqs.length
  return faqs.filter(f => f.cat === id).length
}

function catColor(cat) { return catColors[cat] ?? '#60a5fa' }

function setCategory(id) {
  activeCategory.value = id
  openFaq.value = null
}

function toggleFaq(id) {
  openFaq.value = openFaq.value === id ? null : id
}

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'todos'
  openFaq.value = null
}

function applyTag(tag) {
  searchQuery.value = searchQuery.value === tag ? '' : tag
  activeCategory.value = 'todos'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ─── Base ─── */
.help-center {
  font-family: 'Inter', sans-serif;
  background: #060d1a;
  color: #c8d8ea;
  min-height: 100vh;
}

/* ─── Hero ─── */
.hero {
  position: relative;
  overflow: hidden;
  padding: 5rem 2.5rem 4rem;
  background: linear-gradient(180deg, #061229 0%, #060d1a 100%);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.hero-orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(24,95,165,0.25) 0%, transparent 70%);
  top: -150px;
  right: -100px;
}

.hero-orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%);
  bottom: -80px;
  left: 100px;
}

.hero-inner {
  position: relative;
  max-width: 620px;
  margin: 0 auto;
  text-align: center;
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
}

.hero h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px;
  font-weight: 400;
  line-height: 1.15;
  color: #e8f4ff;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
}

.hero h1 em {
  font-style: italic;
  color: #60a5fa;
}

.hero p {
  font-size: 15px;
  color: rgba(200,216,234,0.65);
  margin-bottom: 2rem;
  line-height: 1.6;
  font-weight: 300;
}

.search-wrap {
  position: relative;
  max-width: 520px;
  margin: 0 auto 1.25rem;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #60a5fa;
  display: flex;
  pointer-events: none;
}

.search-wrap input {
  width: 100%;
  padding: 14px 44px 14px 46px;
  border-radius: 10px;
  border: 1px solid rgba(96,165,250,0.2);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 300;
  background: rgba(255,255,255,0.04);
  color: #e8f4ff;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  letter-spacing: 0.01em;
}
.search-wrap input::placeholder { color: rgba(200,216,234,0.35); }
.search-wrap input:focus {
  border-color: rgba(96,165,250,0.5);
  background: rgba(255,255,255,0.06);
  box-shadow: 0 0 0 3px rgba(96,165,250,0.08);
}

.clear-btn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(200,216,234,0.4);
  cursor: pointer;
  font-size: 13px;
  padding: 2px;
  line-height: 1;
}
.clear-btn:hover { color: #e8f4ff; }

.hero-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.hero-tags span {
  font-size: 12px;
  color: rgba(200,216,234,0.4);
}

.hero-tag {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  padding: 4px 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  color: rgba(200,216,234,0.6);
  cursor: pointer;
  transition: all 0.15s;
}
.hero-tag:hover { border-color: rgba(96,165,250,0.4); color: #60a5fa; background: rgba(96,165,250,0.07); }

/* ─── Stats bar ─── */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 1.25rem 2rem;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat strong {
  font-size: 18px;
  font-weight: 500;
  color: #e8f4ff;
  font-family: 'Cormorant Garamond', serif;
}

.stat span {
  font-size: 12px;
  color: rgba(200,216,234,0.45);
}

.stat-divider {
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.08);
}

/* ─── Body ─── */
.body-wrap {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 0;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 2.5rem 3rem;
  align-items: start;
}

/* ─── Sidebar ─── */
.sidebar {
  position: sticky;
  top: 20px;
  padding-right: 2rem;
  border-right: 1px solid rgba(255,255,255,0.06);
}

.sidebar-label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(200,216,234,0.35);
  margin-bottom: 10px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 2rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.15s;
  color: rgba(200,216,234,0.6);
  font-family: 'Inter', sans-serif;
}

.sidebar-item:hover { background: rgba(255,255,255,0.04); color: #c8d8ea; }
.sidebar-item.active { background: rgba(96,165,250,0.1); color: #e8f4ff; }

.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.sidebar-item:hover .sidebar-icon { opacity: 1; }
.sidebar-item.active .sidebar-icon { opacity: 1; color: #60a5fa; }

.sidebar-title { font-size: 13px; flex: 1; }
.sidebar-count {
  font-size: 11px;
  background: rgba(255,255,255,0.07);
  padding: 1px 7px;
  border-radius: 10px;
  color: rgba(200,216,234,0.5);
}

.sidebar-item.active .sidebar-count {
  background: rgba(96,165,250,0.15);
  color: #60a5fa;
}

.sidebar-contact {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.sidebar-email-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #60a5fa;
  text-decoration: none;
  margin-bottom: 6px;
  transition: opacity 0.15s;
}
.sidebar-email-btn:hover { opacity: 0.8; }

.sidebar-hours {
  font-size: 11px;
  color: rgba(200,216,234,0.35);
  line-height: 1.5;
}

/* ─── Main Content ─── */
.main-content {
  padding-left: 2.5rem;
}

.faq-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.faq-topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.faq-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 500;
  color: #e8f4ff;
  letter-spacing: 0.01em;
}

.faq-badge {
  font-size: 11px;
  padding: 2px 10px;
  background: rgba(96,165,250,0.12);
  color: #60a5fa;
  border-radius: 20px;
  border: 1px solid rgba(96,165,250,0.2);
}

.reset-btn {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(200,216,234,0.45);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.reset-btn:hover { color: #c8d8ea; }

/* ─── FAQ List ─── */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 2.5rem;
}

.faq-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
}

.faq-item:hover { border-color: rgba(96,165,250,0.2); background: rgba(255,255,255,0.04); }
.faq-item.open  { border-color: rgba(96,165,250,0.35); background: rgba(96,165,250,0.04); }

.faq-q {
  width: 100%;
  padding: 14px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #c8d8ea;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  text-align: left;
  transition: color 0.15s;
}
.faq-item.open .faq-q { color: #e8f4ff; }

.faq-q-left {
  display: flex;
  align-items: center;
  gap: 11px;
}

.faq-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.9;
}

.faq-chevron {
  flex-shrink: 0;
  color: rgba(200,216,234,0.35);
  transition: transform 0.25s ease, color 0.15s;
}
.faq-item.open .faq-chevron { transform: rotate(180deg); color: #60a5fa; }

.faq-a {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}

.faq-a-inner {
  font-size: 13px;
  color: rgba(200,216,234,0.65);
  padding: 0 16px 16px 34px;
  border-top: 1px solid rgba(255,255,255,0.05);
  line-height: 1.8;
  font-weight: 300;
}

.faq-a-inner p { margin-bottom: 8px; }

.faq-link {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  color: #60a5fa;
  text-decoration: none;
  margin-top: 6px;
  transition: opacity 0.15s;
}
.faq-link:hover { opacity: 0.75; }

/* ─── No results ─── */
.no-results {
  text-align: center;
  padding: 3.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
}
.no-icon { font-size: 38px; }
.no-results p { font-size: 15px; color: #c8d8ea; }
.no-results span { font-size: 13px; color: rgba(200,216,234,0.45); }
.no-cta {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #60a5fa;
  text-decoration: none;
}
.no-cta:hover { text-decoration: underline; }

/* ─── Tags ─── */
.tags-section { margin-top: 0.5rem; }

.tags-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(200,216,234,0.35);
  margin-bottom: 10px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  padding: 5px 13px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  color: rgba(200,216,234,0.55);
  cursor: pointer;
  transition: all 0.15s;
}
.tag:hover { border-color: rgba(96,165,250,0.4); color: #60a5fa; background: rgba(96,165,250,0.07); }
.tag.tag-active { border-color: #60a5fa; background: rgba(96,165,250,0.15); color: #60a5fa; }

/* ─── Footer CTA ─── */
.footer-cta {
  background: linear-gradient(135deg, #061229 0%, #0a1f3d 100%);
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 3rem 2.5rem;
}

.footer-cta-inner {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-cta-text h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 400;
  color: #e8f4ff;
  margin-bottom: 6px;
}

.footer-cta-text p {
  font-size: 14px;
  color: rgba(200,216,234,0.5);
  font-weight: 300;
}

.footer-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #185FA5;
  color: #e8f4ff;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition: background 0.15s, transform 0.1s;
  flex-shrink: 0;
}
.footer-btn:hover { background: #1a6fc0; transform: translateY(-1px); }

/* ─── Responsive ─── */
@media (max-width: 720px) {
  .hero h1 { font-size: 36px; }
  .body-wrap { grid-template-columns: 1fr; padding: 1.5rem 1.25rem 2rem; }
  .sidebar { position: static; padding-right: 0; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
  .sidebar-nav { display: grid; grid-template-columns: repeat(2, 1fr); }
  .main-content { padding-left: 0; }
  .stats-bar { gap: 1.5rem; }
  .footer-cta-inner { flex-direction: column; }
  .footer-btn { width: 100%; justify-content: center; }
}
</style>