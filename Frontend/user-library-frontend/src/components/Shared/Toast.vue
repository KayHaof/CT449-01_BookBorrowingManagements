<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['toast-item', `toast-${notification.type}`]"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <i :class="getIconClass(notification.type)"></i>
          </div>

          <div class="toast-message">
            <strong>{{ notification.title }}</strong>
            <p>{{ notification.message }}</p>
          </div>

          <button class="toast-close" @click="removeNotification(notification.id)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="toast-progress">
          <div
            class="progress-bar"
            :style="{ animationDuration: notification.duration + 'ms' }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref([])

const getIconClass = (type) => {
  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info',
  }
  return icons[type] || icons.info
}

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id)
}

const addNotification = (notification) => {
  const id = Date.now()
  const defaultDuration = 4000

  notifications.value.push({
    id,
    title: notification.title || '',
    message: notification.message,
    type: notification.type || 'info',
    duration: notification.duration || defaultDuration,
  })

  setTimeout(() => removeNotification(id), notification.duration || defaultDuration)
}

// Cho phép gọi từ bên ngoài qua this.$toast
defineExpose({
  addNotification,
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  overflow: hidden;
  pointer-events: auto;
  max-width: 340px;
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(350px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(350px);
    opacity: 0;
  }
}

.toast-leave-active {
  animation: slideOut 0.25s ease-in;
}

.toast-content {
  display: flex;
  padding: 16px;
  gap: 12px;
}

.toast-icon {
  font-size: 20px;
  width: 24px;
  color: inherit;
}

.toast-message strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
}

.toast-message p {
  font-size: 13px;
  margin: 0;
}

.toast-close {
  background: none;
  border: none;
  color: #666;
  font-size: 18px;
  cursor: pointer;
}

.toast-progress {
  height: 3px;
  background: #eee;
}

.progress-bar {
  height: 100%;
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Types */
.toast-success {
  border-left: 4px solid #28a745;
}
.toast-success .progress-bar {
  background: #28a745;
}

.toast-error {
  border-left: 4px solid #dc3545;
}
.toast-error .progress-bar {
  background: #dc3545;
}

.toast-warning {
  border-left: 4px solid #ffc107;
}
.toast-warning .progress-bar {
  background: #ffc107;
}

.toast-info {
  border-left: 4px solid #17a2b8;
}
.toast-info .progress-bar {
  background: #17a2b8;
}
</style>
