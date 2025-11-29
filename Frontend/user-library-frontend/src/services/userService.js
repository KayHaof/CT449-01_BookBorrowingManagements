import { api } from './apiService'

export const createUser = async (data) => {
  try {
    const res = await api.post('/users', data)
    return res.data
  } catch (err) {
    console.error('Error creating user:', err)
    throw new Error(err.response?.data?.message || 'Không thể tạo tài khoản người dùng.')
  }
}
