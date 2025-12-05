<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content">
        <div class="page-header">
          <h1 class="page-title">Bienvenido, {{ authStore.userName }}</h1>
          <p class="page-subtitle">Resumen general del sistema de matrículas</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>

        <div v-else>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Total Matrículas</div>
                <div class="stat-icon">📝</div>
              </div>
              <div class="stat-value">{{ stats.matriculas?.total || 0 }}</div>
              <div class="stat-label">Este año escolar</div>
            </div>

            <div class="stat-card success">
              <div class="stat-header">
                <div class="stat-title">Estudiantes Activos</div>
                <div class="stat-icon">👨‍🎓</div>
              </div>
              <div class="stat-value">{{ stats.estudiantes?.total || 0 }}</div>
              <div class="stat-label">Registrados en el sistema</div>
            </div>

            <div class="stat-card warning">
              <div class="stat-header">
                <div class="stat-title">Cursos Disponibles</div>
                <div class="stat-icon">📚</div>
              </div>
              <div class="stat-value">{{ stats.cursos?.total || 0 }}</div>
              <div class="stat-label">{{ stats.cursos?.vacantesDisponibles || 0 }} vacantes disponibles</div>
            </div>

            <div class="stat-card danger">
              <div class="stat-header">
                <div class="stat-title">Ingresos del Mes</div>
                <div class="stat-icon">💰</div>
              </div>
              <div class="stat-value">S/ {{ formatNumber(stats.pagos?.ingresosMes || 0) }}</div>
              <div class="stat-label">{{ stats.pagos?.hoy || 0 }} pagos hoy</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Matrículas por Estado</h2>
            </div>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Cantidad</th>
                    <th>Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in matriculasPorEstado" :key="item.estado">
                    <td>
                      <span :class="getBadgeClass(item.estado)">{{ item.estado }}</span>
                    </td>
                    <td>{{ item.cantidad }}</td>
                    <td>{{ item.porcentaje }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Ocupación de Cursos</h2>
            </div>
            <div style="padding: 20px;">
              <div style="margin-bottom: 15px;">
                <strong>Total Capacidad:</strong> {{ stats.cursos?.capacidadTotal || 0 }} estudiantes
              </div>
              <div style="margin-bottom: 15px;">
                <strong>Vacantes Disponibles:</strong> {{ stats.cursos?.vacantesDisponibles || 0 }} espacios
              </div>
              <div style="margin-bottom: 15px;">
                <strong>Nivel de Ocupación:</strong> {{ stats.cursos?.ocupacion || 0 }}%
              </div>
              <div style="background: var(--light-color); height: 30px; border-radius: 15px; overflow: hidden;">
                <div
                  style="background: linear-gradient(90deg, var(--primary-color), var(--primary-light)); height: 100%; transition: width 0.3s;"
                  :style="{ width: stats.cursos?.ocupacion + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import api from '../services/api'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref({})

const matriculasPorEstado = computed(() => {
  if (!stats.value.matriculas?.porEstado) return []

  const total = stats.value.matriculas.total
  return stats.value.matriculas.porEstado.map(item => ({
    estado: item.estado,
    cantidad: item.cantidad,
    porcentaje: total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : 0
  }))
})

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-PE').format(num)
}

const getBadgeClass = (estado) => {
  const classes = {
    'Activa': 'badge badge-success',
    'Aprobada': 'badge badge-info',
    'Preinscrito': 'badge badge-warning',
    'Pendiente': 'badge badge-warning',
    'Rechazada': 'badge badge-danger',
    'Retirada': 'badge badge-danger'
  }
  return classes[estado] || 'badge badge-primary'
}

const loadDashboard = async () => {
  try {
    loading.value = true

    const anioActualResponse = await api.get('/anios-escolares/actual')
    const anioEscolarId = anioActualResponse.data.data.id

    const response = await api.get('/reportes/dashboard', {
      params: { anioEscolarId }
    })

    stats.value = response.data.data
  } catch (error) {
    console.error('Error al cargar dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>
