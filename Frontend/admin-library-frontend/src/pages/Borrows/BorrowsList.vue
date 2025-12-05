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

const currentPage = ref(1)
const itemsPerPage = 5

const changePage = (p) => {
  currentPage.value = p
}

const showForm = ref(false)
const editing = ref(null)

const showConfirm = ref(false)
const deletingItem = ref(null)

const columns = [
  { key: 'maMuon', label: 'Mã mượn' },
  { key: 'docGia', label: 'Tên độc giả' },
  { key: 'sach', label: 'Tên sách' },
  { key: 'ngayMuonFormat', label: 'Ngày mượn' },
  { key: 'ngayTraFormat', label: 'Ngày trả' },
  { key: 'statusLabel', label: 'Trạng thái' },
]

const pagedBorrows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return borrows.value.slice(start, start + itemsPerPage)
})

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

  const base = 10000
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

  delete fineData.value._id

  showFineForm.value = true
}

const loadBorrows = async () => {
  const raw = await getBorrows()

  borrows.value = raw.map((b) => {
    const hoLot = b.maDocGia?.hoLot || ''
    const ten = b.maDocGia?.ten || ''
    const tenSach = b.maSach?.tenSach || ''

    return {
      ...b,

      docGia: `${hoLot} ${ten}`.trim(),
      sach: tenSach,
      ngayMuonFormat: b.ngayMuon ? new Date(b.ngayMuon).toLocaleDateString('vi-VN') : '—',
      ngayTraFormat: b.ngayTra ? new Date(b.ngayTra).toLocaleDateString('vi-VN') : '—',
      statusLabel:
        b.trangThai === 'tre_han'
          ? 'Quá hạn'
          : b.trangThai === 'da_tra'
            ? 'Đã trả'
            : b.trangThai === 'dang_muon'
              ? 'Đang mượn'
              : 'Đăng ký mượn',
    }
  })
}

const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => (showForm.value = false)
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
  background: linear-gradient(135deg, #7b5cff, #5ac8fa) !important;
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
