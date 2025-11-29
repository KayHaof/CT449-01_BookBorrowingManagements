<template>
  <div class="home-page">
    <!-- HERO -->
    <section class="hero-section text-white d-flex align-items-center rounded-4 shadow-sm">
      <div class="container text-center">
        <h1 class="fw-bold display-5">Chào mừng đến với Thư viện Online</h1>
        <p class="lead mt-2">Tìm kiếm – Mượn sách – Theo dõi dễ dàng, nhanh chóng.</p>

        <!-- Search -->
        <div class="search-box mt-4 mx-auto">
          <input
            v-model="keyword"
            @keyup.enter="searchBooks(keyword)"
            type="text"
            class="form-control form-control-lg rounded-pill"
            placeholder="Tìm kiếm sách, tác giả, thể loại..."
          />
          <button class="search-btn" @click="searchBooks(keyword)">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- KẾT QUẢ TÌM KIẾM -->
    <section v-if="searchResults.length > 0" class="container mt-5">
      <h3 class="fw-bold text-primary mb-3">Kết quả tìm kiếm</h3>

      <div class="row g-4">
        <div class="col-md-3" v-for="book in searchResults" :key="book._id">
          <router-link
            :to="`/books/${book._id}`"
            class="card book-card shadow-sm h-100 text-decoration-none"
          >
            <img :src="getImageUrl(book.biaSach)" class="card-img-top" />

            <div class="card-body">
              <h6 class="fw-semibold text-dark">{{ book.tenSach }}</h6>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- SÁCH MỚI CẬP NHẬT -->
    <section v-if="searchResults.length === 0" class="container mt-5">
      <div class="section-header">
        <h3 class="fw-bold text-primary">Sách mới cập nhật</h3>
        <router-link to="/books" class="view-all-link">
          Xem tất cả <i class="fa-solid fa-arrow-right-long"></i>
        </router-link>
      </div>

      <div class="row g-4 mt-2">
        <div class="col-md-3" v-for="book in newestBooks" :key="book._id">
          <router-link
            :to="`/books/${book._id}`"
            class="card book-card shadow-sm h-100 text-decoration-none"
          >
            <img :src="getImageUrl(book.biaSach)" class="card-img-top" />

            <div class="card-body">
              <h6 class="fw-semibold text-center text-dark">{{ book.tenSach }}</h6>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- GỢI Ý -->
    <section v-if="searchResults.length === 0" class="container mt-5 mb-5">
      <div class="section-header">
        <h3 class="fw-bold text-primary">Gợi ý cho bạn</h3>
      </div>

      <div class="row g-4 mt-2">
        <div class="col-md-3" v-for="book in suggestionBooks" :key="book._id">
          <router-link
            :to="`/books/${book._id}`"
            class="card suggest-card shadow-sm h-100 text-decoration-none"
          >
            <img :src="getImageUrl(book.biaSach)" class="card-img-top" />

            <div class="card-body">
              <h6 class="fw-semibold text-center text-dark">{{ book.tenSach }}</h6>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBookService } from '@/composables/useBooks'

const keyword = ref('')

const { newestBooks, suggestionBooks, searchResults, searchBooks, loadHomeBooks } = useBookService()

const BE_URL = 'http://localhost:8080'

// chuẩn URL hình ảnh
const getImageUrl = (path) => {
  if (!path) return '/no-image.jpg'
  return `${BE_URL}${path}`
}

// Load API khi vào trang
loadHomeBooks()
</script>

<style scoped>
.hero-section {
  min-height: 320px;
  background: linear-gradient(135deg, #5a60ea, #7a8cff);
}

.search-box {
  position: relative;
  width: 60%;
  overflow: hidden;
  border-radius: 50px;
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 38px;
  width: 38px;
  border: none;
  background: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card img {
  height: 450px;
  object-fit: cover;
}

.book-card,
.suggest-card {
  cursor: pointer;
  transition: 0.25s ease;
}

.book-card:hover,
.suggest-card:hover {
  transform: translateY(-4px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-all-link {
  font-size: 14px;
  font-weight: 600;
  color: #5a60ea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.25s ease;
  padding: 4px 6px;
  border-radius: 6px;
}

.view-all-link i {
  transition: 0.25s ease;
}

.view-all-link:hover {
  color: #3641e3;
  background: rgba(90, 96, 234, 0.1);
}

.view-all-link:hover i {
  transform: translateX(3px);
}
</style>
