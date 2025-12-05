import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useApiService } from '@/services/apiService'
import { toast } from '@/utils/toast'
import { api } from '@/services/apiService'
import io from 'socket.io-client'
import axios from 'axios'

export function useBorrows() {
  const { getBorrowHistory } = useApiService()

  const borrows = ref([])
  const filtered = ref([])

  const searchQuery = ref('')
  const selectedStatus = ref('')

  const userBorrowIds = ref([])

  const currentPage = ref(1)
  const itemsPerPage = 10

  const stats = ref({
    waiting: 0,
    active: 0,
    returned: 0,
    overdue: 0,
  })

  const totalFine = ref(0)

  const loadFines = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/fines')

      // Lọc phiếu phạt thuộc những borrowId của người này
      const myFines = res.data.filter((f) => userBorrowIds.value.includes(f.maMuonSach?._id))

      // Tính tổng tiền
      totalFine.value = myFines.reduce((sum, f) => sum + (f.soTien || 0), 0)
    } catch (err) {
      console.error('Lỗi load phiếu phạt:', err)
    }
  }

  const socket = io('http://localhost:8080')

  socket.on('borrow_updated', () => {
    fetchBorrows()
    loadFines()
  })

  onUnmounted(() => {
    socket.disconnect()
  })

  const resetBorrows = () => {
    borrows.value = []
    filtered.value = []
    userBorrowIds.value = []
    stats.value = { waiting: 0, active: 0, returned: 0, overdue: 0 }
    totalFine.value = 0
    searchQuery.value = ''
    selectedStatus.value = ''
    currentPage.value = 1
  }

  // ====================================
  // FETCH DATA
  // ====================================
  const fetchBorrows = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) return resetBorrows()

      const res = await getBorrowHistory(user.refId) // hoặc user._id tùy cấu trúc
      borrows.value = res.data

      // lưu danh sách borrowId để load fines
      userBorrowIds.value = borrows.value.map((b) => b._id)

      computeStats()
      filtered.value = borrows.value

      // load fines mỗi khi fetch borrows
      loadFines()
    } catch (err) {
      console.error('Lỗi tải dữ liệu mượn sách:', err)
    }
  }

  const cancelBorrow = async (borrow) => {
    try {
      await api.delete(`/borrows/${borrow._id}`)

      await api.put(`/books/${borrow.maSach._id}`, {
        soQuyen: borrow.maSach.soQuyen + 1,
      })

      toast.success('Đã hủy đăng ký mượn và cập nhật số lượng sách!')
      fetchBorrows()
    } catch (err) {
      toast.error('Không thể hủy phiếu mượn.')
    }
  }

  onMounted(fetchBorrows)

  // ====================================
  //  STATS
  // ====================================
  const computeStats = () => {
    stats.value.waiting = borrows.value.filter((b) => b.trangThai === 'dang_ky_muon').length
    stats.value.active = borrows.value.filter((b) => b.trangThai === 'dang_muon').length
    stats.value.returned = borrows.value.filter((b) => b.trangThai === 'da_tra').length
    stats.value.overdue = borrows.value.filter((b) => b.trangThai === 'tre_han').length
  }

  // ====================================
  //  FILTER
  // ====================================
  const applyFilters = () => {
    currentPage.value = 1

    const query = searchQuery.value.trim().toLowerCase()

    filtered.value = borrows.value.filter((item) => {
      const matchesSearch = item.maSach?.tenSach?.toLowerCase().includes(query)

      const matchesStatus = !selectedStatus.value || item.trangThai === selectedStatus.value

      return matchesSearch && matchesStatus
    })
  }

  const resetFilters = () => {
    searchQuery.value = ''
    selectedStatus.value = ''
    filtered.value = borrows.value
  }

  // ====================================
  //  PAGINATION
  // ====================================
  const paginated = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filtered.value.slice(start, start + itemsPerPage)
  })

  // ====================================
  // HELPERS
  // ====================================
  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('vi-VN')
  }

  const getImage = (file) => `http://localhost:8080${file}`

  const statusText = (s) =>
    ({
      dang_ky_muon: 'Đang đăng ký mượn',
      dang_muon: 'Đang mượn',
      da_tra: 'Đã trả',
      tre_han: 'Trễ hạn',
    })[s]

  const getDueDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    d.setDate(d.getDate() + 14)
    return d.toLocaleDateString('vi-VN')
  }

  return {
    borrows,
    filtered,
    stats,
    paginated,
    totalFine,
    resetBorrows,

    searchQuery,
    selectedStatus,
    currentPage,
    itemsPerPage,

    fetchBorrows,
    applyFilters,
    resetFilters,
    cancelBorrow,

    getImage,
    formatDate,
    statusText,
    getDueDate,
  }
}
