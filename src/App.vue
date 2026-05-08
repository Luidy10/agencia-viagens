<template>
  <div class="app-wrapper" :class="{ 'has-sidebar': isAdmin }">

    <AdminSidebar v-if="isAdmin" />

    <div class="app-content">
      <Navbar :logo="logo_src" :alt="app_name" />
      <RouterView />
      <Footer />
    </div>

    <!-- ChatBot flutuante — aparece em todas as telas -->
    <ChatBot />

  </div>
</template>

<script>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
import AdminSidebar from './components/AdminSidebar.vue';
import ChatBot from './components/ChatBot.vue';

export default {
  name: 'App',

  components: {
    Navbar,
    Footer,
    AdminSidebar,
    ChatBot,
  },

  data() {
    return {
      logo_src: "/img/logo.png",
      app_name: "Faça seu Hamburguer",
      isAdmin: false,
    };
  },

  mounted() {
    this.verificarAdmin();
    window.addEventListener('storage', this.verificarAdmin);
  },

  beforeUnmount() {
    window.removeEventListener('storage', this.verificarAdmin);
  },

  watch: {
    $route() {
      this.verificarAdmin();
    }
  },

  methods: {
    verificarAdmin() {
      try {
        const raw = sessionStorage.getItem("usuario");
        const usuario = raw ? JSON.parse(raw) : null;
        this.isAdmin = !!(usuario && usuario.admin);
      } catch {
        this.isAdmin = false;
      }
    }
  }
};
</script>

<style>
* {
  font-family: Arial, Helvetica, sans-serif;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.app-wrapper {
  display: flex;
  min-height: 100vh;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main-container {
  margin: 50px;
  min-height: 250px;
}

h1 {
  text-align: center;
  font-size: 42px;
  margin-bottom: 30px;
  color: #222;
}
</style>