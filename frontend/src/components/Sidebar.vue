<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1>Sistema Escolar</h1>
      <p>Gestión de Matrículas</p>
    </div>

    <div class="sidebar-menu">
      <div class="menu-section">
        <div class="menu-section-title">Principal</div>
        <router-link to="/" class="menu-item" active-class="active">
          <span class="menu-item-icon">📊</span>
          <span>Dashboard</span>
        </router-link>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">Gestión</div>

        <router-link to="/estudiantes" class="menu-item" active-class="active">
          <span class="menu-item-icon">👨‍🎓</span>
          <span>Estudiantes</span>
        </router-link>

        <router-link to="/matriculas" class="menu-item" active-class="active">
          <span class="menu-item-icon">📝</span>
          <span>Matrículas</span>
        </router-link>

        <router-link to="/cursos" class="menu-item" active-class="active">
          <span class="menu-item-icon">📚</span>
          <span>Cursos</span>
        </router-link>

        <router-link to="/pagos" class="menu-item" active-class="active">
          <span class="menu-item-icon">💰</span>
          <span>Pagos</span>
        </router-link>
      </div>

      <div class="menu-section" v-if="authStore.isAdmin || authStore.isSecretaria || authStore.isFinanzas">
        <div class="menu-section-title">Administración</div>

        <router-link
          v-if="authStore.isAdmin || authStore.isSecretaria"
          to="/usuarios"
          class="menu-item"
          active-class="active"
        >
          <span class="menu-item-icon">👥</span>
          <span>Usuarios</span>
        </router-link>

        <router-link to="/reportes" class="menu-item" active-class="active">
          <span class="menu-item-icon">📈</span>
          <span>Reportes</span>
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/configuracion"
          class="menu-item"
          active-class="active"
        >
          <span class="menu-item-icon">⚙️</span>
          <span>Configuración</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
</script>
