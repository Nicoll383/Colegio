const { AnioEscolar, Curso } = require('../models');
const { sequelize } = require('../config/database');

// Obtener todos los años escolares
exports.getAllAniosEscolares = async (req, res) => {
  try {
    const { activo } = req.query;

    const where = {};
    if (activo !== undefined) where.activo = activo === 'true';

    const aniosEscolares = await AnioEscolar.findAll({
      where,
      order: [['nombre', 'DESC']]
    });

    res.json({
      success: true,
      data: aniosEscolares
    });
  } catch (error) {
    console.error('Error al obtener años escolares:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener año escolar actual
exports.getAnioEscolarActual = async (req, res) => {
  try {
    const anioEscolar = await AnioEscolar.findOne({
      where: { esActual: true }
    });

    if (!anioEscolar) {
      return res.status(404).json({
        success: false,
        message: 'No hay año escolar actual configurado'
      });
    }

    res.json({
      success: true,
      data: anioEscolar
    });
  } catch (error) {
    console.error('Error al obtener año escolar actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener año escolar por ID
exports.getAnioEscolarById = async (req, res) => {
  try {
    const { id } = req.params;

    const anioEscolar = await AnioEscolar.findByPk(id);

    if (!anioEscolar) {
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    res.json({
      success: true,
      data: anioEscolar
    });
  } catch (error) {
    console.error('Error al obtener año escolar:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Crear año escolar
exports.createAnioEscolar = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      nombre,
      fechaInicio,
      fechaFin,
      fechaInicioMatricula,
      fechaFinMatricula,
      costoMatricula,
      costoPension,
      numeroPensiones,
      esActual
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !fechaInicio || !fechaFin || !fechaInicioMatricula || !fechaFinMatricula) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios son requeridos'
      });
    }

    // Si es actual, desmarcar otros años escolares
    if (esActual) {
      await AnioEscolar.update(
        { esActual: false },
        { where: { esActual: true }, transaction: t }
      );
    }

    // Crear año escolar
    const anioEscolar = await AnioEscolar.create({
      nombre,
      fechaInicio,
      fechaFin,
      fechaInicioMatricula,
      fechaFinMatricula,
      costoMatricula: costoMatricula || 0,
      costoPension: costoPension || 0,
      numeroPensiones: numeroPensiones || 10,
      esActual: esActual || false
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Año escolar creado exitosamente',
      data: anioEscolar
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al crear año escolar:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Actualizar año escolar
exports.updateAnioEscolar = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const updateData = req.body;

    const anioEscolar = await AnioEscolar.findByPk(id);

    if (!anioEscolar) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    // Si se marca como actual, desmarcar otros
    if (updateData.esActual === true) {
      await AnioEscolar.update(
        { esActual: false },
        { where: { esActual: true, id: { [require('sequelize').Op.ne]: id } }, transaction: t }
      );
    }

    // Actualizar campos
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        anioEscolar[key] = updateData[key];
      }
    });

    await anioEscolar.save({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: 'Año escolar actualizado exitosamente',
      data: anioEscolar
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar año escolar:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Eliminar año escolar
exports.deleteAnioEscolar = async (req, res) => {
  try {
    const { id } = req.params;

    const anioEscolar = await AnioEscolar.findByPk(id);

    if (!anioEscolar) {
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    // Verificar si tiene cursos asociados
    const cursosAsociados = await Curso.count({
      where: { anioEscolarId: id }
    });

    if (cursosAsociados > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un año escolar con cursos asociados'
      });
    }

    anioEscolar.activo = false;
    await anioEscolar.save();

    res.json({
      success: true,
      message: 'Año escolar desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar año escolar:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
