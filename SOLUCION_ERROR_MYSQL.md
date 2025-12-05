# SOLUCIÓN RÁPIDA - Error de Conexión MySQL

## El problema
El backend no puede conectarse a MySQL porque falta configurar las credenciales.

## Solución en 3 pasos:

### PASO 1: Configurar MySQL

Primero, necesitas saber tu contraseña de MySQL. Abre una terminal y prueba:

```bash
# Intenta conectar a MySQL
mysql -u root -p
```

Si te pide contraseña y no sabes cuál es, aquí algunas opciones comunes:
- Sin contraseña (presiona Enter)
- root
- admin
- 12345

### PASO 2: Crear la base de datos

Una vez conectado a MySQL:

```sql
CREATE DATABASE sistema_matriculas;
exit;
```

### PASO 3: Configurar el archivo .env

Ve a la carpeta del proyecto:

```bash
cd C:\Users\pr\Downloads\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc\backend
```

Abre el archivo `.env` con el bloc de notas y edita estas líneas según tu configuración:

**SI TU MYSQL NO TIENE CONTRASEÑA:**
```env
MYSQL_USER=root
MYSQL_PASSWORD=
```

**SI TU MYSQL TIENE CONTRASEÑA (por ejemplo "root"):**
```env
MYSQL_USER=root
MYSQL_PASSWORD=root
```

### PASO 4: Verificar MongoDB

Asegúrate de que MongoDB esté corriendo. Abre una nueva terminal:

```bash
# En Windows, inicia MongoDB (si no está corriendo)
mongod
```

O si tienes MongoDB como servicio:
```bash
net start MongoDB
```

### PASO 5: Reiniciar el sistema

```bash
cd C:\Users\pr\Downloads\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc

npm start
```

---

## Solución Alternativa: Configurar MySQL desde cero

Si aún tienes problemas, reinstala MySQL con estos pasos:

1. Descargar MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Durante la instalación, configura:
   - Usuario: `root`
   - Contraseña: `root` (o la que prefieras)
3. Asegúrate de que MySQL esté corriendo como servicio

Luego actualiza el archivo `.env` con las credenciales que configuraste.

---

## Verificar que todo funciona

Después de configurar, deberías ver:

```
✓ MySQL conectado exitosamente
✓ Modelos MySQL sincronizados
✓ MongoDB conectado exitosamente
```

Si ves estos mensajes, ¡el sistema está listo!

Accede a: http://localhost:8080
Usuario: admin@colegio.com
Contraseña: Admin123!
