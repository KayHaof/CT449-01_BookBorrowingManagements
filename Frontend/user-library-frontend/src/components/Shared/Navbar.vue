<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold">
        <i class="fa-solid fa-book"></i> Library System
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Trang chủ</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/borrow-history" class="nav-link">Lịch sử mượn</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">Hồ sơ</router-link>
          </li>

          <!-- ICON NGƯỜI DÙNG -->
          <li class="nav-item dropdown ms-3">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa-solid fa-user-circle fs-5 me-2"></i>
              <span>{{ user ? user.tenDangNhap : 'Tài khoản' }}</span>
            </a>

            <!-- Dropdown khi CHƯA đăng nhập -->
            <ul
              v-if="!user"
              class="dropdown-menu dropdown-menu-end shadow-sm"
              aria-labelledby="userDropdown"
            >
              <li>
                <router-link class="dropdown-item" to="/auth/login">
                  <i class="fa-solid fa-right-to-bracket me-2 text-primary"></i>Đăng nhập
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/auth/register">
                  <i class="fa-solid fa-user-plus me-2 text-success"></i>Đăng ký
                </router-link>
              </li>
            </ul>

            <!-- Dropdown khi ĐÃ đăng nhập -->
            <ul
              v-else
              class="dropdown-menu dropdown-menu-end shadow-sm"
              aria-labelledby="userDropdown"
            >
              <li>
                <router-link class="dropdown-item" to="/profile">
                  <i class="fa-solid fa-id-card me-2 text-primary"></i>Hồ sơ của tôi
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item text-danger" @click="handleLogout">
                  <i class="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

// Khi load trang, kiểm tra user trong localStorage
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) user.value = JSON.parse(storedUser)
})

// Xử lý đăng xuất
const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    user.value = null
    router.push('/auth/login')
  }
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.3rem;
  letter-spacing: 0.5px;
}

.nav-link {
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #fff !important;
}

/* Căn chỉnh dropdown */
.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  min-width: 180px;
  border-radius: 0.5rem;
}

.dropdown-item i {
  width: 18px;
}
</style>
