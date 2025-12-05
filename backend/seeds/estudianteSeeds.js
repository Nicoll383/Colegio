const { Estudiante } = require('../models');

const estudianteSeeds = async () => {
  try {
    console.log('Creando estudiantes de prueba...');

    const estudiantesData = [
      {
        nombres: 'Pedro José',
        apellidos: 'López García',
        documento: {
          tipo: 'DNI',
          numero: '12345678'
        },
        fechaNacimiento: new Date('2015-05-15'),
        genero: 'Masculino',
        direccion: {
          calle: 'Av. Principal',
          numero: '123',
          distrito: 'Centro',
          ciudad: 'Lima'
        },
        apoderados: [{
          tipo: 'Padre',
          nombres: 'Juan Carlos',
          apellidos: 'López Rodríguez',
          documento: '87654321',
          telefono: '999888777',
          email: 'juan.lopez@email.com',
          esPrincipal: true,
          viveConEstudiante: true
        }],
        informacionMedica: {
          tipoSangre: 'O+',
          alergias: [],
          enfermedadesCronicas: []
        },
        estado: 'Activo'
      },
      {
        nombres: 'María Isabel',
        apellidos: 'Fernández Torres',
        documento: {
          tipo: 'DNI',
          numero: '23456789'
        },
        fechaNacimiento: new Date('2016-08-20'),
        genero: 'Femenino',
        direccion: {
          calle: 'Jr. Los Jardines',
          numero: '456',
          distrito: 'Norte',
          ciudad: 'Lima'
        },
        apoderados: [{
          tipo: 'Madre',
          nombres: 'Rosa María',
          apellidos: 'Torres Silva',
          documento: '98765432',
          telefono: '988777666',
          email: 'rosa.torres@email.com',
          esPrincipal: true,
          viveConEstudiante: true
        }],
        informacionMedica: {
          tipoSangre: 'A+',
          alergias: ['Polen'],
          enfermedadesCronicas: []
        },
        estado: 'Activo'
      },
      {
        nombres: 'Carlos Eduardo',
        apellidos: 'Ramírez Quispe',
        documento: {
          tipo: 'DNI',
          numero: '34567890'
        },
        fechaNacimiento: new Date('2012-03-10'),
        genero: 'Masculino',
        direccion: {
          calle: 'Calle Las Flores',
          numero: '789',
          distrito: 'Sur',
          ciudad: 'Lima'
        },
        apoderados: [{
          tipo: 'Madre',
          nombres: 'Carmen Rosa',
          apellidos: 'Quispe Huamán',
          documento: '76543210',
          telefono: '977666555',
          email: 'carmen.quispe@email.com',
          esPrincipal: true,
          viveConEstudiante: true
        }],
        informacionMedica: {
          tipoSangre: 'B+',
          alergias: [],
          enfermedadesCronicas: ['Asma leve']
        },
        estado: 'Activo'
      }
    ];

    for (const estudianteData of estudiantesData) {
      const existingEstudiante = await Estudiante.findOne({
        'documento.numero': estudianteData.documento.numero
      });

      if (!existingEstudiante) {
        await Estudiante.create(estudianteData);
        console.log(`✓ Estudiante creado: ${estudianteData.nombres} ${estudianteData.apellidos}`);
      } else {
        console.log(`- Estudiante ya existe: ${estudianteData.nombres} ${estudianteData.apellidos}`);
      }
    }

    console.log('Estudiantes creados exitosamente\n');
  } catch (error) {
    console.error('Error al crear estudiantes:', error);
    throw error;
  }
};

module.exports = estudianteSeeds;
