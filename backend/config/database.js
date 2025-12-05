const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Verificando configuración de base de datos...');
console.log('MYSQL_HOST:', process.env.MYSQL_HOST || 'No configurado');
console.log('MYSQL_USER:', process.env.MYSQL_USER || 'No configurado');
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE || 'No configurado');
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD ? '***configurada***' : 'VACÍA');
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'No configurado');
console.log('');

// Configuración de MySQL con Sequelize
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'sistema_matriculas',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Configuración de MongoDB con Mongoose
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema_matriculas', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('✗ Error al conectar MongoDB:', error.message);
    console.log('\n💡 SOLUCIÓN:');
    console.log('1. Asegúrate de que MongoDB esté instalado');
    console.log('2. Inicia MongoDB: mongod');
    console.log('3. O como servicio: net start MongoDB');
    console.log('');
    process.exit(1);
  }
};

// Test de conexión MySQL
const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ MySQL conectado exitosamente');
    await sequelize.sync({ alter: false });
    console.log('✓ Modelos MySQL sincronizados');
  } catch (error) {
    console.error('✗ Error al conectar MySQL:', error.message);
    console.log('\n💡 SOLUCIÓN:');
    console.log('1. Verifica que MySQL esté corriendo');
    console.log('2. Crea la base de datos: mysql -u root -p -e "CREATE DATABASE sistema_matriculas;"');
    console.log('3. Edita el archivo backend/.env con tus credenciales:');
    console.log('   MYSQL_USER=root');
    console.log('   MYSQL_PASSWORD=tu_contraseña_aqui');
    console.log('   MYSQL_DATABASE=sistema_matriculas');
    console.log('');
    console.log('Ver archivo: SOLUCION_ERROR_MYSQL.md para más ayuda');
    console.log('');
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  mongoose,
  connectMySQL,
  connectMongoDB
};
