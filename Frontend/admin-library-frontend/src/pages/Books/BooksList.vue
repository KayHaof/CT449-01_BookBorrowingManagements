<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold"><i class="fa-solid fa-book-open text-primary"></i> Quản lý Sách</h3>
      <button class="btn btn-primary" @click="openForm()">+ Thêm sách</button>
    </div>

    <AdminTable :columns="columns" :rows="pagedBooks" @edit="openForm" @delete="askDelete" />

    <!-- Pagination -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="books.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <BooksForm v-if="showForm" :editData="editing" @close="closeForm" @saved="loadBooks" />
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa sách?"
      :message="`Bạn có chắc chắn muốn xóa sách: ${deletingItem?.tenSach} không? - Hành động này không thể hoàn tác.`"
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useBooks from '@/composables/useBooks'

import AdminTable from '@/components/AdminTable.vue'
import Pagination from '@/components/Pagination.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import BooksForm from './BooksForm.vue'

import { toast } from '@/utils/toast'

const { getBooks, deleteBook } = useBooks()

const books = ref([])

const currentPage = ref(1)
const itemsPerPage = 5

const showConfirm = ref(false)
const deletingItem = ref(null)

// Tính dữ liệu hiển thị theo trang
const pagedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return books.value.slice(start, start + itemsPerPage)
})

// Thay đổi trang
const changePage = (p) => {
  currentPage.value = p
}

const columns = [
  { key: 'maSach', label: 'Mã sách' },
  { key: 'tenSach', label: 'Tên sách' },
  { key: 'tenTacGia', label: 'Tác giả' },
  { key: 'tenTheLoai', label: 'Thể loại' },
  { key: 'namXuatBan', label: 'Năm' },
]

// Load API books
const loadBooks = async () => {
  const res = await getBooks()

  books.value = res.map((b) => ({
    ...b,
    tenTacGia: b.maTacGia?.map((a) => a.hoTen).join(', ') || '—',
    tenTheLoai: b.maPhanLoai?.tenLoai || '—',
  }))
}

const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const editing = ref(null)
const showForm = ref(false)

const askDelete = (row) => {
  deletingItem.value = row
  showConfirm.value = true
}

const confirmDelete = async () => {
  await deleteBook(deletingItem.value._id)
  toast.success('Xóa thành công!')
  showConfirm.value = false
  loadBooks()
}

onMounted(loadBooks)
</script>
<style scoped>
/* ===== TITLE BAR ===== */
h3.fw-bold {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #4b4b4b;
}

h3.fw-bold i {
  font-size: 24px;
  background: linear-gradient(135deg, #7b5cff, #5ac8fa);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

button.btn-primary {
  background: linear-gradient(135deg, #7b5cff, #5ac8fa);
  border: none !important;
  padding: 10px 18px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.25s ease;
  color: white;
  box-shadow: 0 3px 8px rgba(123, 92, 255, 0.28);
}

button.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(123, 92, 255, 0.35);
  opacity: 0.95;
}

button.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(123, 92, 255, 0.25);
  opacity: 0.9;
}
</style>
