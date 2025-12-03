<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold"><i class="fa-solid fa-feather-pointed text-info"></i> Quản lý Tác giả</h3>
      <button class="btn btn-primary" @click="openForm()">+ Thêm tác giả</button>
    </div>

    <!-- TABLE -->
    <AdminTable :columns="columns" :rows="pagedAuthors" @edit="openForm" @delete="askDelete" />

    <!-- PAGINATION -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="authors.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <!-- FORM -->
    <AuthorsForm v-if="showForm" :editData="editing" @close="closeForm" @saved="loadAuthors" />

    <!-- CONFIRM DELETE -->
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa tác giả?"
      :message="`Bạn có chắc muốn xóa tác giả: ${deletingItem?.hoTen}? Hành động này không thể hoàn tác.`"
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useAuthors from '@/composables/useAuthors'

import AdminTable from '@/components/AdminTable.vue'
import Pagination from '@/components/Pagination.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AuthorsForm from './AuthorsForm.vue'

import { toast } from '@/utils/toast'

const { getAuthors, deleteAuthor } = useAuthors()

const authors = ref([])

const currentPage = ref(1)
const itemsPerPage = 5

const editing = ref(null)
const showForm = ref(false)

const showConfirm = ref(false)
const deletingItem = ref(null)

const columns = [
  { key: 'maTacGia', label: 'Mã tác giả' },
  { key: 'hoTen', label: 'Họ tên' },
]

/* ===== PAGINATION ===== */
const pagedAuthors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return authors.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

/* ===== LOAD AUTHORS ===== */
const loadAuthors = async () => {
  authors.value = await getAuthors()
}

/* ===== FORM ===== */
const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

/* ===== DELETE ===== */
const askDelete = (row) => {
  deletingItem.value = row
  showConfirm.value = true
}

const confirmDelete = async () => {
  await deleteAuthor(deletingItem.value._id)
  toast.success('Xóa tác giả thành công!')
  showConfirm.value = false
  loadAuthors()
}

onMounted(loadAuthors)
</script>
