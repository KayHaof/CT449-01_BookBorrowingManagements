<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold"><i class="fa-solid fa-layer-group text-warning"></i> Quản lý Thể loại</h3>
      <button class="btn btn-primary" @click="openForm()">+ Thêm thể loại</button>
    </div>

    <!-- TABLE -->
    <AdminTable :columns="columns" :rows="pagedCategories" @edit="openForm" @delete="askDelete" />

    <!-- PAGINATION -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="categories.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <!-- FORM -->
    <CategoriesForm
      v-if="showForm"
      :editData="editing"
      @close="closeForm"
      @saved="loadCategories"
    />

    <!-- CONFIRM DELETE -->
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa thể loại?"
      :message="`Bạn có chắc chắn muốn xóa thể loại: ${deletingItem?.tenLoai}? Hành động này không thể hoàn tác.`"
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import AdminTable from '@/components/AdminTable.vue'
import Pagination from '@/components/Pagination.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import CategoriesForm from './CategoriesForm.vue'

import useCategories from '@/composables/useCategories'
import { toast } from '@/utils/toast'

const { getCategories, deleteCategory } = useCategories()

const categories = ref([])

// Form
const showForm = ref(false)
const editing = ref(null)

// Delete confirm
const showConfirm = ref(false)
const deletingItem = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5

const columns = [
  { key: 'maLoai', label: 'Mã loại' },
  { key: 'tenLoai', label: 'Tên loại' },
]

/* ===== PAGINATION ===== */
const pagedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return categories.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

/* ===== LOAD DATA ===== */
const loadCategories = async () => {
  categories.value = await getCategories()
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
  await deleteCategory(deletingItem.value._id)
  toast.success('Xóa thể loại thành công!')
  showConfirm.value = false
  loadCategories()
}

onMounted(loadCategories)
</script>
