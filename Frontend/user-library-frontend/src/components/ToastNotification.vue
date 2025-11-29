<template>
  <div v-if="notification.message" class="toast-container position-fixed bottom-0 end-0 p-3">
    <div :class="['toast', 'show', `bg-${notification.type}`]" role="alert">
      <div class="toast-body text-white">
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notification: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.toast-container {
  z-index: 9999;
}

.toast {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
