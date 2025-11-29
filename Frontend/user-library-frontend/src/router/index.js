import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import UserLayout from '../layouts/UserLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Pages
import HomePage from '../pages/HomePage.vue'
import BorrowHistoryPage from '../pages/BorrowHistoryPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import Profile from '../pages/Profile.vue'

const routes = [
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'borrow-history', component: BorrowHistoryPage },
    ],
  },

  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'register', component: RegisterPage },
      { path: 'login', component: LoginPage },
    ],
  },

  {
    path: '/profile',
    component: UserLayout,
    children: [
      { path: '', component: Profile }, // ✅ đúng chuẩn
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
