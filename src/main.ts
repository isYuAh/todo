import "normalize.css";
import "@/css/some.css"
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { createPinia } from "pinia";
// import ArcoVueIcon from '@arco-design/web-vue/es/icon';
const app = createApp(App);
const pinia = createPinia()
app.use(pinia)
app.use(router)
// app.use(ArcoVueIcon);
app.mount('#app')