import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

export function useApiService() {
  const getBooks = (params = {}) => api.get('/books', { params })

  const getBorrowHistory = (userId) => api.get(`/borrows/user/${userId}`)

  return { getBooks, getBorrowHistory }
}
