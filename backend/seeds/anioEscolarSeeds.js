const { AnioEscolar } = require('../models');

const anioEscolarSeeds = async () => {
  try {
    console.log('Creando años escolares de prueba...');

    const aniosData = [
      {
        nombre: '2024',
        fechaInicio: new Date('2024-03-01'),
        fechaFin: new Date('2024-12-20'),
        fechaInicioMatricula: new Date('2023-12-01'),
        fechaFinMatricula: new Date('2024-02-28'),
        costoMatricula: 200.00,
        costoPension: 150.00,
        numeroPensiones: 10,
        activo: true,
        esActual: false
      },
      {
        nombre: '2025',
        fechaInicio: new Date('2025-03-01'),
        fechaFin: new Date('2025-12-20'),
        fechaInicioMatricula: new Date('2024-12-01'),
        fechaFinMatricula: new Date('2025-02-28'),
        costoMatricula: 220.00,
        costoPension: 165.00,
        numeroPensiones: 10,
        activo: true,
        esActual: true
      }
    ];

    for (const anioData of aniosData) {
      const existingAnio = await AnioEscolar.findOne({ where: { nombre: anioData.nombre } });

      if (!existingAnio) {
        await AnioEscolar.create(anioData);
        console.log(`✓ Año escolar creado: ${anioData.nombre}${anioData.esActual ? ' (Actual)' : ''}`);
      } else {
        console.log(`- Año escolar ya existe: ${anioData.nombre}`);
      }
    }

    console.log('Años escolares creados exitosamente\n');
  } catch (error) {
    console.error('Error al crear años escolares:', error);
    throw error;
  }
};

module.exports = anioEscolarSeeds;
