import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuex from 'vuex'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './icons'

import '@/styles/index.scss' // global css
import './permission' // permission control

const app = createApp(App)
app.use(store).use(router).use(Vuex).mount('#app')
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
