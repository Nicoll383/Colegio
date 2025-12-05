<template>
  <div class="header">
    <div class="header-title">{{ pageTitle }}</div>
    <div class="header-user">
      <div class="user-avatar">
        {{ userInitials }}
      </div>
      <div class="user-info">
        <div class="user-name">{{ authStore.userName }}</div>
        <div class="user-role">{{ authStore.userRole }}</div>
      </div>
      <button class="btn-logout" @click="handleLogout">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'

const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const titles = {
    'Dashboard': 'Panel de Control',
    'Usuarios': 'Gestión de Usuarios',
    'Estudiantes': 'Gestión de Estudiantes',
    'Matriculas': 'Gestión de Matrículas',
    'Cursos': 'Gestión de Cursos',
    'Pagos': 'Gestión de Pagos',
    'Reportes': 'Reportes y Estadísticas',
    'Configuracion': 'Configuración del Sistema'
  }
  return titles[route.name] || 'Sistema Escolar'
})

const userInitials = computed(() => {
  const user = authStore.user
  if (!user) return '?'
  return `${user.nombre[0]}${user.apellido[0]}`.toUpperCase()
})

const handleLogout = () => {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    authStore.logout()
  }
}
</script>
