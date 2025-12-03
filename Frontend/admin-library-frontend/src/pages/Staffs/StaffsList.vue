<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold"><i class="fa-regular fa-id-card text-danger"></i> Nhân viên</h3>
      <button class="btn btn-primary" @click="openForm()">+ Thêm nhân viên</button>
    </div>

    <!-- TABLE -->
    <AdminTable :columns="columns" :rows="pagedStaffs" @edit="openForm" @delete="askDelete" />

    <!-- PAGINATION -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="staffs.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <!-- FORM -->
    <StaffsForm v-if="showForm" :editData="editing" @close="closeForm" @saved="loadStaffs" />

    <!-- CONFIRM DELETE -->
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa nhân viên?"
      :message="`Bạn có chắc muốn xóa nhân viên: ${deletingItem?.hoTenNV}? Hành động này không thể hoàn tác.`"
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
import StaffsForm from './StaffsForm.vue'

import useStaffs from '@/composables/useStaffs'
import { toast } from '@/utils/toast'

const { getStaffs, deleteStaff } = useStaffs()

const staffs = ref([])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Form
const showForm = ref(false)
const editing = ref(null)

// Delete confirm
const showConfirm = ref(false)
const deletingItem = ref(null)

const columns = [
  { key: 'maNV', label: 'Mã NV' },
  { key: 'hoTenNV', label: 'Họ tên' },
  { key: 'chucVu', label: 'Chức vụ' },
  { key: 'soDienThoai', label: 'Điện thoại' },
]

/* ========== PAGINATION ========== */
const pagedStaffs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return staffs.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

/* ========== LOAD DATA ========== */
const loadStaffs = async () => {
  staffs.value = await getStaffs()
}

/* ========== FORM ========== */
const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

/* ========== DELETE ========== */
const askDelete = (row) => {
  deletingItem.value = row
  showConfirm.value = true
}

const confirmDelete = async () => {
  await deleteStaff(deletingItem.value._id)
  toast.success('Xóa nhân viên thành công!')
  showConfirm.value = false
  loadStaffs()
}

onMounted(loadStaffs)
</script>
