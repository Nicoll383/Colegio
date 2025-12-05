# Solución: Error "Unknown column 'nombre' in 'field list'"

Este error significa que las tablas de la base de datos no se han creado todavía.

## ✅ SOLUCIÓN RÁPIDA:

### Opción 1: Ejecutar Seeds (RECOMENDADO)

**Paso 1:** Detén el servidor (Ctrl + C si está corriendo)

**Paso 2:** Ejecuta los seeds:

```powershell
cd backend
npm run seed
```

Deberías ver:

```
=================================
INICIALIZANDO BASE DE DATOS
=================================

✓ MySQL conectado exitosamente
✓ Modelos MySQL sincronizados
✓ MongoDB conectado exitosamente

Creando usuarios de prueba...
✓ Usuario creado: admin@colegio.com (Administrador)
✓ Usuario creado: secretaria@colegio.com (Secretaria)
...

=================================
SEEDS EJECUTADOS EXITOSAMENTE
=================================
```

**Paso 3:** Vuelve a la raíz y inicia el sistema:

```powershell
cd ..
npm start
```

**Paso 4:** Accede a http://localhost:8080

Usuario: `admin@colegio.com`
Contraseña: `Admin123!`

---

### Opción 2: Si los seeds no funcionan

**Paso 1:** Detén el servidor (Ctrl + C)

**Paso 2:** Reinicia el servidor:

```powershell
npm start
```

Ahora el sistema creará las tablas automáticamente al iniciar.

**Paso 3:** Una vez iniciado, ejecuta los seeds en otra terminal:

```powershell
cd backend
npm run seed
```

**Paso 4:** Accede a http://localhost:8080

---

## 🔍 Verificar que las tablas se crearon

Puedes verificar en MySQL:

```bash
mysql -u root -p
USE sistema_matriculas;
SHOW TABLES;
```

Deberías ver:

```
+-----------------------------+
| Tables_in_sistema_matriculas|
+-----------------------------+
| anios_escolares             |
| cursos                      |
| matriculas                  |
| pagos                       |
| usuarios                    |
+-----------------------------+
```

---

## 📋 Resumen del flujo correcto:

1. **Primera vez:**
   - `npm install` (instalar dependencias)
   - `npm start` (inicia servidor, crea tablas automáticamente)
   - En otra terminal: `cd backend && npm run seed` (carga datos)
   - Acceder a http://localhost:8080

2. **Siguientes veces:**
   - Solo `npm start`
   - Acceder a http://localhost:8080

---

## ⚠️ Si sigues teniendo problemas:

### Limpiar y empezar de cero:

```bash
# Eliminar base de datos
mysql -u root -p -e "DROP DATABASE sistema_matriculas;"
mysql -u root -p -e "CREATE DATABASE sistema_matriculas;"

# Reiniciar servidor (creará tablas)
npm start

# En otra terminal, cargar datos
cd backend
npm run seed
```

---

## 🆘 Errores comunes:

**Error: "Access denied"**
- Solución: Edita `backend/.env` con tu contraseña de MySQL

**Error: "MongoDB connection refused"**
- Solución: Inicia MongoDB: `net start MongoDB` o `mongod`

**Error: "Port 3000 already in use"**
- Solución: Detén el proceso anterior con Ctrl+C o cambia el puerto en `backend/.env`

---

¡Listo! El sistema debería funcionar perfectamente ahora.
