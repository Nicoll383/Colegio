# 🔧 RESETEAR BASE DE DATOS - Guía Fácil

## ✅ OPCIÓN 1: Usar XAMPP (Si tienes XAMPP instalado)

### Paso 1: Abre phpMyAdmin

1. Abre tu navegador
2. Ve a: **http://localhost/phpmyadmin**

### Paso 2: Eliminar base de datos

1. En el panel izquierdo, busca `sistema_matriculas`
2. Click derecho → **Eliminar**
3. Confirma la eliminación

### Paso 3: Crear base de datos nueva

1. Click en "Nueva" (arriba a la izquierda)
2. Nombre: `sistema_matriculas`
3. Cotejamiento: `utf8_general_ci`
4. Click en "Crear"

### Paso 4: Continuar con los siguientes pasos comunes

---

## ✅ OPCIÓN 2: Usar MySQL Workbench

### Paso 1: Abre MySQL Workbench

### Paso 2: Conecta a tu servidor local

### Paso 3: Ejecuta el script

1. File → Open SQL Script
2. Selecciona el archivo: `resetear.sql`
3. Click en el ícono del rayo (Execute)

### Paso 4: Continuar con los siguientes pasos comunes

---

## ✅ OPCIÓN 3: Agregar MySQL al PATH

Si tienes MySQL instalado pero no está en el PATH:

### Encontrar la ubicación de MySQL:

Busca en una de estas carpetas:
- `C:\Program Files\MySQL\MySQL Server 8.0\bin`
- `C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin`
- `C:\xampp\mysql\bin`
- `C:\wamp\bin\mysql\mysql8.0.X\bin`

### Ejecutar MySQL desde su ubicación:

```powershell
# Ejemplo con XAMPP
cd C:\xampp\mysql\bin
.\mysql.exe -u root -e "DROP DATABASE IF EXISTS sistema_matriculas;"
.\mysql.exe -u root -e "CREATE DATABASE sistema_matriculas;"

# Ejemplo con instalación normal
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysql.exe -u root -p -e "DROP DATABASE IF EXISTS sistema_matriculas;"
.\mysql.exe -u root -p -e "CREATE DATABASE sistema_matriculas;"
```

---

## ✅ OPCIÓN 4: Usar el archivo SQL directamente

### Si tienes XAMPP:

```powershell
cd C:\xampp\mysql\bin
.\mysql.exe -u root < C:\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc\resetear.sql
```

### Si tienes MySQL instalado:

```powershell
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysql.exe -u root -p < C:\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc\resetear.sql
```

---

## 📋 PASOS COMUNES DESPUÉS DE RESETEAR LA BD

### Paso 1: Iniciar el servidor (creará las tablas)

Vuelve a la carpeta del proyecto:

```powershell
cd C:\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc
npm start
```

Espera a ver:
```
✓ MySQL conectado exitosamente
✓ Modelos MySQL sincronizados
✓ MongoDB conectado exitosamente
Servidor listo para recibir peticiones
```

### Paso 2: Cargar datos de prueba (en otra terminal)

Abre una **nueva terminal** (sin cerrar la del servidor):

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
...
```

### Paso 3: Acceder al sistema

Abre: **http://localhost:8080**

Usuario: `admin@colegio.com`
Contraseña: `Admin123!`

---

## 🎯 Verificar que funcionó

- El servidor NO debe mostrar errores de "Unknown column"
- Debes poder iniciar sesión en http://localhost:8080
- El dashboard debe mostrar estadísticas

---

## 💡 Recomendación

La forma más fácil es usar **phpMyAdmin** (Opción 1) si tienes XAMPP instalado.

Solo necesitas:
1. Abrir http://localhost/phpmyadmin
2. Eliminar la base de datos `sistema_matriculas`
3. Crear una nueva con el mismo nombre
4. Iniciar el servidor con `npm start`
5. En otra terminal: `cd backend && npm run seed`

¡Listo! 🎉
