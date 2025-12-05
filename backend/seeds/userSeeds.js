const { User } = require('../models');
const { ROLES } = require('../config/roles');

const userSeeds = async () => {
  try {
    console.log('Creando usuarios de prueba...');

    const usersData = [
      {
        nombre: 'Admin',
        apellido: 'Sistema',
        email: process.env.ADMIN_EMAIL || 'admin@colegio.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123!',
        rol: ROLES.ADMIN,
        telefono: '999999999',
        documento: 'ADM001',
        activo: true
      },
      {
        nombre: 'María',
        apellido: 'González',
        email: 'secretaria@colegio.com',
        password: 'Secretaria123!',
        rol: ROLES.SECRETARIA,
        telefono: '988888888',
        documento: 'SEC001',
        activo: true
      },
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'docente@colegio.com',
        password: 'Docente123!',
        rol: ROLES.DOCENTE,
        telefono: '977777777',
        documento: 'DOC001',
        activo: true
      },
      {
        nombre: 'Carlos',
        apellido: 'Ramírez',
        email: 'finanzas@colegio.com',
        password: 'Finanzas123!',
        rol: ROLES.FINANZAS,
        telefono: '966666666',
        documento: 'FIN001',
        activo: true
      },
      {
        nombre: 'Ana',
        apellido: 'Torres',
        email: 'padre1@colegio.com',
        password: 'Padre123!',
        rol: ROLES.PADRE,
        telefono: '955555555',
        documento: '12345678',
        activo: true
      },
      {
        nombre: 'Luis',
        apellido: 'Martínez',
        email: 'padre2@colegio.com',
        password: 'Padre123!',
        rol: ROLES.PADRE,
        telefono: '944444444',
        documento: '87654321',
        activo: true
      }
    ];

    for (const userData of usersData) {
      const existingUser = await User.findOne({ where: { email: userData.email } });

      if (!existingUser) {
        await User.create(userData);
        console.log(`✓ Usuario creado: ${userData.email} (${userData.rol})`);
      } else {
        console.log(`- Usuario ya existe: ${userData.email}`);
      }
    }

    console.log('\nUsuarios de prueba creados exitosamente\n');
    console.log('=================================');
    console.log('CREDENCIALES DE ACCESO');
    console.log('=================================');
    console.log('\nAdministrador:');
    console.log('Email: admin@colegio.com');
    console.log('Password: Admin123!');
    console.log('\nSecretaria:');
    console.log('Email: secretaria@colegio.com');
    console.log('Password: Secretaria123!');
    console.log('\nDocente:');
    console.log('Email: docente@colegio.com');
    console.log('Password: Docente123!');
    console.log('\nFinanzas:');
    console.log('Email: finanzas@colegio.com');
    console.log('Password: Finanzas123!');
    console.log('\nPadre 1:');
    console.log('Email: padre1@colegio.com');
    console.log('Password: Padre123!');
    console.log('\nPadre 2:');
    console.log('Email: padre2@colegio.com');
    console.log('Password: Padre123!');
    console.log('=================================\n');
  } catch (error) {
    console.error('Error al crear usuarios:', error);
    throw error;
  }
};

module.exports = userSeeds;
