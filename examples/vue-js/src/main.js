import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~routes'

import './style.css'
import App from './App.vue'

const app = createApp(App)

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})
app.use(router)

router.isReady().then(() => {
    app.mount('#app')
})