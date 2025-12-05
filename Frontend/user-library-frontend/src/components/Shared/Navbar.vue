<template>
  <nav class="navbar navbar-expand-lg navbar-main shadow-sm">
    <div class="container">
      <!-- LOGO -->
      <router-link to="/" class="navbar-brand d-flex align-items-center fw-bold">
        <i class="fa-solid fa-book-open-reader me-2 fs-4"></i>
        Library System
      </router-link>

      <!-- TOGGLER -->
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <i class="fa-solid fa-bars text-white fs-4"></i>
      </button>

      <!-- MENU -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center gap-lg-4">
          <!-- TRANG CHỦ -->
          <li class="nav-item">
            <router-link to="/" class="nav-link">Trang chủ</router-link>
          </li>

          <!-- LỊCH SỬ MƯỢN -->
          <li class="nav-item" v-if="user">
            <router-link to="/borrow-history" class="nav-link">Lịch sử mượn</router-link>
          </li>

          <!-- HỒ SƠ CÁ NHÂN -->
          <li class="nav-item" v-if="user">
            <router-link to="/profile" class="nav-link">
              <i class="fa-solid fa-id-card me-1"></i> Hồ sơ cá nhân
            </router-link>
          </li>

          <!-- ĐĂNG XUẤT -->
          <li class="nav-item" v-if="user">
            <button class="btn btn-link nav-link logout-btn" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket me-1"></i> Đăng xuất
            </button>
          </li>

          <!-- NẾU CHƯA LOGIN -->
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/auth/login">Đăng nhập</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/auth/register">Đăng ký</router-link>
            </li>
          </template>

          <!-- AVATAR + USERNAME HIỂN THỊ ĐƠN GIẢN -->
          <li class="nav-item d-flex align-items-center" v-if="user">
            <img :src="userAvatar" class="user-avatar me-2" />
            <span class="username-text">{{ user.tenDangNhap }}</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBorrows } from '@/composables/useBorrows'
const { resetBorrows } = useBorrows()

const router = useRouter()
const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) user.value = JSON.parse(storedUser)
})

const userAvatar = computed(
  () => user.value?.avatar || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
)

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('accessToken')
  user.value = null
  resetBorrows()
  router.push('/auth/login')
}
</script>
<style scoped>
.navbar-main {
  background: linear-gradient(135deg, #4b6cb7, #182848);
  padding: 0.8rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-brand {
  color: #ffffff !important;
  font-size: 1.35rem;
  letter-spacing: 0.5px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  transition: 0.25s ease-in-out;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #ffffff !important;
  transform: translateY(-1px);
}

.logout-btn {
  color: #ffcccc !important;
  padding: 0;
}

.logout-btn:hover {
  color: #ffffff !important;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.username-text {
  color: white;
  font-weight: 600;
}
</style>
