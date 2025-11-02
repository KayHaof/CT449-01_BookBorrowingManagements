<template>
  <div class="app bg-light">
    <Navbar />

    <main class="container my-5">
      <router-view />
    </main>

    <ToastNotification :notification="notification" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Navbar from './components/Navbar.vue'
import ToastNotification from './components/ToastNotification.vue'

const notification = ref({ message: '', type: 'success' })

// Hàm hiển thị thông báo
const showNotification = (message, type = 'success') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = { message: '', type: 'success' }
  }, 3000)
}

// Cung cấp cho các component con (ví dụ trang Home có thể gọi)
provide('showNotification', showNotification)
</script>

<style>
.app {
  min-height: 100vh;
}
</style>
