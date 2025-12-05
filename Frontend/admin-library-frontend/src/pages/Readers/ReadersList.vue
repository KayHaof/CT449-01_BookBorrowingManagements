<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold">
        <i class="fa-solid fa-book-open-reader text-secondary"></i> Quản lý Độc giả
      </h3>
      <button class="btn btn-primary" @click="openForm()">+ Thêm độc giả</button>
    </div>

    <!-- TABLE -->
    <AdminTable :columns="columns" :rows="pagedReaders" :disable-edit="true" @delete="askDelete">
      <!-- ⭐ Ghi đè cột hành động bằng slot -->
      <template #actions="{ row }">
        <button class="btn btn-sm btn-info me-2" @click="openDetail(row)">Xem</button>

        <button class="btn btn-sm btn-danger" @click="askDelete(row)">Xóa</button>
      </template>
    </AdminTable>

    <!-- PAGINATION -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="readers.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <!-- FORM (Thêm độc giả) -->
    <ReadersForm v-if="showForm" :editData="editing" @close="closeForm" @saved="loadReaders" />

    <!-- DETAIL MODAL -->
    <teleport to="body">
      <ReaderDetailCard v-if="showDetail" :reader="selectedReader" @close="showDetail = false" />
    </teleport>

    <!-- CONFIRM DELETE -->
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa độc giả?"
      :message="`Bạn có chắc chắn muốn xóa độc giả: ${deletingItem?.hoLot} ${deletingItem?.ten}? Hành động này không thể hoàn tác.`"
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
import ReadersForm from './ReadersForm.vue'
import ReaderDetailCard from './ReaderDetailCard.vue'

import useReaders from '@/composables/useReaders'
import useUsers from '@/composables/useUsers'
import api from '@/composables/useApi'

import { toast } from '@/utils/toast'

const { getReaders, deleteReader } = useReaders()
const { deleteUser } = useUsers()

const readers = ref([])

// FORM (Thêm mới)
const showForm = ref(false)
const editing = ref(null)

// DETAIL modal
const showDetail = ref(false)
const selectedReader = ref(null)

// DELETE modal
const showConfirm = ref(false)
const deletingItem = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const columns = [
  { key: 'maDocGia', label: 'Mã ĐG' },
  { key: 'hoLot', label: 'Họ lót' },
  { key: 'ten', label: 'Tên' },
  { key: 'dienThoai', label: 'Điện thoại' },
]

/* ========= PAGINATION ========= */
const pagedReaders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return readers.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

/* ========= LOAD DATA ========= */
const loadReaders = async () => {
  readers.value = await getReaders()
}

/* ========= OPEN FORM (Thêm) ========= */
const openForm = () => {
  editing.value = null
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

/* ========= OPEN DETAIL ========= */
const openDetail = (row) => {
  selectedReader.value = row
  showDetail.value = true
}

/* ========= DELETE ========= */
const askDelete = (row) => {
  deletingItem.value = row
  showConfirm.value = true
}

const confirmDelete = async () => {
  const readerId = deletingItem.value._id

  // 1. Xóa độc giả
  await deleteReader(readerId)

  // 2. Tìm user theo refId = _id của độc giả
  const user = await api.get(`/users/ref/${readerId}`)

  if (user?._id) {
    await deleteUser(user._id)
  }

  toast.success('Xóa độc giả + user liên kết thành công!')
  showConfirm.value = false
  loadReaders()
}

onMounted(loadReaders)
</script>
