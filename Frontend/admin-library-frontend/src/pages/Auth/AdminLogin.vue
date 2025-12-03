<template>
  <div class="auth-container admin-auth">
    <div class="auth-card">
      <h1 class="auth-title">Đăng Nhập Quản Trị</h1>
      <p class="auth-subtitle">Dành cho Nhân viên & Admin</p>

      <!-- ERROR MESSAGE -->
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
        <i class="fa-solid fa-circle-exclamation me-2"></i>
        {{ errorMessage }}
        <button type="button" class="btn-close" @click="errorMessage = ''"></button>
      </div>

      <form @submit.prevent="handleLogin" class="mt-4">
        <div class="mb-3">
          <label class="auth-label">Tên đăng nhập</label>
          <input type="text" class="auth-input" v-model="adminData.tenDangNhap" required />
        </div>

        <div class="mb-4">
          <label class="auth-label">Mật khẩu</label>

          <div class="auth-input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="auth-input"
              v-model="adminData.matKhau"
              required
            />

            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="auth-btn w-100">
          <span v-if="!isLoading">
            <i class="fa-solid fa-right-to-bracket me-2"></i>
            Đăng Nhập
          </span>
          <span v-else>
            <span class="spinner-border spinner-border-sm me-2"></span> Đang xử lý...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../composables/useApi'
import { useRouter } from 'vue-router'

const router = useRouter()

const adminData = ref({
  tenDangNhap: '',
  matKhau: '',
})

const errorMessage = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const res = await api.post('/auth/login', {
      tenDangNhap: adminData.value.tenDangNhap,
      matKhau: adminData.value.matKhau,
    })

    if (!res.user) {
      errorMessage.value = 'Sai thông tin đăng nhập!'
      return
    }

    // ❗ Kiểm tra vai trò (Admin / NhanVien)
    if (res.user.vaiTro !== 'Admin' && res.user.vaiTro !== 'NhanVien') {
      errorMessage.value = 'Bạn không có quyền truy cập hệ thống quản trị!'
      return
    }

    localStorage.setItem('user', JSON.stringify(res.user))

    // Chuyển về Dashboard Admin
    router.push('/admin')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Đăng nhập thất bại'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped src="../../assets/css/login.css"></style>

<style scoped>
/* Tùy chỉnh riêng cho admin */
.admin-auth {
  background: linear-gradient(135deg, #1e293b, #0f172a);
}

.auth-card {
  border-top: 4px solid #00c3ff;
}
</style>
