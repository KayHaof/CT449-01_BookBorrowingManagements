import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// Toast Component
import Toast from '@/components/Shared/Toast.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Tạo instance Toast
const toastApp = createApp(Toast)
const toastContainer = document.createElement('div')
document.body.appendChild(toastContainer)
const toastInstance = toastApp.mount(toastContainer)

// Gán vào globalProperties để gọi từ bất kỳ đâu
app.config.globalProperties.$toast = toastInstance

app.mount('#app')
