const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigoPago: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  matriculaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'matriculas',
      key: 'id'
    }
  },
  tipoPago: {
    type: DataTypes.ENUM('Matricula', 'Pension', 'Otros'),
    allowNull: false
  },
  concepto: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodoPago: {
    type: DataTypes.ENUM('Efectivo', 'Tarjeta', 'Transferencia', 'Yape', 'Plin'),
    allowNull: false
  },
  numeroComprobante: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  usuarioRegistraId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Pagado', 'Anulado'),
    allowNull: false,
    defaultValue: 'Pagado'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'pagos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

module.exports = Pago;
