<template>
  <div class="borrow-history">
    <h2 class="fw-bold mb-4 text-primary text-center">
      <i class="bi bi-clock-history me-2"></i>Lịch sử mượn sách
    </h2>

    <!-- Search & Filter -->
    <div class="row mb-4">
      <div class="col-md-6">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Tìm theo tên sách..."
          @input="fetchBorrowHistory"
        />
      </div>
      <div class="col-md-6">
        <select v-model="selectedStatus" class="form-select" @change="fetchBorrowHistory">
          <option value="">Tất cả trạng thái</option>
          <option value="BORROWED">Đang mượn</option>
          <option value="RETURNED">Đã trả</option>
          <option value="OVERDUE">Trễ hạn</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <!-- Table -->
    <div v-else-if="records.length > 0" class="table-responsive shadow-sm">
      <table class="table table-hover align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in records" :key="record.id">
            <td>{{ index + 1 }}</td>
            <td class="text-start">
              <router-link :to="`/book/${record.book.id}`" class="text-decoration-none">
                {{ record.book.title }}
              </router-link>
            </td>
            <td>{{ formatDate(record.borrowDate) }}</td>
            <td>{{ record.returnDate ? formatDate(record.returnDate) : 'Chưa trả' }}</td>
            <td>
              <span
                class="badge px-3 py-2"
                :class="{
                  'bg-success': record.status === 'RETURNED',
                  'bg-warning text-dark': record.status === 'BORROWED',
                  'bg-danger': record.status === 'OVERDUE',
                }"
              >
                {{ getStatusLabel(record.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="alert alert-info text-center">
      <i class="bi bi-info-circle"></i> Không có dữ liệu lịch sử mượn.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApiService } from '../services/apiService'

const apiService = useApiService()
const records = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')

// Lấy danh sách lịch sử mượn
const fetchBorrowHistory = async () => {
  loading.value = true
  try {
    const response = await apiService.getBorrowHistory({
      search: searchQuery.value,
      status: selectedStatus.value,
    })
    records.value = response.data || []
  } catch (error) {
    console.error('Lỗi khi tải lịch sử mượn:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'BORROWED':
      return 'Đang mượn'
    case 'RETURNED':
      return 'Đã trả'
    case 'OVERDUE':
      return 'Trễ hạn'
    default:
      return status
  }
}

onMounted(fetchBorrowHistory)
</script>

<style scoped src="../assets/css/borrow-history.css"></style>
