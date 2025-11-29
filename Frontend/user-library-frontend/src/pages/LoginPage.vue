<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Đăng Nhập</h1>
      <p class="auth-subtitle">Chào mừng bạn trở lại</p>

      <!-- ERROR MESSAGE -->
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
        <i class="fa-solid fa-circle-exclamation me-2"></i>
        {{ errorMessage }}
        <button type="button" class="btn-close" @click="errorMessage = ''"></button>
      </div>

      <form @submit.prevent="handleLogin" class="mt-4">
        <div class="mb-3">
          <label class="auth-label">Tên đăng nhập</label>
          <input type="text" class="auth-input" v-model="loginData.tenDangNhap" required />
        </div>

        <div class="mb-4">
          <label class="auth-label">Mật khẩu</label>

          <div class="auth-input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="auth-input"
              v-model="loginData.password"
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

      <div class="auth-divider"><span>Hoặc</span></div>

      <button class="auth-btn-outline w-100">
        <i class="fa-brands fa-google me-2"></i>
        Đăng nhập bằng Google
      </button>

      <p class="auth-footer">
        Chưa có tài khoản?
        <router-link to="/auth/register">Đăng ký ngay</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

const { loginData, handleLogin, errorMessage, showPassword, isLoading } = useAuth()
</script>

<style scoped src="../assets/css/login.css"></style>
