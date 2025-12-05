const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AnioEscolar = sequelize.define('AnioEscolar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ej: 2024, 2025'
  },
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaInicioMatricula: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaFinMatricula: {
    type: DataTypes.DATE,
    allowNull: false
  },
  costoMatricula: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  costoPension: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  numeroPensiones: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    comment: 'Número de pensiones mensuales'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  esActual: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Solo un año escolar puede estar activo como actual'
  }
}, {
  tableName: 'anios_escolares',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

module.exports = AnioEscolar;
