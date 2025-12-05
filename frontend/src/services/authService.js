import api from './api'

export default {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },

  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData)
    return response.data
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword })
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}
