import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Viagens from "../views/Viagens.vue";
import Pagamentos from "../views/Pagamentos.vue";
import AdminDashboard from "@/components/AdminDashboard.vue"
import ViagensAdmin from "@/components/ViagensAdmin.vue"
import DestinosAdmin from "@/components/DestinosAdmin.vue"
import Comentarios from '@/views/Comentarios.vue';
import HistoricoViagens from "@/components/HistoricoViagens.vue"
import CarrosselDestinos from '@/components/CarrosselDestinos.vue';

const routes = [
  // 🔹 Página inicial
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: "/historico",
    name: "Historico", 
    component: HistoricoViagens 
  },
  // 🔹 Páginas principais
  {
    path: '/Turismo',
    name: 'Turismo',
    component: () => import('../views/Turismo.vue'),
  },
  {
    path: '/Comentario',
    name: 'Comentario',
    component: () => import('../views/Comentarios.vue'),
  },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, admin: true }
  },
  {
    path: "/admin/viagens",
    component: ViagensAdmin,
    meta: { requiresAuth: true, admin: true }
  },
  {
    path: "/destinos/editar/:id",
    name: "EditarDestino",
    component: () => import("@/views/EditarDestino.vue"),
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/destinos",
    component: DestinosAdmin,
    meta: { requiresAuth: true, admin: true }
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: "/viagens",
    name: "Viagens",
    component: Viagens,
    meta: { requiresAuth: true }
  },
  {
    path: "/Carrosel",
    name: "Carrosel",
    component: CarrosselDestinos,
  },
  {
    path: '/pagamento',
    name: 'Pagamentos',
    component: () => import('../views/Pagamentos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Destinos',
    name: 'Destinos',
    component: () => import('@/views/Destinos.vue'),
  },
  // 🔹 Outras páginas
  {
    path: '/Perfil',
    name: 'Perfil',
    component: () => import('../components/Perfil.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/SobreNos',
    name: 'SobreNos',
    component: () => import('../components/SobreNos.vue'),
  },

  // 🔹 Sistema de Cadastro / Conta
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('@/views/Cadastro/Cadastro.vue'),
  },
  {
    path: '/conta',
    name: 'Conta',
    component: () => import('@/views/Cadastro/Conta.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/entrar',
    name: 'Entrar',
    component: () => import('@/views/Cadastro/Entrar.vue'),
  },
  {
    path: '/central',
    name: 'Central de ajuda',
    component: () => import('../components/Central.vue'),
  },
  {
    path: '/politica',
    name: 'Politica de Privacidade',
    component: () => import('../components/Politica.vue'),
  },
   {
    path: '/termos',
    name: 'Termos de uso',
    component: () => import('../components/Termos.vue'),
  },
  {
    path: '/contato',
    name: 'Conto',
    component: () => import('../components/Contato.vue'),
  },
  // ✅ ALIAS para /login (redireciona para /entrar)
  {
    path: '/login',
    redirect: '/entrar'
  },

  // ✅ Rota para lista de usuários (onde fica a tabela)
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('@/views/Cadastro/Conta.vue'),
    meta: { requiresAuth: true }
  },

  // ✅ Rota corrigida para edição com ID dinâmico
  {
    path: '/editar/:id',
    name: 'EditarUsuario',
    component: () => import('@/views/Cadastro/Editar.vue'),
    props: true,
    meta: { requiresAuth: true }
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// GUARDA DE ROTA - Verifica admin e autenticação
router.beforeEach((to, from, next) => {
  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "null")
  const token = sessionStorage.getItem("authToken")

  // Exige AMBOS: token válido e objeto de usuário com _id ou email
  const tokenValido = !!(token && token !== 'null' && token !== 'undefined' && token.length > 5)
  const usuarioValido = !!(usuario && (usuario._id || usuario.email))
  const estaLogado = tokenValido && usuarioValido

  // 🔒 Verifica rotas que precisam de login
  if (to.meta.requiresAuth && !estaLogado) {
    console.log('❌ Não autorizado! Redirecionando para /entrar')

    return next({
      path: '/entrar',
      query: { redirect: to.fullPath }
    })
  }

  // 🔒 Verifica rotas de admin (só se já passou na autenticação)
  if (to.meta.admin) {
    if (!usuario || !usuario.admin) {
      console.log('❌ Não é admin! Redirecionando para /')
      return next("/")
    }
  }

  console.log('✅ Acesso permitido')
  next()
})

export default router