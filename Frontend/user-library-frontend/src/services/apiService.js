import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// Ở đây sau này có thể thêm interceptors
// api.interceptors.request.use(config => { ... })

export function useApiService() {
  const getBooks = (params = {}) => api.get('/books', { params })
  const getBorrowHistory = (params = {}) => api.get('/borrows', { params })

  return { getBooks, getBorrowHistory }
}
