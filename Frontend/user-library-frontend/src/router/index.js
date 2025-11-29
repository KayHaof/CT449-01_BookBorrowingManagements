import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import UserLayout from '../layouts/UserLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Pages
import HomePage from '../pages/HomePage.vue'
import BooksPage from '../pages/BooksPage.vue'
import BorrowHistory from '../pages/BorrowHistory.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import Profile from '../pages/Profile.vue'
import BookDetail from '../pages/BookDetail.vue'

const routes = [
  // =============================
  // USER LAYOUT
  // =============================
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', name: 'home', component: HomePage },

      // Books List
      { path: 'books', name: 'books', component: BooksPage },

      // Book Detail
      {
        path: 'books/:id',
        name: 'book-detail',
        component: BookDetail,
        props: true,
      },

      // Borrow History
      { path: 'borrow-history', name: 'borrow-history', component: BorrowHistory },

      // Profile
      { path: 'profile', name: 'profile', component: Profile },
    ],
  },

  // =============================
  // AUTH LAYOUT
  // =============================
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'register', name: 'register', component: RegisterPage },
      { path: 'login', name: 'login', component: LoginPage },
    ],
  },

  // =============================
  // 404 PAGE
  // =============================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
