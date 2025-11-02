import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import BorrowHistoryPage from '../pages/BorrowHistoryPage.vue'
import RegisterPage from '../pages/RegisterPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/borrow-history', component: BorrowHistoryPage },
  {path: '/register', component: RegisterPage}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
