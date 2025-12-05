const { connectMySQL, connectMongoDB, sequelize } = require('./config/database');
const { setupAssociations } = require('./models');

const setupDatabase = async () => {
  try {
    console.log('=================================');
    console.log('CONFIGURANDO BASE DE DATOS');
    console.log('=================================\n');

    await connectMySQL();
    await connectMongoDB();

    setupAssociations();

    console.log('\n=================================');
    console.log('CREANDO TABLAS...');
    console.log('=================================\n');

    // Forzar la creación de tablas
    await sequelize.sync({ force: true });

    console.log('✓ Tablas creadas exitosamente\n');
    console.log('=================================');
    console.log('Ahora ejecuta: npm run seed');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setupDatabase();
