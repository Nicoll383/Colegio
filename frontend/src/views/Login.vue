<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">🎓 Sistema Escolar</h1>
        <p class="login-subtitle">Gestión de Matrículas</p>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Correo Electrónico</label>
          <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="usuario@colegio.com"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;" :disabled="loading">
          <span v-if="loading">Iniciando sesión...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>

      <div style="margin-top: 20px; text-align: center; color: var(--text-secondary); font-size: 0.875rem;">
        <p style="margin-bottom: 10px;">Credenciales de prueba:</p>
        <p><strong>Admin:</strong> admin@colegio.com / Admin123!</p>
        <p><strong>Secretaria:</strong> secretaria@colegio.com / Secretaria123!</p>
        <p><strong>Padre:</strong> padre1@colegio.com / Padre123!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    error.value = ''
    loading.value = true

    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
