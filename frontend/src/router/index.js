import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/authService'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue'),
    meta: { requiresAuth: true, roles: ['Administrador', 'Secretaria'] }
  },
  {
    path: '/estudiantes',
    name: 'Estudiantes',
    component: () => import('../views/Estudiantes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/matriculas',
    name: 'Matriculas',
    component: () => import('../views/Matriculas.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cursos',
    name: 'Cursos',
    component: () => import('../views/Cursos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pagos',
    name: 'Pagos',
    component: () => import('../views/Pagos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: () => import('../views/Reportes.vue'),
    meta: { requiresAuth: true, roles: ['Administrador', 'Secretaria', 'Finanzas'] }
  },
  {
    path: '/configuracion',
    name: 'Configuracion',
    component: () => import('../views/Configuracion.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else if (to.meta.roles && user && !to.meta.roles.includes(user.rol)) {
    next('/')
  } else {
    next()
  }
})

export default router
