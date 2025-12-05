<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content">
        <div class="page-header">
          <h1 class="page-title">Gestión de Usuarios</h1>
          <p class="page-subtitle">Administrar usuarios del sistema</p>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Usuarios</h2>
            <button class="btn btn-primary" @click="showModal = true">+ Nuevo Usuario</button>
          </div>

          <div style="padding: 20px;">
            <div style="margin-bottom: 20px; display: flex; gap: 15px;">
              <input
                v-model="search"
                type="text"
                class="form-input"
                placeholder="Buscar por nombre, email..."
                style="max-width: 300px;"
                @input="loadUsers"
              />
              <select v-model="filterRol" class="form-select" style="max-width: 200px;" @change="loadUsers">
                <option value="">Todos los roles</option>
                <option value="Administrador">Administrador</option>
                <option value="Secretaria">Secretaria</option>
                <option value="Docente">Docente</option>
                <option value="Padre">Padre</option>
                <option value="Finanzas">Finanzas</option>
              </select>
            </div>

            <div v-if="loading" class="loading">
              <div class="spinner"></div>
            </div>

            <table v-else class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.nombre }} {{ user.apellido }}</td>
                  <td>{{ user.email }}</td>
                  <td><span :class="getRolBadge(user.rol)">{{ user.rol }}</span></td>
                  <td>{{ user.telefono || '-' }}</td>
                  <td>
                    <span :class="user.activo ? 'badge badge-success' : 'badge badge-danger'">
                      {{ user.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-primary" style="padding: 5px 10px; margin-right: 5px;" @click="editUser(user)">
                      Editar
                    </button>
                    <button
                      v-if="user.activo && user.id !== authStore.user.id"
                      class="btn btn-danger"
                      style="padding: 5px 10px;"
                      @click="deleteUser(user)"
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="pagination.totalPages > 1" style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
              <button
                class="btn btn-outline"
                :disabled="pagination.page === 1"
                @click="changePage(pagination.page - 1)"
              >
                Anterior
              </button>
              <span style="padding: 10px;">Página {{ pagination.page }} de {{ pagination.totalPages }}</span>
              <button
                class="btn btn-outline"
                :disabled="pagination.page === pagination.totalPages"
                @click="changePage(pagination.page + 1)"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
        </div>

        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input v-model="form.nombre" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">Apellido *</label>
            <input v-model="form.apellido" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">Email *</label>
            <input v-model="form.email" type="email" class="form-input" required :disabled="editingUser" />
          </div>

          <div class="form-group" v-if="!editingUser">
            <label class="form-label">Contraseña *</label>
            <input v-model="form.password" type="password" class="form-input" :required="!editingUser" />
          </div>

          <div class="form-group">
            <label class="form-label">Rol *</label>
            <select v-model="form.rol" class="form-select" required>
              <option value="">Seleccione un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Secretaria">Secretaria</option>
              <option value="Docente">Docente</option>
              <option value="Padre">Padre</option>
              <option value="Finanzas">Finanzas</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input v-model="form.telefono" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Documento</label>
            <input v-model="form.documento" type="text" class="form-input" />
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
import { useAuthStore } from '../store/auth'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import api from '../services/api'

const authStore = useAuthStore()

const users = ref([])
const loading = ref(false)
const showModal = ref(false)
const editingUser = ref(null)
const saving = ref(false)
const error = ref('')
const search = ref('')
const filterRol = ref('')
const pagination = ref({ page: 1, totalPages: 1, total: 0 })

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  rol: '',
  telefono: '',
  documento: ''
})

const getRolBadge = (rol) => {
  const badges = {
    'Administrador': 'badge badge-danger',
    'Secretaria': 'badge badge-primary',
    'Docente': 'badge badge-info',
    'Padre': 'badge badge-success',
    'Finanzas': 'badge badge-warning'
  }
  return badges[rol] || 'badge badge-primary'
}

const loadUsers = async () => {
  try {
    loading.value = true
    const response = await api.get('/usuarios', {
      params: {
        search: search.value,
        rol: filterRol.value,
        page: pagination.value.page
      }
    })
    users.value = response.data.data.users
    pagination.value = response.data.data.pagination
  } catch (err) {
    console.error('Error al cargar usuarios:', err)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  pagination.value.page = page
  loadUsers()
}

const editUser = (user) => {
  editingUser.value = user
  form.value = {
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    rol: user.rol,
    telefono: user.telefono || '',
    documento: user.documento || '',
    password: ''
  }
  showModal.value = true
}

const saveUser = async () => {
  try {
    error.value = ''
    saving.value = true

    if (editingUser.value) {
      await api.put(`/usuarios/${editingUser.value.id}`, form.value)
    } else {
      await api.post('/usuarios', form.value)
    }

    closeModal()
    loadUsers()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar usuario'
  } finally {
    saving.value = false
  }
}

const deleteUser = async (user) => {
  if (!confirm(`¿Está seguro de desactivar al usuario ${user.nombre} ${user.apellido}?`)) {
    return
  }

  try {
    await api.delete(`/usuarios/${user.id}`)
    loadUsers()
  } catch (err) {
    alert('Error al desactivar usuario')
  }
}

const closeModal = () => {
  showModal.value = false
  editingUser.value = null
  error.value = ''
  form.value = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: '',
    telefono: '',
    documento: ''
  }
}

onMounted(() => {
  loadUsers()
})
</script>
