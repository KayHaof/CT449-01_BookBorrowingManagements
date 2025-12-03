import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  actions: {
    setUser(data) {
      this.user = data
    },

    logout() {
      this.user = null
    },
  },
})
