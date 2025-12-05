# Sistema de Matrículas Escolar

Sistema completo de gestión de matrículas escolares desarrollado con Node.js, Vue.js, MySQL y MongoDB.

## Características

### Gestión de Usuarios y Roles
- **Administrador**: Control total del sistema
- **Secretaría**: Gestión de matrículas, estudiantes y pagos
- **Docentes**: Visualización de estudiantes y cursos
- **Padres**: Inscripción y seguimiento de sus hijos
- **Finanzas**: Control de pagos y reportes financieros

### Gestión de Estudiantes
- Registro completo de datos personales
- Información de apoderados
- Historial médico
- Documentos digitales (certificados, fotos, etc.)
- Historial académico

### Proceso de Matrícula
- Preinscripción online
- Validación de requisitos
- Asignación automática de cursos
- Control de vacantes
- Generación de comprobantes
- Estados: Preinscrito, Pendiente, Aprobada, Activa, Rechazada, Retirada

### Gestión de Cursos
- Niveles: Inicial, Primaria, Secundaria
- Secciones y paralelos
- Control de capacidad y vacantes
- Asignación de horarios y docentes
- Listado de estudiantes por curso

### Gestión de Pagos
- Registro de pagos de matrícula
- Control de pensiones
- Múltiples métodos de pago
- Generación de comprobantes
- Estado de cuenta

### Reportes
- Estudiantes matriculados por curso
- Vacantes disponibles
- Pagos realizados y pendientes
- Estadísticas comparativas
- Dashboard con métricas clave

### Configuración del Año Escolar
- Fechas de inicio y fin
- Período de matrícula
- Costos de matrícula y pensiones
- Parámetros del sistema

## Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **MySQL** (Sequelize ORM) - Para datos estructurados
- **MongoDB** (Mongoose ODM) - Para datos flexibles de estudiantes
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Multer** - Carga de archivos

### Frontend
- **Vue.js 3** - Composition API
- **Pinia** - State Management
- **Vue Router** - Navegación
- **Axios** - HTTP Client
- **Vite** - Build Tool

## Requisitos Previos

- Node.js (v16 o superior)
- MySQL (v8 o superior)
- MongoDB (v5 o superior)
- npm o yarn

## Instalación

### Opción 1: Script de Instalación Automática

#### En Linux/Mac:
```bash
chmod +x init.sh
./init.sh
```

#### En Windows:
```bash
init.bat
```

### Opción 2: Instalación Manual

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Colegio
```

2. **Instalar dependencias**
```bash
npm run install-all
```

3. **Configurar base de datos MySQL**
```bash
mysql -u root -p
CREATE DATABASE sistema_matriculas;
exit;
```

4. **Configurar variables de entorno**
```bash
cd backend
cp .env.example .env
```

Editar `backend/.env` con sus credenciales:
```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_DATABASE=sistema_matriculas
MONGODB_URI=mongodb://localhost:27017/sistema_matriculas
JWT_SECRET=tu_clave_secreta
```

5. **Inicializar datos de prueba**
```bash
npm run seed
```

## Ejecución

### Iniciar ambos servicios simultáneamente:
```bash
npm start
```

### Iniciar servicios por separado:

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Acceso al Sistema

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000

### Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@colegio.com | Admin123! |
| Secretaria | secretaria@colegio.com | Secretaria123! |
| Docente | docente@colegio.com | Docente123! |
| Finanzas | finanzas@colegio.com | Finanzas123! |
| Padre | padre1@colegio.com | Padre123! |

## Estructura del Proyecto

```
Colegio/
├── backend/
│   ├── config/           # Configuraciones (DB, roles)
│   ├── controllers/      # Controladores MVC
│   ├── models/           # Modelos MySQL y MongoDB
│   │   ├── mysql/        # Modelos Sequelize
│   │   └── mongodb/      # Modelos Mongoose
│   ├── routes/           # Rutas de la API
│   ├── middlewares/      # Auth, upload, etc.
│   ├── seeds/            # Datos de prueba
│   ├── uploads/          # Archivos subidos
│   ├── .env              # Variables de entorno
│   ├── package.json
│   └── server.js         # Servidor principal
├── frontend/
│   ├── src/
│   │   ├── assets/       # CSS e imágenes
│   │   ├── components/   # Componentes Vue
│   │   ├── views/        # Vistas/Páginas
│   │   ├── router/       # Configuración de rutas
│   │   ├── store/        # Estado global (Pinia)
│   │   ├── services/     # Servicios API
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── package.json          # Scripts principales
├── init.sh               # Script de instalación (Linux/Mac)
├── init.bat              # Script de instalación (Windows)
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de padres
- `GET /api/auth/profile` - Perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Desactivar usuario

### Estudiantes
- `GET /api/estudiantes` - Listar estudiantes
- `GET /api/estudiantes/:id` - Obtener estudiante
- `POST /api/estudiantes` - Crear estudiante
- `PUT /api/estudiantes/:id` - Actualizar estudiante
- `POST /api/estudiantes/:id/documentos` - Subir documento

### Matrículas
- `GET /api/matriculas` - Listar matrículas
- `POST /api/matriculas` - Crear preinscripción
- `PUT /api/matriculas/:id/aprobar` - Aprobar matrícula
- `PUT /api/matriculas/:id/activar` - Activar matrícula

### Cursos
- `GET /api/cursos` - Listar cursos
- `POST /api/cursos` - Crear curso
- `GET /api/cursos/:id/estudiantes` - Estudiantes del curso

### Pagos
- `GET /api/pagos` - Listar pagos
- `POST /api/pagos` - Registrar pago
- `GET /api/pagos/matricula/:id` - Pagos de una matrícula

### Reportes
- `GET /api/reportes/dashboard` - Dashboard principal
- `GET /api/reportes/matriculas-por-curso` - Reporte de matrículas
- `GET /api/reportes/pagos` - Reporte de pagos
- `GET /api/reportes/vacantes` - Vacantes disponibles

## Desarrollo

### Modo desarrollo con recarga automática:
```bash
npm run dev
```

### Ejecutar seeds:
```bash
npm run seed
```

## Seguridad

- Autenticación con JWT
- Contraseñas encriptadas con bcrypt
- Middleware de autorización por roles
- Validación de datos en backend
- CORS configurado
- Variables de entorno para datos sensibles

## Soporte

Para reportar bugs o solicitar características, por favor crear un issue en el repositorio.

## Licencia

MIT License

## Autor

Sistema de Matrículas Escolar - 2024
