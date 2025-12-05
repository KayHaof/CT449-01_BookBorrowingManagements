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
import api from '@/composables/useApi'

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
  { key: 'docGia', label: 'Người mượn' },
  { key: 'tenSach', label: 'Sách' },
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

const loadFines = async () => {
  const raw = await getFines()

  const mapped = await Promise.all(
    raw.map(async (f) => {
      let docGia = '—'
      let tenSach = '—'

      const borrowId = f.maMuonSach?._id

      if (borrowId) {
        try {
          const borrowRes = await api.get(`/borrows/${borrowId}`)
          const borrow = borrowRes

          docGia = borrow?.maDocGia ? `${borrow.maDocGia.hoLot} ${borrow.maDocGia.ten}` : '—'

          tenSach = borrow?.maSach?.tenSach || '—'
        } catch (err) {
          console.warn('Không fetch được borrow:', err)
        }
      }

      return {
        ...f,
        docGia,
        tenSach,
        ngayLapFormat: f.ngayLap ? new Date(f.ngayLap).toLocaleDateString('vi-VN') : '—',
      }
    }),
  )

  fines.value = mapped
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
  await deleteFine(deletingItem.value._id)
  toast.success('Xóa phiếu phạt thành công!')
  showConfirm.value = false
  loadFines()
}

onMounted(loadFines)
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
  transform: translateY(0px);
  box-shadow: 0 3px 10px rgba(123, 92, 255, 0.25);
  opacity: 0.9;
}
</style>
