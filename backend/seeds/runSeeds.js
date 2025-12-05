require('dotenv').config();
const { connectMySQL, connectMongoDB } = require('../config/database');
const { setupAssociations } = require('../models');

const userSeeds = require('./userSeeds');
const anioEscolarSeeds = require('./anioEscolarSeeds');
const cursoSeeds = require('./cursoSeeds');
const estudianteSeeds = require('./estudianteSeeds');

const runSeeds = async () => {
  try {
    console.log('=================================');
    console.log('INICIALIZANDO BASE DE DATOS');
    console.log('=================================\n');

    await connectMySQL();
    await connectMongoDB();

    setupAssociations();

    console.log('\n=================================');
    console.log('EJECUTANDO SEEDS');
    console.log('=================================\n');

    await userSeeds();
    await anioEscolarSeeds();
    await cursoSeeds();
    await estudianteSeeds();

    console.log('=================================');
    console.log('SEEDS EJECUTADOS EXITOSAMENTE');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar seeds:', error);
    process.exit(1);
  }
};

runSeeds();
