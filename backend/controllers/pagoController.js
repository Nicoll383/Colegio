const { Pago, Matricula, Curso, AnioEscolar } = require('../models');
const { sequelize } = require('../config/database');

// Generar código de pago
const generateCodigoPago = async () => {
  const count = await Pago.count();
  const numero = String(count + 1).padStart(6, '0');
  return `PAG-${Date.now()}-${numero}`;
};

// Obtener todos los pagos
exports.getAllPagos = async (req, res) => {
  try {
    const { matriculaId, estado, tipoPago, page = 1, limit = 10 } = req.query;

    const where = {};
    if (matriculaId) where.matriculaId = matriculaId;
    if (estado) where.estado = estado;
    if (tipoPago) where.tipoPago = tipoPago;

    const offset = (page - 1) * limit;

    const { count, rows: pagos } = await Pago.findAndCountAll({
      where,
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            { model: Curso, as: 'curso' },
            { model: AnioEscolar, as: 'anioEscolar' }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['fechaPago', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        pagos,
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener pago por ID
exports.getPagoById = async (req, res) => {
  try {
    const { id } = req.params;

    const pago = await Pago.findByPk(id, {
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            { model: Curso, as: 'curso' },
            { model: AnioEscolar, as: 'anioEscolar' }
          ]
        }
      ]
    });

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    res.json({
      success: true,
      data: pago
    });
  } catch (error) {
    console.error('Error al obtener pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Registrar pago
exports.createPago = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      matriculaId,
      tipoPago,
      concepto,
      monto,
      metodoPago,
      numeroComprobante,
      observaciones
    } = req.body;

    // Validar campos requeridos
    if (!matriculaId || !tipoPago || !concepto || !monto || !metodoPago) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios son requeridos'
      });
    }

    // Verificar que la matrícula existe
    const matricula = await Matricula.findByPk(matriculaId);
    if (!matricula) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Matrícula no encontrada'
      });
    }

    // Generar código de pago
    const codigoPago = await generateCodigoPago();

    // Crear pago
    const pago = await Pago.create({
      codigoPago,
      matriculaId,
      tipoPago,
      concepto,
      monto,
      metodoPago,
      numeroComprobante,
      observaciones,
      usuarioRegistraId: req.user.id,
      fechaPago: new Date(),
      estado: 'Pagado'
    }, { transaction: t });

    // Si es pago de matrícula, actualizar estado de matrícula
    if (tipoPago === 'Matricula') {
      matricula.pagoMatriculaRealizado = true;

      // Si la matrícula está aprobada, activarla
      if (matricula.estado === 'Aprobada') {
        matricula.estado = 'Activa';
      }

      await matricula.save({ transaction: t });
    }

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Pago registrado exitosamente',
      data: pago
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al registrar pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Anular pago
exports.anularPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones } = req.body;

    const pago = await Pago.findByPk(id);

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    if (pago.estado === 'Anulado') {
      return res.status(400).json({
        success: false,
        message: 'El pago ya está anulado'
      });
    }

    pago.estado = 'Anulado';
    pago.observaciones = observaciones || pago.observaciones;
    await pago.save();

    res.json({
      success: true,
      message: 'Pago anulado exitosamente',
      data: pago
    });
  } catch (error) {
    console.error('Error al anular pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener pagos de una matrícula
exports.getPagosPorMatricula = async (req, res) => {
  try {
    const { matriculaId } = req.params;

    const pagos = await Pago.findAll({
      where: { matriculaId },
      order: [['fechaPago', 'DESC']]
    });

    res.json({
      success: true,
      data: pagos
    });
  } catch (error) {
    console.error('Error al obtener pagos de matrícula:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener mis pagos (para padres)
exports.getMisPagos = async (req, res) => {
  try {
    // Obtener matrículas del padre
    const matriculas = await Matricula.findAll({
      where: { usuarioPadreId: req.user.id },
      attributes: ['id']
    });

    const matriculaIds = matriculas.map(m => m.id);

    const pagos = await Pago.findAll({
      where: {
        matriculaId: matriculaIds
      },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            { model: Curso, as: 'curso' },
            { model: AnioEscolar, as: 'anioEscolar' }
          ]
        }
      ],
      order: [['fechaPago', 'DESC']]
    });

    res.json({
      success: true,
      data: pagos
    });
  } catch (error) {
    console.error('Error al obtener mis pagos:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
