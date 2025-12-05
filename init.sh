#!/bin/bash

echo "================================================"
echo "  Sistema de Matrículas Escolar - Instalación  "
echo "================================================"
echo ""

echo "Paso 1: Instalando dependencias del proyecto raíz..."
npm install
echo "✓ Dependencias del proyecto raíz instaladas"
echo ""

echo "Paso 2: Instalando dependencias del backend..."
cd backend
npm install
cd ..
echo "✓ Dependencias del backend instaladas"
echo ""

echo "Paso 3: Instalando dependencias del frontend..."
cd frontend
npm install
cd ..
echo "✓ Dependencias del frontend instaladas"
echo ""

echo "================================================"
echo "  IMPORTANTE: Configurar Base de Datos          "
echo "================================================"
echo ""
echo "Antes de continuar, asegúrese de:"
echo "1. Tener MySQL instalado y en ejecución"
echo "2. Tener MongoDB instalado y en ejecución"
echo "3. Crear la base de datos MySQL: 'sistema_matriculas'"
echo ""
echo "Comandos sugeridos:"
echo "  MySQL: mysql -u root -p -e \"CREATE DATABASE sistema_matriculas;\""
echo "  MongoDB: Ya crea la base de datos automáticamente"
echo ""
read -p "¿Las bases de datos están configuradas? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]
then
    echo ""
    echo "Paso 4: Inicializando datos de prueba..."
    cd backend
    npm run seed
    cd ..
    echo "✓ Datos de prueba creados"
    echo ""

    echo "================================================"
    echo "  ¡INSTALACIÓN COMPLETADA!                     "
    echo "================================================"
    echo ""
    echo "Para iniciar el sistema, ejecute:"
    echo "  npm start"
    echo ""
    echo "O inicie cada servicio por separado:"
    echo "  Backend:  cd backend && npm start"
    echo "  Frontend: cd frontend && npm run dev"
    echo ""
    echo "URLs de acceso:"
    echo "  Backend:  http://localhost:3000"
    echo "  Frontend: http://localhost:8080"
    echo ""
    echo "Credenciales de acceso:"
    echo "  Admin:      admin@colegio.com / Admin123!"
    echo "  Secretaria: secretaria@colegio.com / Secretaria123!"
    echo "  Docente:    docente@colegio.com / Docente123!"
    echo "  Finanzas:   finanzas@colegio.com / Finanzas123!"
    echo "  Padre:      padre1@colegio.com / Padre123!"
    echo ""
    echo "================================================"
else
    echo ""
    echo "Por favor, configure las bases de datos primero."
    echo "Luego ejecute: npm run seed"
    echo ""
fi
