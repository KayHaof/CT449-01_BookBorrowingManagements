<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold"><i class="fa-regular fa-note-sticky text-success"></i> Phiếu mượn</h3>
      <button class="btn btn-primary" @click="openForm()">+ Tạo phiếu mượn</button>
    </div>

    <AdminTable :columns="columns" :rows="pagedBorrows" @edit="openForm" @delete="askDelete" />

    <Pagination
      :currentPage="currentPage"
      :totalItems="borrows.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <BorrowsForm
      v-if="showForm"
      :editData="editing"
      @close="closeForm"
      @saved="loadBorrows"
      @create-fine="openFineForm"
    />

    <ConfirmModal
      v-if="showConfirm"
      title="Xóa phiếu mượn?"
      :message="`Bạn có chắc chắn muốn xóa: ${deletingItem?.maMuon}?`"
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />

    <FinesForm v-if="showFineForm" :editData="fineData" @close="showFineForm = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import AdminTable from '@/components/AdminTable.vue'
import Pagination from '@/components/Pagination.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import BorrowsForm from './BorrowsForm.vue'
import FinesForm from '../Fines/FinesForm.vue'

import useBorrows from '@/composables/useBorrows'
import { toast } from '@/utils/toast'

const { getBorrows, deleteBorrow } = useBorrows()

const borrows = ref([])

/* Pagination */
const currentPage = ref(1)
const itemsPerPage = 5

const changePage = (p) => {
  currentPage.value = p
}

/* Forms */
const showForm = ref(false)
const editing = ref(null)

/* Delete */
const showConfirm = ref(false)
const deletingItem = ref(null)

/* Table columns */
const columns = [
  { key: 'maMuon', label: 'Mã mượn' },
  { key: 'ngayMuonFormat', label: 'Ngày mượn' },
  { key: 'ngayTraFormat', label: 'Ngày trả' },
  { key: 'statusLabel', label: 'Trạng thái' },
]

const pagedBorrows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return borrows.value.slice(start, start + itemsPerPage)
})

/* ===========================
   ⭐ FORM PHẠT
=========================== */
const showFineForm = ref(false)
const fineData = ref(null)

const openFineForm = (info) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const staffId = user?.refId

  if (!staffId) {
    toast.error('Không tìm thấy ID nhân viên!')
    return
  }

  const ngayMuon = new Date(info.ngayMuon)
  const ngayTra = new Date(info.ngayTra)

  const totalDays = Math.ceil((ngayTra - ngayMuon) / (1000 * 3600 * 24))
  const lateDays = Math.max(0, totalDays - 14)

  const base = 50000 // tiền gốc
  const fineAmount = Math.round(base * (Math.pow(1.05, lateDays) - 1))

  const generateFineCode = () => 'PP' + Math.floor(100000 + Math.random() * 900000)

  fineData.value = {
    maPhieuPhat: generateFineCode(),
    maNVLap: staffId,
    maMuonSach: info.maMuonSach,
    soTien: fineAmount,
    lyDo: `Trễ ${lateDays} ngày`,
    ngayLap: new Date().toISOString().substring(0, 10),
  }

  // đảm bảo không edit mode
  delete fineData.value._id

  showFineForm.value = true
}

/* ===========================
   LOAD DATA
=========================== */
const loadBorrows = async () => {
  const raw = await getBorrows()

  borrows.value = raw.map((b) => ({
    ...b,
    ngayMuonFormat: b.ngayMuon ? new Date(b.ngayMuon).toLocaleDateString('vi-VN') : '—',
    ngayTraFormat: b.ngayTra ? new Date(b.ngayTra).toLocaleDateString('vi-VN') : '—',

    // Hiển thị label, nhưng GIỮ nguyên b.trangThai để dùng cho form sửa
    statusLabel:
      b.trangThai === 'tre_han'
        ? 'Quá hạn'
        : b.trangThai === 'da_tra'
          ? 'Đã trả'
          : b.trangThai === 'dang_muon'
            ? 'Đang mượn'
            : 'Đăng ký mượn',
  }))
}

/* Forms */
const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => (showForm.value = false)

/* Delete */
const askDelete = (row) => {
  deletingItem.value = row
  showConfirm.value = true
}

const confirmDelete = async () => {
  await deleteBorrow(deletingItem.value._id)
  toast.success('Xóa thành công!')
  showConfirm.value = false
  loadBorrows()
}

onMounted(loadBorrows)
</script>
