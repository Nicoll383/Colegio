# 🔧 SOLUCIÓN DEFINITIVA - Error de Tablas

El error "Unknown column 'nombre'" persiste porque hay tablas viejas con estructura incorrecta.

## ✅ OPCIÓN 1: Script Automático (MÁS RÁPIDO)

**Detén el servidor actual (Ctrl + C)**

Luego ejecuta:

```powershell
resetear-bd.bat
```

Este script hará todo automáticamente:
1. Eliminará la base de datos antigua
2. Creará una nueva
3. Te pedirá que inicies el servidor para crear las tablas
4. Cargará los datos de prueba

---

## ✅ OPCIÓN 2: Manual Paso a Paso

### Paso 1: Detener el servidor

Presiona `Ctrl + C` en la terminal donde está corriendo el servidor.

### Paso 2: Eliminar y recrear la base de datos

Abre una terminal y ejecuta:

```powershell
# Conectar a MySQL
mysql -u root

# Dentro de MySQL, ejecuta:
DROP DATABASE IF EXISTS sistema_matriculas;
CREATE DATABASE sistema_matriculas;
exit;
```

### Paso 3: Iniciar el servidor (creará las tablas automáticamente)

```powershell
npm start
```

Espera a ver el mensaje:
```
✓ MySQL conectado exitosamente
✓ Modelos MySQL sincronizados
✓ MongoDB conectado exitosamente
Servidor listo para recibir peticiones
```

### Paso 4: En OTRA terminal, cargar los datos de prueba

Abre una **nueva terminal** (deja la otra con el servidor corriendo):

```powershell
cd C:\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc
cd backend
npm run seed
```

Deberías ver:

```
=================================
EJECUTANDO SEEDS
=================================

Creando usuarios de prueba...
✓ Usuario creado: admin@colegio.com (Administrador)
✓ Usuario creado: secretaria@colegio.com (Secretaria)
✓ Usuario creado: docente@colegio.com (Docente)
✓ Usuario creado: finanzas@colegio.com (Finanzas)
✓ Usuario creado: padre1@colegio.com (Padre)
✓ Usuario creado: padre2@colegio.com (Padre)

Creando años escolares de prueba...
✓ Año escolar creado: 2024
✓ Año escolar creado: 2025 (Actual)

Creando cursos de prueba...
✓ Curso creado: Inicial 3° A
✓ Curso creado: Inicial 3° B
...

Creando estudiantes de prueba...
✓ Estudiante creado: Pedro José López García
✓ Estudiante creado: María Isabel Fernández Torres
✓ Estudiante creado: Carlos Eduardo Ramírez Quispe

=================================
SEEDS EJECUTADOS EXITOSAMENTE
=================================

CREDENCIALES DE ACCESO
=================================

Administrador:
Email: admin@colegio.com
Password: Admin123!

Secretaria:
Email: secretaria@colegio.com
Password: Secretaria123!
...
```

### Paso 5: Acceder al sistema

Abre tu navegador en: **http://localhost:8080**

Inicia sesión con:
- **Email:** `admin@colegio.com`
- **Contraseña:** `Admin123!`

---

## ✅ OPCIÓN 3: Si MySQL requiere contraseña

Si tu MySQL tiene contraseña, usa estos comandos en su lugar:

```powershell
# Eliminar y crear BD (reemplaza 'tu_contraseña' con tu contraseña real)
mysql -u root -p -e "DROP DATABASE IF EXISTS sistema_matriculas;"
mysql -u root -p -e "CREATE DATABASE sistema_matriculas;"
```

---

## 🎯 Verificar que funcionó

Después de ejecutar los seeds, NO deberías ver más el error "Unknown column 'nombre'".

En la primera terminal (donde corre el servidor) deberías ver solo:
```
Servidor listo para recibir peticiones
```

Sin errores.

---

## 📊 Verificar tablas en MySQL

Para confirmar que las tablas se crearon correctamente:

```bash
mysql -u root -p
USE sistema_matriculas;
SHOW TABLES;
DESCRIBE usuarios;
```

Deberías ver la tabla `usuarios` con estas columnas:
- id
- nombre
- apellido
- email
- password
- rol
- telefono
- documento
- activo
- fechaCreacion
- fechaActualizacion

---

## 🆘 Si sigue sin funcionar

Si después de esto sigues viendo errores:

1. **Verifica que MySQL esté corriendo:**
   ```powershell
   mysql -u root -e "SELECT VERSION();"
   ```

2. **Verifica que MongoDB esté corriendo:**
   ```powershell
   net start MongoDB
   ```

3. **Revisa las credenciales en backend\.env:**
   ```
   MYSQL_USER=root
   MYSQL_PASSWORD=
   MYSQL_DATABASE=sistema_matriculas
   ```

4. **Intenta con force: true** (solo si todo lo demás falla):

   Edita `backend/config/database.js` línea 57:
   ```javascript
   await sequelize.sync({ force: true }); // Esto BORRARÁ todas las tablas
   ```

   Luego:
   ```powershell
   npm start
   cd backend
   npm run seed
   ```

---

¡Con estos pasos debería funcionar al 100%! 🎉
