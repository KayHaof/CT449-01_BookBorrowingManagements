<template>
  <div class="home-page">
    <!-- Banner -->
    <section class="hero text-center text-white bg-primary py-5 rounded-4 shadow-sm">
      <div class="container">
        <h1 class="fw-bold">Chào mừng đến với Thư viện Online</h1>
        <p class="lead">Khám phá hàng ngàn đầu sách hấp dẫn, mượn dễ dàng và nhanh chóng</p>
        <router-link to="/books" class="btn btn-light btn-lg mt-3">
          <i class="bi bi-book-half me-2"></i>Khám phá ngay
        </router-link>
      </div>
    </section>

    <!-- Danh mục nổi bật -->
    <section class="featured mt-5">
      <h2 class="fw-bold mb-4 text-primary text-center">Thể loại nổi bật</h2>
      <div class="row g-4">
        <div v-for="(cat, index) in categories" :key="index" class="col-md-4">
          <div class="card h-100 category-card shadow-sm border-0">
            <div class="card-body text-center">
              <i :class="cat.icon" class="display-5 text-primary mb-3"></i>
              <h5 class="fw-semibold">{{ cat.name }}</h5>
              <p class="text-muted small">{{ cat.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'

const showNotification = inject('showNotification')

const categories = ref([
  { name: 'Công nghệ thông tin', desc: 'Lập trình, AI, và bảo mật', icon: 'bi bi-cpu' },
  { name: 'Văn học', desc: 'Tiểu thuyết, truyện ngắn, và thơ ca', icon: 'bi bi-book' },
  { name: 'Kinh tế', desc: 'Quản trị, tài chính, marketing', icon: 'bi bi-graph-up' },
])
</script>

<style scoped src="../assets/css/home.css"></style>
