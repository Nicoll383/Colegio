@echo off
cls
echo ================================================
echo   CONFIGURACION RAPIDA - Sistema de Matriculas
echo ================================================
echo.

echo Este script te ayudara a configurar el sistema.
echo.

set /p mysql_password="Ingresa la contraseña de MySQL (deja vacio si no tiene contraseña): "

echo.
echo Actualizando archivo .env...

(
echo # Server Configuration
echo PORT=3000
echo NODE_ENV=development
echo.
echo # MySQL Configuration
echo MYSQL_HOST=localhost
echo MYSQL_PORT=3306
echo MYSQL_USER=root
echo MYSQL_PASSWORD=%mysql_password%
echo MYSQL_DATABASE=sistema_matriculas
echo.
echo # MongoDB Configuration
echo MONGODB_URI=mongodb://localhost:27017/sistema_matriculas
echo.
echo # JWT Configuration
echo JWT_SECRET=clave_secreta_sistema_matriculas_2024
echo JWT_EXPIRE=7d
echo.
echo # File Upload Configuration
echo MAX_FILE_SIZE=5242880
echo UPLOAD_PATH=./uploads
echo.
echo # Default Admin Credentials
echo ADMIN_EMAIL=admin@colegio.com
echo ADMIN_PASSWORD=Admin123!
) > backend\.env

echo Archivo .env actualizado correctamente!
echo.

echo ================================================
echo Ahora vamos a crear la base de datos en MySQL...
echo ================================================
echo.

echo Ejecutando: mysql -u root -p%mysql_password% -e "CREATE DATABASE IF NOT EXISTS sistema_matriculas;"
mysql -u root -p%mysql_password% -e "CREATE DATABASE IF NOT EXISTS sistema_matriculas;"

if %errorlevel% equ 0 (
    echo.
    echo Base de datos creada exitosamente!
    echo.
) else (
    echo.
    echo ADVERTENCIA: No se pudo crear la base de datos automaticamente.
    echo Por favor, creala manualmente ejecutando:
    echo   mysql -u root -p
    echo   CREATE DATABASE sistema_matriculas;
    echo   exit;
    echo.
)

echo ================================================
echo Instalando dependencias...
echo ================================================
echo.

call npm install
cd backend
call npm install
cd ..
cd frontend
call npm install
cd ..

echo.
echo ================================================
echo Inicializando datos de prueba...
echo ================================================
echo.

cd backend
call npm run seed
cd ..

echo.
echo ================================================
echo   CONFIGURACION COMPLETADA!
echo ================================================
echo.
echo Para iniciar el sistema ejecuta: npm start
echo.
echo Acceso:
echo   Frontend: http://localhost:8080
echo   Usuario: admin@colegio.com
echo   Contraseña: Admin123!
echo.
echo ================================================

pause
