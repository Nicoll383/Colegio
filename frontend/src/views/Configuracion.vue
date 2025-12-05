<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content">
        <div class="page-header">
          <h1 class="page-title">Configuración del Sistema</h1>
          <p class="page-subtitle">Configurar años escolares y parámetros</p>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Años Escolares</h2>
            <button class="btn btn-primary">+ Nuevo Año Escolar</button>
          </div>
          <div style="padding: 20px;">
            <p style="text-align: center; color: var(--text-secondary);">
              Módulo de configuración - En desarrollo
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
