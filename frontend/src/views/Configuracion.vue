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
            <button class="btn btn-primary" @click="showModal = true">+ Nuevo Año Escolar</button>
          </div>

          <div style="padding: 20px;">
            <div v-if="loading" class="loading">
              <div class="spinner"></div>
            </div>

            <table v-else class="table">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Periodo Escolar</th>
                  <th>Periodo Matrícula</th>
                  <th>Costo Matrícula</th>
                  <th>Costo Pensión</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="anio in aniosEscolares" :key="anio.id">
                  <td>
                    <strong>{{ anio.nombre }}</strong>
                    <span v-if="anio.esActual" class="badge badge-success" style="margin-left: 10px;">Actual</span>
                  </td>
                  <td>{{ formatDate(anio.fechaInicio) }} - {{ formatDate(anio.fechaFin) }}</td>
                  <td>{{ formatDate(anio.fechaInicioMatricula) }} - {{ formatDate(anio.fechaFinMatricula) }}</td>
                  <td>S/ {{ Number(anio.costoMatricula).toFixed(2) }}</td>
                  <td>S/ {{ Number(anio.costoPension).toFixed(2) }} ({{ anio.numeroPensiones }} cuotas)</td>
                  <td>
                    <span :class="anio.activo ? 'badge badge-success' : 'badge badge-danger'">
                      {{ anio.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-primary" style="padding: 5px 10px; margin-right: 5px;" @click="editAnio(anio)">
                      Editar
                    </button>
                    <button
                      v-if="!anio.esActual"
                      class="btn btn-secondary"
                      style="padding: 5px 10px;"
                      @click="setActual(anio)"
                    >
                      Marcar como Actual
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingAnio ? 'Editar Año Escolar' : 'Nuevo Año Escolar' }}</h2>
        </div>

        <form @submit.prevent="saveAnio">
          <div class="form-group">
            <label class="form-label">Nombre del Año *</label>
            <input v-model="form.nombre" type="text" class="form-input" placeholder="Ej: 2025" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
              <label class="form-label">Fecha Inicio Escolar *</label>
              <input v-model="form.fechaInicio" type="date" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Fecha Fin Escolar *</label>
              <input v-model="form.fechaFin" type="date" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Inicio Matrícula *</label>
              <input v-model="form.fechaInicioMatricula" type="date" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Fin Matrícula *</label>
              <input v-model="form.fechaFinMatricula" type="date" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Costo Matrícula (S/) *</label>
              <input v-model="form.costoMatricula" type="number" step="0.01" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Costo Pensión (S/) *</label>
              <input v-model="form.costoPension" type="number" step="0.01" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Número de Pensiones *</label>
              <input v-model="form.numeroPensiones" type="number" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label" style="display: flex; align-items: center; gap: 10px;">
                <input v-model="form.esActual" type="checkbox" />
                Marcar como año actual
              </label>
            </div>
          </div>

          <div v-if="error" class="alert alert-error">{{ error }}</div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import api from '../services/api'

const aniosEscolares = ref([])
const loading = ref(false)
const showModal = ref(false)
const editingAnio = ref(null)
const saving = ref(false)
const error = ref('')

const form = ref({
  nombre: '',
  fechaInicio: '',
  fechaFin: '',
  fechaInicioMatricula: '',
  fechaFinMatricula: '',
  costoMatricula: '',
  costoPension: '',
  numeroPensiones: 10,
  esActual: false
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES')
}

const loadAniosEscolares = async () => {
  try {
    loading.value = true
    const response = await api.get('/anios-escolares')
    aniosEscolares.value = response.data.data
  } catch (err) {
    console.error('Error al cargar años escolares:', err)
  } finally {
    loading.value = false
  }
}

const editAnio = (anio) => {
  editingAnio.value = anio
  form.value = {
    nombre: anio.nombre,
    fechaInicio: anio.fechaInicio ? anio.fechaInicio.split('T')[0] : '',
    fechaFin: anio.fechaFin ? anio.fechaFin.split('T')[0] : '',
    fechaInicioMatricula: anio.fechaInicioMatricula ? anio.fechaInicioMatricula.split('T')[0] : '',
    fechaFinMatricula: anio.fechaFinMatricula ? anio.fechaFinMatricula.split('T')[0] : '',
    costoMatricula: anio.costoMatricula,
    costoPension: anio.costoPension,
    numeroPensiones: anio.numeroPensiones,
    esActual: anio.esActual
  }
  showModal.value = true
}

const saveAnio = async () => {
  try {
    error.value = ''
    saving.value = true

    if (editingAnio.value) {
      await api.put(`/anios-escolares/${editingAnio.value.id}`, form.value)
    } else {
      await api.post('/anios-escolares', form.value)
    }

    closeModal()
    loadAniosEscolares()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar año escolar'
  } finally {
    saving.value = false
  }
}

const setActual = async (anio) => {
  if (!confirm(`¿Marcar ${anio.nombre} como año escolar actual?`)) {
    return
  }

  try {
    await api.put(`/anios-escolares/${anio.id}`, { esActual: true })
    loadAniosEscolares()
  } catch (err) {
    alert('Error al actualizar año escolar')
  }
}

const closeModal = () => {
  showModal.value = false
  editingAnio.value = null
  error.value = ''
  form.value = {
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    fechaInicioMatricula: '',
    fechaFinMatricula: '',
    costoMatricula: '',
    costoPension: '',
    numeroPensiones: 10,
    esActual: false
  }
}

onMounted(() => {
  loadAniosEscolares()
})
</script>
