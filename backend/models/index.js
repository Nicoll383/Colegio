// Modelos MySQL
const User = require('./mysql/User');
const Curso = require('./mysql/Curso');
const AnioEscolar = require('./mysql/AnioEscolar');
const Matricula = require('./mysql/Matricula');
const Pago = require('./mysql/Pago');

// Modelos MongoDB
const Estudiante = require('./mongodb/Estudiante');

// Definir relaciones entre modelos MySQL
const setupAssociations = () => {
  // AnioEscolar - Curso
  AnioEscolar.hasMany(Curso, {
    foreignKey: 'anioEscolarId',
    as: 'cursos'
  });
  Curso.belongsTo(AnioEscolar, {
    foreignKey: 'anioEscolarId',
    as: 'anioEscolar'
  });

  // Curso - Matricula
  Curso.hasMany(Matricula, {
    foreignKey: 'cursoId',
    as: 'matriculas'
  });
  Matricula.belongsTo(Curso, {
    foreignKey: 'cursoId',
    as: 'curso'
  });

  // AnioEscolar - Matricula
  AnioEscolar.hasMany(Matricula, {
    foreignKey: 'anioEscolarId',
    as: 'matriculas'
  });
  Matricula.belongsTo(AnioEscolar, {
    foreignKey: 'anioEscolarId',
    as: 'anioEscolar'
  });

  // User - Matricula (Padre/Apoderado)
  User.hasMany(Matricula, {
    foreignKey: 'usuarioPadreId',
    as: 'matriculas'
  });
  Matricula.belongsTo(User, {
    foreignKey: 'usuarioPadreId',
    as: 'padre'
  });

  // Matricula - Pago
  Matricula.hasMany(Pago, {
    foreignKey: 'matriculaId',
    as: 'pagos'
  });
  Pago.belongsTo(Matricula, {
    foreignKey: 'matriculaId',
    as: 'matricula'
  });

  // User - Pago (Usuario que registra)
  User.hasMany(Pago, {
    foreignKey: 'usuarioRegistraId',
    as: 'pagosRegistrados'
  });
  Pago.belongsTo(User, {
    foreignKey: 'usuarioRegistraId',
    as: 'usuarioRegistra'
  });
};

module.exports = {
  // MySQL Models
  User,
  Curso,
  AnioEscolar,
  Matricula,
  Pago,

  // MongoDB Models
  Estudiante,

  // Setup
  setupAssociations
};
