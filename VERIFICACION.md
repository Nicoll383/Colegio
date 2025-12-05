# Script de Verificación de Configuración

## Usar este script para diagnosticar problemas

### En Windows PowerShell:

```powershell
# Ir a la carpeta del proyecto
cd C:\Users\pr\Downloads\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc\Colegio-claude-school-enrollment-system-01PvjKN3bCAiDH5bC2ZNM4Tc

# Verificar que existe el archivo .env
dir backend\.env

# Ver contenido del archivo .env
type backend\.env

# Probar conexión MySQL manualmente
mysql -u root -p sistema_matriculas

# Si MySQL no funciona, intenta sin contraseña
mysql -u root sistema_matriculas

# Verificar que MongoDB está corriendo
mongo --eval "db.version()"

# O en versiones nuevas de MongoDB
mongosh --eval "db.version()"
```

### Configuración paso a paso:

**1. Configurar MySQL:**

```powershell
# Conectar a MySQL
mysql -u root -p

# Dentro de MySQL, ejecutar:
CREATE DATABASE sistema_matriculas;
SHOW DATABASES;
exit;
```

**2. Editar archivo .env:**

```powershell
# Abrir archivo .env con notepad
notepad backend\.env
```

Cambiar la línea `MYSQL_PASSWORD=` por tu contraseña real.

Por ejemplo:
- Si tu contraseña es "root": `MYSQL_PASSWORD=root`
- Si no tiene contraseña: `MYSQL_PASSWORD=` (dejar vacío)

**3. Verificar MongoDB:**

```powershell
# Iniciar MongoDB (si no está corriendo)
mongod

# O como servicio
net start MongoDB
```

**4. Instalar dependencias si es primera vez:**

```powershell
npm install
cd backend
npm install
cd ..
cd frontend
npm install
cd ..
```

**5. Inicializar datos:**

```powershell
cd backend
npm run seed
cd ..
```

**6. Iniciar el sistema:**

```powershell
npm start
```

### Mensajes esperados cuando todo funciona:

```
✓ MySQL conectado exitosamente
✓ Modelos MySQL sincronizados
✓ MongoDB conectado exitosamente
Servidor iniciado en el puerto 3000
```

Frontend debería estar en: http://localhost:8080

### Si sigues con problemas:

1. **Error de MySQL**: Revisa `backend\.env` y asegúrate que las credenciales sean correctas
2. **Error de MongoDB**: Asegúrate que MongoDB esté instalado y corriendo
3. **Puerto ocupado**: Cambia el puerto en `backend\.env` (PORT=3001)

### Credenciales por defecto de MySQL en XAMPP:
- Usuario: root
- Contraseña: (vacía)

### Credenciales por defecto de MySQL en instalación normal:
- Usuario: root
- Contraseña: la que configuraste durante la instalación
