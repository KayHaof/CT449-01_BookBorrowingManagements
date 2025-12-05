import { ref, onMounted } from 'vue'
import { useApiService } from '@/services/apiService'

export function useFines(userBorrowIds) {
  const { getFines } = useApiService()
  const totalFine = ref(0)

  const fetchFines = async () => {
    try {
      const fines = await getFines()

      const userFines = fines.filter((f) => userBorrowIds.value.includes(f.maMuonSach?._id))

      totalFine.value = userFines.reduce((sum, f) => sum + (f.soTien || 0), 0)
    } catch (err) {
      console.error('Lỗi tải phiếu phạt:', err)
    }
  }

  onMounted(fetchFines)

  return { totalFine, fetchFines }
}
