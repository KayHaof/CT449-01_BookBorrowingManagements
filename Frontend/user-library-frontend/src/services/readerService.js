import { api } from './apiService'

export const createReader = async (data) => {
  try {
    const res = await api.post('/readers', data)    
    return res
  } catch (err) {
    console.error('Error creating reader:', err)
    throw new Error(err.response?.data?.message || 'Không thể tạo độc giả.')
  }
}
