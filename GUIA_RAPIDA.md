# Guía Rápida de Inicio

## Instalación en 3 Pasos

### 1. Preparar Base de Datos

**MySQL:**
```bash
mysql -u root -p
CREATE DATABASE sistema_matriculas;
exit;
```

**MongoDB:**
MongoDB crea la base de datos automáticamente al primer uso.

### 2. Ejecutar Script de Instalación

**Linux/Mac:**
```bash
chmod +x init.sh
./init.sh
```

**Windows:**
```bash
init.bat
```

**Manual:**
```bash
npm run install-all
npm run seed
```

### 3. Iniciar el Sistema

```bash
npm start
```

## Acceso

- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:3000/api

## Usuarios de Prueba

```
Administrador:
  Email: admin@colegio.com
  Contraseña: Admin123!

Secretaria:
  Email: secretaria@colegio.com
  Contraseña: Secretaria123!

Padre:
  Email: padre1@colegio.com
  Contraseña: Padre123!
```

## Comandos Útiles

```bash
# Instalar todas las dependencias
npm run install-all

# Iniciar ambos servicios
npm start

# Modo desarrollo con recarga automática
npm run dev

# Solo backend
npm run start:backend

# Solo frontend
npm run start:frontend

# Reinicializar datos
npm run seed
```

## Estructura de Carpetas

```
Colegio/
├── backend/          # API Node.js + Express
│   ├── controllers/  # Lógica de negocio
│   ├── models/       # Modelos de datos
│   ├── routes/       # Rutas API
│   └── seeds/        # Datos iniciales
├── frontend/         # Aplicación Vue.js
│   ├── src/
│   │   ├── views/    # Páginas
│   │   ├── components/ # Componentes
│   │   └── services/ # API services
└── docs/             # Documentación
```

## Módulos del Sistema

1. **Dashboard** - Panel de control con estadísticas
2. **Usuarios** - Gestión de usuarios y roles
3. **Estudiantes** - Registro y administración
4. **Matrículas** - Proceso de inscripción
5. **Cursos** - Gestión de cursos y secciones
6. **Pagos** - Control financiero
7. **Reportes** - Estadísticas y reportes
8. **Configuración** - Años escolares

## Flujo de Trabajo Típico

### Para Secretaría:
1. Crear año escolar
2. Crear cursos para el año
3. Registrar estudiantes
4. Aprobar preinscripciones
5. Registrar pagos
6. Generar reportes

### Para Padres:
1. Registrarse en el sistema
2. Agregar información del estudiante
3. Realizar preinscripción
4. Ver estado de matrícula
5. Consultar pagos

## Solución de Problemas

### Error al conectar MySQL
- Verificar que MySQL está corriendo
- Verificar credenciales en `backend/.env`
- Asegurar que la base de datos existe

### Error al conectar MongoDB
- Verificar que MongoDB está corriendo
- El puerto por defecto es 27017

### Puerto ocupado
```bash
# Cambiar puerto en backend/.env
PORT=3001

# Cambiar puerto en frontend/vite.config.js
server: { port: 8081 }
```

### Limpiar y reinstalar
```bash
# Eliminar node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Reinstalar
npm run install-all
```

## Soporte

Para más información, consultar el archivo README.md completo.
