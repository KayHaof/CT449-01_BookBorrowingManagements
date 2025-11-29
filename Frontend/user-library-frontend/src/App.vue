<template>
  <div id="app">
    <!-- Toàn bộ UI sẽ được load qua layout -->
    <router-view />

    <!-- Global notification -->
    <ToastNotification :notification="notification" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import ToastNotification from '@/components/ToastNotification.vue'

// State notification dùng toàn app
const notification = ref({ message: '', type: 'success' })

// Hàm hiển thị thông báo global
const showNotification = (message, type = 'success') => {
  notification.value = { message, type }

  setTimeout(() => {
    notification.value = { message: '', type: 'success' }
  }, 2500)
}

// Cho tất cả component con sử dụng
provide('showNotification', showNotification)
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
