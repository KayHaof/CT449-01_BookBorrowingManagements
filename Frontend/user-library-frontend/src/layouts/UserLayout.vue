<template>
  <div>
    <Navbar />
    <main class="container my-5">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Shared/Navbar.vue'
import Footer from '@/components/Shared/Footer.vue'
</script>
