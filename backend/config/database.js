const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

// Configuración de MySQL con Sequelize
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
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
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('✗ Error al conectar MongoDB:', error.message);
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
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  mongoose,
  connectMySQL,
  connectMongoDB
};
