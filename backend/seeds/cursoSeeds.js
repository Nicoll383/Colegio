const { Curso, AnioEscolar } = require('../models');

const cursoSeeds = async () => {
  try {
    console.log('Creando cursos de prueba...');

    const anioActual = await AnioEscolar.findOne({ where: { esActual: true } });

    if (!anioActual) {
      console.log('No hay año escolar actual configurado. Saltando creación de cursos.');
      return;
    }

    const niveles = [
      { nivel: 'Inicial', grados: ['3', '4', '5'] },
      { nivel: 'Primaria', grados: ['1', '2', '3', '4', '5', '6'] },
      { nivel: 'Secundaria', grados: ['1', '2', '3', '4', '5'] }
    ];

    const secciones = ['A', 'B'];

    for (const nivelData of niveles) {
      for (const grado of nivelData.grados) {
        for (const seccion of secciones) {
          const existingCurso = await Curso.findOne({
            where: {
              nivel: nivelData.nivel,
              grado: grado + '°',
              seccion,
              anioEscolarId: anioActual.id
            }
          });

          if (!existingCurso) {
            await Curso.create({
              nivel: nivelData.nivel,
              grado: grado + '°',
              seccion,
              capacidadMaxima: 30,
              vacantesDisponibles: 30,
              turno: 'Mañana',
              anioEscolarId: anioActual.id,
              activo: true
            });

            console.log(`✓ Curso creado: ${nivelData.nivel} ${grado}° ${seccion}`);
          } else {
            console.log(`- Curso ya existe: ${nivelData.nivel} ${grado}° ${seccion}`);
          }
        }
      }
    }

    console.log('Cursos creados exitosamente\n');
  } catch (error) {
    console.error('Error al crear cursos:', error);
    throw error;
  }
};

module.exports = cursoSeeds;
