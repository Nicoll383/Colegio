const { Matricula, Curso, AnioEscolar, User, Estudiante } = require('../models');
const { sequelize } = require('../config/database');

// Generar código de matrícula
const generateCodigoMatricula = async (anioEscolarId) => {
  const anio = await AnioEscolar.findByPk(anioEscolarId);
  const count = await Matricula.count({ where: { anioEscolarId } });
  const numero = String(count + 1).padStart(4, '0');
  return `MAT-${anio.nombre}-${numero}`;
};

// Obtener todas las matrículas
exports.getAllMatriculas = async (req, res) => {
  try {
    const { estado, cursoId, anioEscolarId, page = 1, limit = 10 } = req.query;

    const where = {};

    if (estado) where.estado = estado;
    if (cursoId) where.cursoId = cursoId;
    if (anioEscolarId) where.anioEscolarId = anioEscolarId;

    const offset = (page - 1) * limit;

    const { count, rows: matriculas } = await Matricula.findAndCountAll({
      where,
      include: [
        {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nivel', 'grado', 'seccion', 'turno']
        },
        {
          model: AnioEscolar,
          as: 'anioEscolar',
          attributes: ['id', 'nombre']
        },
        {
          model: User,
          as: 'padre',
          attributes: ['id', 'nombre', 'apellido', 'email', 'telefono']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']]
    });

    // Obtener datos de estudiantes de MongoDB
    const estudianteIds = matriculas.map(m => m.estudianteId);
    const estudiantes = await Estudiante.find({ _id: { $in: estudianteIds } });

    // Mapear estudiantes a matrículas
    const matriculasConEstudiantes = matriculas.map(matricula => {
      const estudiante = estudiantes.find(e => e._id.toString() === matricula.estudianteId);
      return {
        ...matricula.toJSON(),
        estudiante: estudiante ? {
          id: estudiante._id,
          nombreCompleto: estudiante.nombreCompleto,
          documento: estudiante.documento
        } : null
      };
    });

    res.json({
      success: true,
      data: {
        matriculas: matriculasConEstudiantes,
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener matrículas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener matrícula por ID
exports.getMatriculaById = async (req, res) => {
  try {
    const { id } = req.params;

    const matricula = await Matricula.findByPk(id, {
      include: [
        { model: Curso, as: 'curso' },
        { model: AnioEscolar, as: 'anioEscolar' },
        { model: User, as: 'padre', attributes: { exclude: ['password'] } }
      ]
    });

    if (!matricula) {
      return res.status(404).json({
        success: false,
        message: 'Matrícula no encontrada'
      });
    }

    // Obtener estudiante de MongoDB
    const estudiante = await Estudiante.findById(matricula.estudianteId);

    res.json({
      success: true,
      data: {
        ...matricula.toJSON(),
        estudiante
      }
    });
  } catch (error) {
    console.error('Error al obtener matrícula:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Crear preinscripción
exports.createPreinscripcion = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { estudianteId, cursoId, anioEscolarId, usuarioPadreId } = req.body;

    // Validar campos requeridos
    if (!estudianteId || !cursoId || !anioEscolarId) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    // Verificar que el estudiante existe
    const estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    // Verificar que el curso existe y tiene vacantes
    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    if (curso.vacantesDisponibles <= 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'No hay vacantes disponibles en este curso'
      });
    }

    // Verificar que el año escolar existe y está activo
    const anioEscolar = await AnioEscolar.findByPk(anioEscolarId);
    if (!anioEscolar || !anioEscolar.activo) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Año escolar no válido'
      });
    }

    // Verificar que no exista una matrícula activa para este estudiante en este año
    const matriculaExistente = await Matricula.findOne({
      where: {
        estudianteId,
        anioEscolarId,
        estado: ['Preinscrito', 'Pendiente', 'Aprobada', 'Activa']
      }
    });

    if (matriculaExistente) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'El estudiante ya tiene una matrícula en este año escolar'
      });
    }

    // Generar código de matrícula
    const codigoMatricula = await generateCodigoMatricula(anioEscolarId);

    // Crear preinscripción
    const matricula = await Matricula.create({
      codigoMatricula,
      estudianteId,
      cursoId,
      anioEscolarId,
      usuarioPadreId: usuarioPadreId || req.user.id,
      estado: 'Preinscrito',
      fechaPreinscripcion: new Date()
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Preinscripción creada exitosamente',
      data: matricula
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al crear preinscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Aprobar matrícula
exports.aprobarMatricula = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const matricula = await Matricula.findByPk(id);

    if (!matricula) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Matrícula no encontrada'
      });
    }

    if (matricula.estado !== 'Preinscrito' && matricula.estado !== 'Pendiente') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'La matrícula no está en estado válido para aprobar'
      });
    }

    // Verificar vacantes
    const curso = await Curso.findByPk(matricula.cursoId);
    if (curso.vacantesDisponibles <= 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'No hay vacantes disponibles'
      });
    }

    // Actualizar matrícula
    matricula.estado = 'Aprobada';
    matricula.fechaMatricula = new Date();
    await matricula.save({ transaction: t });

    // Reducir vacantes
    curso.vacantesDisponibles -= 1;
    await curso.save({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: 'Matrícula aprobada exitosamente',
      data: matricula
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al aprobar matrícula:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Rechazar matrícula
exports.rechazarMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones } = req.body;

    const matricula = await Matricula.findByPk(id);

    if (!matricula) {
      return res.status(404).json({
        success: false,
        message: 'Matrícula no encontrada'
      });
    }

    matricula.estado = 'Rechazada';
    matricula.observaciones = observaciones;
    await matricula.save();

    res.json({
      success: true,
      message: 'Matrícula rechazada',
      data: matricula
    });
  } catch (error) {
    console.error('Error al rechazar matrícula:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Activar matrícula (cuando se pague)
exports.activarMatricula = async (req, res) => {
  try {
    const { id } = req.params;

    const matricula = await Matricula.findByPk(id);

    if (!matricula) {
      return res.status(404).json({
        success: false,
        message: 'Matrícula no encontrada'
      });
    }

    if (matricula.estado !== 'Aprobada') {
      return res.status(400).json({
        success: false,
        message: 'La matrícula debe estar aprobada primero'
      });
    }

    matricula.estado = 'Activa';
    await matricula.save();

    res.json({
      success: true,
      message: 'Matrícula activada exitosamente',
      data: matricula
    });
  } catch (error) {
    console.error('Error al activar matrícula:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener matrículas del usuario padre actual
exports.getMisMatriculas = async (req, res) => {
  try {
    const matriculas = await Matricula.findAll({
      where: { usuarioPadreId: req.user.id },
      include: [
        { model: Curso, as: 'curso' },
        { model: AnioEscolar, as: 'anioEscolar' }
      ],
      order: [['fechaCreacion', 'DESC']]
    });

    // Obtener estudiantes
    const estudianteIds = matriculas.map(m => m.estudianteId);
    const estudiantes = await Estudiante.find({ _id: { $in: estudianteIds } });

    const matriculasConEstudiantes = matriculas.map(matricula => {
      const estudiante = estudiantes.find(e => e._id.toString() === matricula.estudianteId);
      return {
        ...matricula.toJSON(),
        estudiante
      };
    });

    res.json({
      success: true,
      data: matriculasConEstudiantes
    });
  } catch (error) {
    console.error('Error al obtener mis matrículas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
