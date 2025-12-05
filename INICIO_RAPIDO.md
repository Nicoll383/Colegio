# 🚀 INICIO RÁPIDO - Sistema de Matrículas Escolar

## ⚠️ ERROR: Access denied for user ''@'localhost'

Si ves este error, es porque falta configurar las credenciales de MySQL.

## ✅ SOLUCIÓN EN 2 MINUTOS:

### Opción 1: Script Automático (RECOMENDADO)

```bash
configurar.bat
```

Este script te pedirá tu contraseña de MySQL y configurará todo automáticamente.

### Opción 2: Configuración Manual

**Paso 1: Editar el archivo .env**

Abre el archivo `backend\.env` con el Bloc de Notas:

```bash
notepad backend\.env
```

**Paso 2: Cambiar la contraseña de MySQL**

Busca esta línea:
```
MYSQL_PASSWORD=
```

Cámbiala por tu contraseña de MySQL:
```
MYSQL_PASSWORD=tu_contraseña_aqui
```

Por ejemplo:
- Si tu contraseña es "root": `MYSQL_PASSWORD=root`
- Si usas XAMPP (sin contraseña): `MYSQL_PASSWORD=` (dejar vacío)
- Si instalaste MySQL con contraseña: `MYSQL_PASSWORD=la_que_configuraste`

**Paso 3: Guardar y cerrar el archivo**

**Paso 4: Crear la base de datos**

Abre una terminal y ejecuta:

```bash
# Si MySQL tiene contraseña
mysql -u root -p -e "CREATE DATABASE sistema_matriculas;"

# Si MySQL NO tiene contraseña (XAMPP)
mysql -u root -e "CREATE DATABASE sistema_matriculas;"
```

**Paso 5: Inicializar datos**

```bash
cd backend
npm run seed
cd ..
```

**Paso 6: Iniciar el sistema**

```bash
npm start
```

## 🎯 Acceso al Sistema

Una vez iniciado, abre tu navegador en:

**Frontend:** http://localhost:8080

**Credenciales de prueba:**
- Usuario: `admin@colegio.com`
- Contraseña: `Admin123!`

## 📋 Requisitos

Antes de iniciar, asegúrate de tener instalado:

1. **Node.js** (v16 o superior)
   - Descarga: https://nodejs.org/

2. **MySQL** (v8 o superior)
   - Opción 1: XAMPP (más fácil) - https://www.apachefriends.org/
   - Opción 2: MySQL Community - https://dev.mysql.com/downloads/mysql/

3. **MongoDB** (v5 o superior)
   - Descarga: https://www.mongodb.com/try/download/community

### Verificar instalaciones:

```bash
node --version    # Debe mostrar v16 o superior
npm --version     # Debe mostrar 8 o superior
mysql --version   # Debe mostrar versión de MySQL
mongod --version  # Debe mostrar versión de MongoDB
```

## 🔧 Iniciar servicios

**MySQL (XAMPP):**
- Abre el Panel de Control de XAMPP
- Click en "Start" en MySQL

**MySQL (Instalación normal):**
```bash
net start MySQL80
```

**MongoDB:**
```bash
# Como servicio
net start MongoDB

# O manualmente en una terminal
mongod
```

## ❌ Problemas Comunes

### Error: "Cannot find module"
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Error: "Port 3000 is already in use"
Edita `backend\.env` y cambia:
```
PORT=3001
```

### Error: "MongoDB connection refused"
Asegúrate de que MongoDB esté corriendo:
```bash
net start MongoDB
```

### Error: "MySQL access denied"
Verifica tus credenciales en `backend\.env`:
```
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña_real
```

## 📖 Más Ayuda

- **SOLUCION_ERROR_MYSQL.md** - Guía detallada para problemas de MySQL
- **VERIFICACION.md** - Scripts de diagnóstico
- **README.md** - Documentación completa

## 🎓 Credenciales de Todos los Roles

```
Administrador:
  Email: admin@colegio.com
  Contraseña: Admin123!

Secretaria:
  Email: secretaria@colegio.com
  Contraseña: Secretaria123!

Docente:
  Email: docente@colegio.com
  Contraseña: Docente123!

Finanzas:
  Email: finanzas@colegio.com
  Contraseña: Finanzas123!

Padre:
  Email: padre1@colegio.com
  Contraseña: Padre123!
```

## 🆘 Si nada funciona

1. Elimina todo y reinstala:
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

2. Verifica que MySQL y MongoDB estén corriendo

3. Revisa el archivo `backend\.env` con tus credenciales correctas

4. Ejecuta: `configurar.bat` y sigue las instrucciones

¡Listo! El sistema debería funcionar perfectamente.
