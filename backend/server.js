const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectMySQL, connectMongoDB } = require('./config/database');
const { setupAssociations } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema de Matrículas Escolar - API v1.0',
    documentation: '/api/health'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'Error al subir archivo',
      error: err.message
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

const startServer = async () => {
  try {
    console.log('=================================');
    console.log('Sistema de Matrículas Escolar');
    console.log('=================================\n');

    console.log('Conectando a las bases de datos...\n');

    await connectMySQL();
    await connectMongoDB();

    setupAssociations();

    console.log('\n=================================');
    console.log(`Servidor iniciado en el puerto ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log('=================================\n');

    console.log('URLs disponibles:');
    console.log(`- API: http://localhost:${PORT}/api`);
    console.log(`- Health Check: http://localhost:${PORT}/api/health`);
    console.log(`- Documentación: Ver routes/index.js\n`);

    app.listen(PORT, () => {
      console.log('=================================');
      console.log('Servidor listo para recibir peticiones');
      console.log('=================================\n');
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
