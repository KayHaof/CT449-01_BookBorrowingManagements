<template>
  <div class="books-page">
    <div class="books-header">
      <div class="header-content">
        <h1 class="header-title">Thư Viện Sách</h1>
        <p class="header-subtitle">Khám phá bộ sưu tập {{ totalBooks }} cuốn sách</p>
      </div>
    </div>

    <div class="container mt-5">
      <!-- FILTERS -->
      <div class="filters-section mb-5">
        <div class="row g-3">
          <div class="col-md-5">
            <div class="search-box">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm sách hoặc tác giả..."
                class="form-control search-input"
              />
            </div>
          </div>

          <div class="col-md-3">
            <select v-model="selectedCategory" class="form-select filter-select">
              <option value="">Tất cả thể loại</option>
              <option v-for="cat in categories" :key="cat._id" :value="cat.tenLoai">
                {{ cat.tenLoai }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <select v-model="sortBy" class="form-select filter-select">
              <option value="recent">Mới nhất</option>
              <option value="name-asc">Tên (A-Z)</option>
              <option value="name-desc">Tên (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="paginatedBooks.length > 0" class="books-grid">
        <div v-for="book in paginatedBooks" :key="book._id" class="book-card">
          <div class="book-cover">
            <img :src="getImageUrl(book.biaSach)" :alt="book.tenSach" class="cover-img" />

            <div class="book-overlay">
              <router-link :to="`/books/${book._id}`" class="btn btn-primary btn-sm">
                Xem Chi Tiết
              </router-link>
            </div>
          </div>

          <div class="book-info">
            <h5 class="book-title">{{ book.tenSach }}</h5>
            <p class="book-author">
              {{ book.maTacGia.map((tg) => tg.hoTen).join(', ') }}
            </p>
            <p class="book-category">{{ book.maPhanLoai?.tenLoai }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>Không tìm thấy sách phù hợp</p>
      </div>

      <!-- PAGINATION -->
      <Pagination
        v-if="filteredBooks.length > 0"
        :current-page="currentPage"
        :total-items="filteredBooks.length"
        :items-per-page="itemsPerPage"
        @page-change="currentPage = $event"
      />
    </div>
  </div>
</template>

<script setup>
import Pagination from '@/components/Shared/Pagination.vue'
import { onMounted } from 'vue'
import { useBookService } from '@/composables/useBooks'

const {
  loadHomeBooks,
  searchQuery,
  selectedCategory,
  sortBy,
  paginatedBooks,
  filteredBooks,
  totalBooks,
  currentPage,
  itemsPerPage,
  categories,
  loadCategories,
} = useBookService()

onMounted(() => {
  loadHomeBooks()
  loadCategories()
})

const BE_URL = 'http://localhost:8080'

const getImageUrl = (path) => {
  if (!path) return '/no-image.jpg'
  return `${BE_URL}${path}`
}
</script>

<style scoped>
.books-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.books-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 12px;
  color: #667eea;
  pointer-events: none;
}

.search-input {
  padding-left: 2.5rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.filter-select {
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  transition: border-color 0.3s;
}

.filter-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.book-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.book-cover {
  position: relative;
  overflow: hidden;
  height: 280px;
  background: #f0f0f0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  gap: 0.5rem;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffc107;
  color: #333;
  padding: 0.4rem 0.8rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.book-info {
  padding: 1.2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-author {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.3rem;
}

.book-category {
  font-size: 0.85rem;
  color: #667eea;
  margin-bottom: 0.8rem;
  font-weight: 500;
}

.book-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.book-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
}

.btn-borrow {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 0.35rem;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.85rem;
}

.btn-borrow:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  color: white;
  text-decoration: none;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .book-title {
    font-size: 0.9rem;
  }
}
</style>
