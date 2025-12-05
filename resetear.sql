-- Script para resetear la base de datos del Sistema de Matrículas

DROP DATABASE IF EXISTS sistema_matriculas;
CREATE DATABASE sistema_matriculas;

-- Mensaje de confirmación
SELECT 'Base de datos sistema_matriculas recreada exitosamente' AS Mensaje;
