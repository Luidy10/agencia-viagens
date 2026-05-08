import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faInstagram,faFacebook,faTwitter } from '@fortawesome/free-brands-svg-icons'

library.add(faInstagram,faFacebook,faTwitter)

const app=createApp(App)

app.component('font-awesome-icon',FontAwesomeIcon)

app.use(router)

app.mount('#app')