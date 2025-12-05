@echo off
cls
echo ================================================
echo   RESETEAR BASE DE DATOS - Sistema de Matriculas
echo ================================================
echo.

echo ADVERTENCIA: Este script eliminara y recreara la base de datos.
echo Se perderan todos los datos existentes.
echo.

set /p confirm="Estas seguro? (s/n): "
if /i not "%confirm%"=="s" (
    echo Operacion cancelada.
    pause
    exit /b
)

echo.
echo ================================================
echo Paso 1: Eliminando base de datos antigua...
echo ================================================
echo.

mysql -u root -e "DROP DATABASE IF EXISTS sistema_matriculas;"

echo.
echo ================================================
echo Paso 2: Creando base de datos nueva...
echo ================================================
echo.

mysql -u root -e "CREATE DATABASE sistema_matriculas;"

if %errorlevel% equ 0 (
    echo.
    echo Base de datos recreada exitosamente!
) else (
    echo.
    echo ERROR: No se pudo crear la base de datos.
    echo Verifica que MySQL este corriendo y que las credenciales sean correctas.
    pause
    exit /b 1
)

echo.
echo ================================================
echo Paso 3: Iniciando servidor (creara las tablas)...
echo ================================================
echo.
echo IMPORTANTE: Cuando veas el mensaje "Servidor listo para recibir peticiones"
echo presiona Ctrl+C para detener el servidor.
echo.

pause

cd backend
start /wait cmd /c "npm start"
cd ..

echo.
echo ================================================
echo Paso 4: Cargando datos de prueba...
echo ================================================
echo.

cd backend
call npm run seed
cd ..

echo.
echo ================================================
echo   PROCESO COMPLETADO!
echo ================================================
echo.
echo La base de datos ha sido reseteada exitosamente.
echo Ahora puedes iniciar el sistema con: npm start
echo.
echo Acceso:
echo   URL: http://localhost:8080
echo   Usuario: admin@colegio.com
echo   Contraseña: Admin123!
echo.
echo ================================================

pause
