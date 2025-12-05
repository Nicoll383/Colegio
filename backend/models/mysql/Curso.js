const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Curso = sequelize.define('Curso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nivel: {
    type: DataTypes.ENUM('Inicial', 'Primaria', 'Secundaria'),
    allowNull: false
  },
  grado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Ej: 1°, 2°, 3°, etc.'
  },
  seccion: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Ej: A, B, C'
  },
  capacidadMaxima: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  vacantesDisponibles: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  turno: {
    type: DataTypes.ENUM('Mañana', 'Tarde', 'Noche'),
    allowNull: false,
    defaultValue: 'Mañana'
  },
  anioEscolarId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'anios_escolares',
      key: 'id'
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cursos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion',
  indexes: [
    {
      unique: true,
      fields: ['nivel', 'grado', 'seccion', 'anioEscolarId']
    }
  ]
});

module.exports = Curso;
