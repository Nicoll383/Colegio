<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content">
        <div class="page-header">
          <h1 class="page-title">Gestión de Matrículas</h1>
          <p class="page-subtitle">Administrar proceso de matrículas</p>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Matrículas</h2>
            <button class="btn btn-primary">+ Nueva Matrícula</button>
          </div>
          <div class="table-container">
            <p style="padding: 20px; text-align: center; color: var(--text-secondary);">
              Módulo de gestión de matrículas - En desarrollo
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
