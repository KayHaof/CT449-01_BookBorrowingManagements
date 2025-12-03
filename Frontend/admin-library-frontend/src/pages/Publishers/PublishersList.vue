<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold"><i class="fa-solid fa-industry text-primary"></i> Nhà xuất bản</h3>
      <button class="btn btn-primary" @click="openForm()">+ Thêm NXB</button>
    </div>

    <!-- TABLE -->
    <AdminTable :columns="columns" :rows="pagedPublishers" @edit="openForm" @delete="askDelete" />

    <!-- PAGINATION -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="publishers.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <!-- FORM -->
    <PublishersForm
      v-if="showForm"
      :editData="editing"
      @close="closeForm"
      @saved="loadPublishers"
    />

    <!-- CONFIRM DELETE -->
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa nhà xuất bản?"
      :message="`Bạn có chắc chắn muốn xoá NXB: ${deletingItem?.tenNXB}? Hành động này không thể hoàn tác.`"
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
import PublishersForm from './PublishersForm.vue'
import usePublishers from '@/composables/usePublishers'
import { toast } from '@/utils/toast'

const { getPublishers, deletePublisher } = usePublishers()

const publishers = ref([])

// Form
const showForm = ref(false)
const editing = ref(null)

// Delete modal
const showConfirm = ref(false)
const deletingItem = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 7

const columns = [
  { key: 'maNXB', label: 'Mã NXB' },
  { key: 'tenNXB', label: 'Tên NXB' },
]

/* ========= PAGINATION ========= */
const pagedPublishers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return publishers.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

/* ========= LOAD DATA ========= */
const loadPublishers = async () => {
  publishers.value = await getPublishers()
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
  await deletePublisher(deletingItem.value._id)
  toast.success('Xóa nhà xuất bản thành công!')
  showConfirm.value = false
  loadPublishers()
}

onMounted(loadPublishers)
</script>
