const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Matricula = sequelize.define('Matricula', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigoMatricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  estudianteId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'ID del estudiante en MongoDB'
  },
  cursoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cursos',
      key: 'id'
    }
  },
  anioEscolarId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'anios_escolares',
      key: 'id'
    }
  },
  usuarioPadreId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('Preinscrito', 'Pendiente', 'Aprobada', 'Rechazada', 'Activa', 'Retirada'),
    allowNull: false,
    defaultValue: 'Preinscrito'
  },
  fechaPreinscripcion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaMatricula: {
    type: DataTypes.DATE,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  documentacionCompleta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pagoMatriculaRealizado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'matriculas',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

module.exports = Matricula;
