<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content">
        <div class="page-header">
          <h1 class="page-title">Reportes y Estadísticas</h1>
          <p class="page-subtitle">Visualizar reportes del sistema</p>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Reportes Disponibles</h2>
          </div>
          <div style="padding: 20px;">
            <p style="text-align: center; color: var(--text-secondary);">
              Módulo de reportes y estadísticas - En desarrollo
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
</script>
