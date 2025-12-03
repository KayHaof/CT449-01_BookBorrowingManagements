<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold"><i class="fa-regular fa-note-sticky text-success"></i> Phiếu mượn</h3>
      <button class="btn btn-primary" @click="openForm()">+ Tạo phiếu mượn</button>
    </div>

    <!-- TABLE -->
    <AdminTable :columns="columns" :rows="pagedBorrows" @edit="openForm" @delete="askDelete" />

    <!-- PAGINATION -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="borrows.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <!-- FORM -->
    <BorrowsForm v-if="showForm" :editData="editing" @close="closeForm" @saved="loadBorrows" />

    <!-- CONFIRM DELETE -->
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa phiếu mượn?"
      :message="`Bạn có chắc chắn muốn xóa phiếu mượn: ${deletingItem?.maMuon}? Hành động này không thể hoàn tác.`"
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
import BorrowsForm from './BorrowsForm.vue'

import useBorrows from '@/composables/useBorrows'
import { toast } from '@/utils/toast'

const { getBorrows, deleteBorrow } = useBorrows()

const borrows = ref([])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5

// Form
const showForm = ref(false)
const editing = ref(null)

// Delete modal
const showConfirm = ref(false)
const deletingItem = ref(null)

// Columns (hiển thị trên bảng)
const columns = [
  { key: 'maMuon', label: 'Mã mượn' },
  { key: 'ngayMuonFormat', label: 'Ngày mượn' },
  { key: 'ngayTraFormat', label: 'Ngày hạn trả' },
  { key: 'trangThai', label: 'Trạng thái' },
]

/* ========= PAGINATION ========= */
const pagedBorrows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return borrows.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

const getDueDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  d.setDate(d.getDate() + 14)
  return d.toLocaleDateString('vi-VN')
}

const mapStatus = (status) => {
  switch (status) {
    case 'dang_ky_muon':
      return 'Đang ký mượn'
    case 'dang_muon':
      return 'Đang mượn'
    case 'da_tra':
      return 'Đã trả'
    case 'tre_han':
      return 'Quá hạn'
    default:
      return status
  }
}

/* ========= LOAD DATA ========= */
const loadBorrows = async () => {
  const raw = await getBorrows()

  // Format ngày để hiển thị đẹp hơn
  borrows.value = raw.map((b) => ({
    ...b,
    ngayMuonFormat: b.ngayMuon ? new Date(b.ngayMuon).toLocaleDateString('vi-VN') : '—',
    ngayTraFormat: b.ngayTra
      ? new Date(b.ngayTra).toLocaleDateString('vi-VN')
      : getDueDate(b.ngayMuon),
    trangThai: mapStatus(b.trangThai),
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
  await deleteBorrow(deletingItem.value._id)
  toast.success('Xóa phiếu mượn thành công!')
  showConfirm.value = false
  loadBorrows()
}

onMounted(loadBorrows)
</script>
