<template>
  <router-view />
  <Toast ref="toast" />
</template>

<script setup>
import { ref, provide } from 'vue'
import Toast from '@/components/Shared/Toast.vue'

const toast = ref(null)

provide('toast', toast)
</script>
