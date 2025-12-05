import { defineStore } from 'pinia'
import authService from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getUser(),
    isAuthenticated: authService.isAuthenticated()
  }),

  getters: {
    userRole: (state) => state.user?.rol,
    userName: (state) => state.user ? `${state.user.nombre} ${state.user.apellido}` : '',
    isAdmin: (state) => state.user?.rol === 'Administrador',
    isSecretaria: (state) => state.user?.rol === 'Secretaria',
    isDocente: (state) => state.user?.rol === 'Docente',
    isPadre: (state) => state.user?.rol === 'Padre',
    isFinanzas: (state) => state.user?.rol === 'Finanzas'
  },

  actions: {
    async login(email, password) {
      const response = await authService.login(email, password)
      this.user = authService.getUser()
      this.isAuthenticated = true
      return response
    },

    async register(userData) {
      const response = await authService.register(userData)
      this.user = authService.getUser()
      this.isAuthenticated = true
      return response
    },

    logout() {
      authService.logout()
      this.user = null
      this.isAuthenticated = false
    },

    async loadUser() {
      try {
        const response = await authService.getProfile()
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }
  }
})
