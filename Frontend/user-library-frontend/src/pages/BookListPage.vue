<template>
  <div class="book-list">
    <!-- Search and Filter -->
    <div class="row mb-4">
      <div class="col-md-6">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Tìm kiếm sách..."
          @input="fetchBooks"
        />
      </div>
      <div class="col-md-6">
        <select v-model="selectedCategory" class="form-select" @change="fetchBooks">
          <option value="">Tất cả danh mục</option>
          <option value="fiction">Tiểu thuyết</option>
          <option value="science">Khoa học</option>
          <option value="history">Lịch sử</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <!-- Books Grid -->
    <div v-else-if="books.length > 0" class="row g-4">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>

    <!-- No Results -->
    <div v-else class="alert alert-info text-center">
      <i class="bi bi-info-circle"></i> Không tìm thấy sách nào.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApiService } from '../services/apiService'
import BookCard from '../components/book/BookCard.vue'

const apiService = useApiService()
const books = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')

const fetchBooks = async () => {
  loading.value = true
  try {
    const response = await apiService.getBooks({
      search: searchQuery.value,
      category: selectedCategory.value,
    })
    books.value = response.data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)
</script>

<style scoped src="../assets/css/book-list.css"></style>
