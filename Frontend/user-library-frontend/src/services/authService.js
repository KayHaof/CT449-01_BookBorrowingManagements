import { api } from './apiService'

export const loginUser = async (data) => {
  try {
    const res = await api.post('/auth/login', data)
    return res.data // chứa token / user info
  } catch (err) {
    console.error('Login error:', err)
    throw new Error(err.response?.data?.message || 'Đăng nhập thất bại.')
  }
}
