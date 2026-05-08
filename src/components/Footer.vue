<template>
  <footer class="footer">
    <div class="footer-noise"></div>
    <div class="footer-orb-left"></div>
    <div class="footer-orb-right"></div>

    <div class="footer-inner">

      <!-- TOP -->
      <div class="footer-top">

        <!-- MARCA -->
        <div class="footer-brand">
          <div class="brand">
            <span class="brand-icon">✦</span>
            <span class="brand-name">ViaPlan</span>
          </div>
          <p class="brand-desc">
            Explore o mundo com conforto, segurança e experiências que ficam para sempre na memória.
          </p>
          <div class="social">
            <a href="https://pt-br.facebook.com/" class="social-btn" aria-label="Facebook">
              <Facebook :size="16" />
            </a>
            <a href="https://www.instagram.com/" class="social-btn" aria-label="Instagram">
              <Instagram :size="16" />
            </a>
            <a href="https://live.twitter.com/" class="social-btn" aria-label="Twitter">
              <Twitter :size="16" />
            </a>
          </div>
        </div>

        <!-- LINKS -->
        <div class="footer-col">
          <h4 class="col-title">Empresa</h4>
          <a href="/SobreNos" class="col-link">Sobre nós</a>
          <a href="/Destinos" class="col-link">Destinos</a>
          <a href="/comentario" class="col-link">Comentarios</a>
           <a href="/contato" class="col-link">Contato</a>
        </div>

        <!-- SUPORTE -->
        <div class="footer-col">
          <h4 class="col-title">Suporte</h4>
          <a href="/central" class="col-link">Central de ajuda</a>
          <a href="/politica" class="col-link">Política de Privacidade</a>
          <a href="/termos" class="col-link">Termos de Uso</a>
        </div>

        <!-- CONTATO -->
        <div class="footer-col">
          <h4 class="col-title">Contato</h4>
          <a href="https://wa.me/5531988836094" class="col-contact">
            <span class="contact-icon"><Phone :size="13" /></span>
            (31) 9 9063-3837
          </a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=viaplan.contato@gmail.com&su=Contato%20ViaPlan&body=Olá,%20gostaria%20de%20informações" class="col-contact">
            <span class="contact-icon"><Mail :size="13" /></span>
            viaplan.contato@gmail.com
          </a>
        </div>

      </div>

      <!-- DIVIDER -->
      <div class="footer-divider"></div>

      <!-- BOTTOM -->
      <div class="footer-bottom">
        <span>© 2026 ViaPlan — Todos os direitos reservados</span>
        <div class="bottom-badge">
          <span class="badge-dot"></span>
          Viagens seguras e garantidas
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-vue-next"
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');

.footer {
  position: relative;
  background: #05080f;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
}

/* Background effects */
.footer-noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.035; pointer-events: none;
}
.footer-orb-left {
  position: absolute;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(196,155,80,0.1) 0%, transparent 65%);
  bottom: -200px; left: -100px;
  pointer-events: none;
}
.footer-orb-right {
  position: absolute;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(100,180,255,0.06) 0%, transparent 65%);
  top: -100px; right: -60px;
  pointer-events: none;
}

.footer-inner {
  position: relative; z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 40px 32px;
}

/* TOP GRID */
.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 52px;
}

/* BRAND */
.brand {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 18px;
}
.brand-icon { color: #c49b50; font-size: 18px; }
.brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem; font-weight: 600;
  color: #e8dcc8; letter-spacing: 0.5px;
}
.brand-desc {
  font-size: 13.5px; font-weight: 300;
  color: #4a5568; line-height: 1.75;
  margin-bottom: 28px;
  max-width: 280px;
}

/* SOCIAL */
.social { display: flex; gap: 10px; }
.social-btn {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.2s;
}
.social-btn:hover {
  background: rgba(196,155,80,0.1);
  border-color: rgba(196,155,80,0.3);
  color: #c49b50;
  transform: translateY(-2px);
}

/* COLUMNS */
.footer-col { display: flex; flex-direction: column; gap: 0; }
.col-title {
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 2px;
  color: #c49b50; margin-bottom: 20px;
}
.col-link {
  font-size: 13.5px; font-weight: 300;
  color: #4a5568;
  text-decoration: none;
  padding: 5px 0;
  transition: color 0.2s, padding-left 0.2s;
  display: block;
}
.col-link:hover {
  color: #e8dcc8;
  padding-left: 5px;
}

.col-contact {
  display: flex; align-items: center; gap: 10px;
  font-size: 13.5px; font-weight: 300;
  color: #4a5568; text-decoration: none;
  padding: 6px 0;
  transition: color 0.2s;
}
.col-contact:hover { color: #e8dcc8; }
.contact-icon {
  width: 28px; height: 28px;
  background: rgba(196,155,80,0.08);
  border: 1px solid rgba(196,155,80,0.15);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #c49b50; flex-shrink: 0;
}

/* DIVIDER */
.footer-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin-bottom: 28px;
}

/* BOTTOM */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px; font-weight: 300;
  color: #2d3748;
}
.bottom-badge {
  display: flex; align-items: center; gap: 7px;
  font-size: 11.5px; color: #3d4f63;
}
.badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 2px rgba(52,211,153,0.15);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
  .footer-brand { grid-column: 1 / -1; }
  .footer-inner { padding: 48px 20px 28px; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
}

@media (max-width: 520px) {
  .footer-top { grid-template-columns: 1fr; }
}
</style>