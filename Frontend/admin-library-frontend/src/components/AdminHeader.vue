<template>
  <header class="admin-header d-flex justify-content-between align-items-center">
    <h4 class="fw-bold">Trang quản trị</h4>

    <div class="d-flex align-items-center gap-3">
      <div class="admin-avatar">A</div>
      <button class="btn btn-outline-danger btn-sm" @click="logout">
        <i class="fa-solid fa-right-from-bracket me-1"></i> Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('vaiTro')
  localStorage.removeItem('userId')

  router.push('/admin/login')
}
</script>

<style scoped>
.admin-header {
  background: white;
  padding: 16px 20px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 6%);
}

.admin-header button {
  padding: 6px 14px;
  font-size: 14px;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  background: #4f46e5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  color: white;
  align-items: center;
}
</style>
