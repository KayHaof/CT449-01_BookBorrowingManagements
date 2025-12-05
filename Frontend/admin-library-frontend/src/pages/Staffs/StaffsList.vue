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

const currentPage = ref(1)
const itemsPerPage = 10

const showForm = ref(false)
const editing = ref(null)

const showConfirm = ref(false)
const deletingItem = ref(null)

const columns = [
  { key: 'maNV', label: 'Mã NV' },
  { key: 'hoTenNV', label: 'Họ tên' },
  { key: 'chucVu', label: 'Chức vụ' },
  { key: 'soDienThoai', label: 'Điện thoại' },
]

const pagedStaffs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return staffs.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

const loadStaffs = async () => {
  staffs.value = await getStaffs()
}

const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

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
<style scoped>
h3.fw-bold {
  display: flex;
  align-items: center;
  gap: 10px;
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
  color: white;
  transition: all 0.25s ease;
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
