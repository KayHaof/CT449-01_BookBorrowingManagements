<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold">
        <i class="fa-solid fa-triangle-exclamation text-danger"></i> Phiếu phạt
      </h3>
      <button class="btn btn-primary" @click="openForm()">+ Tạo phiếu phạt</button>
    </div>

    <!-- TABLE -->
    <AdminTable :columns="columns" :rows="pagedFines" @edit="openForm" @delete="askDelete" />

    <!-- PAGINATION -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="fines.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <!-- FORM -->
    <FinesForm v-if="showForm" :editData="editing" @close="closeForm" @saved="loadFines" />

    <!-- CONFIRM DELETE -->
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa phiếu phạt?"
      :message="`Bạn có chắc chắn muốn xóa phiếu phạt: ${deletingItem?.maPhieuPhat}? Hành động này không thể hoàn tác.`"
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
import FinesForm from './FinesForm.vue'

import useFines from '@/composables/useFines'
import { toast } from '@/utils/toast'

const { getFines, deleteFine } = useFines()

const fines = ref([])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5

// Form
const showForm = ref(false)
const editing = ref(null)

// Delete confirm
const showConfirm = ref(false)
const deletingItem = ref(null)

const columns = [
  { key: 'maPhieuPhat', label: 'Mã phiếu' },
  { key: 'soTien', label: 'Số tiền' },
  { key: 'lyDo', label: 'Lý do' },
  { key: 'ngayLapFormat', label: 'Ngày lập' },
]

/* ========= PAGINATION ========= */
const pagedFines = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return fines.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

/* ========= LOAD DATA ========= */
const loadFines = async () => {
  const raw = await getFines()

  // Format ngày lập
  fines.value = raw.map((f) => ({
    ...f,
    ngayLapFormat: f.ngayLap ? new Date(f.ngayLap).toLocaleDateString('vi-VN') : '—',
  }))
}

/* ========= FORM ========= */
const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

/* ========= DELETE ========= */
const askDelete = (row) => {
  deletingItem.value = row
  showConfirm.value = true
}

const confirmDelete = async () => {
  await deleteFine(deletingItem.value._id)
  toast.success('Xóa phiếu phạt thành công!')
  showConfirm.value = false
  loadFines()
}

onMounted(loadFines)
</script>
