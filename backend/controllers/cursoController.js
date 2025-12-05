const { Curso, AnioEscolar, Matricula } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los cursos
exports.getAllCursos = async (req, res) => {
  try {
    const { nivel, anioEscolarId, activo, page = 1, limit = 50 } = req.query;

    const where = {};

    if (nivel) where.nivel = nivel;
    if (anioEscolarId) where.anioEscolarId = anioEscolarId;
    if (activo !== undefined) where.activo = activo === 'true';

    const offset = (page - 1) * limit;

    const { count, rows: cursos } = await Curso.findAndCountAll({
      where,
      include: [
        {
          model: AnioEscolar,
          as: 'anioEscolar',
          attributes: ['id', 'nombre', 'esActual']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nivel', 'ASC'], ['grado', 'ASC'], ['seccion', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        cursos,
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener curso por ID
exports.getCursoById = async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await Curso.findByPk(id, {
      include: [
        {
          model: AnioEscolar,
          as: 'anioEscolar'
        }
      ]
    });

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    res.json({
      success: true,
      data: curso
    });
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Crear curso
exports.createCurso = async (req, res) => {
  try {
    const { nivel, grado, seccion, capacidadMaxima, turno, anioEscolarId } = req.body;

    // Validar campos requeridos
    if (!nivel || !grado || !seccion || !anioEscolarId) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios son requeridos'
      });
    }

    // Verificar que el año escolar existe
    const anioEscolar = await AnioEscolar.findByPk(anioEscolarId);
    if (!anioEscolar) {
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    // Verificar si ya existe un curso con la misma combinación
    const cursoExistente = await Curso.findOne({
      where: { nivel, grado, seccion, anioEscolarId }
    });

    if (cursoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un curso con esa combinación'
      });
    }

    // Crear curso
    const curso = await Curso.create({
      nivel,
      grado,
      seccion,
      capacidadMaxima: capacidadMaxima || 30,
      vacantesDisponibles: capacidadMaxima || 30,
      turno: turno || 'Mañana',
      anioEscolarId
    });

    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: curso
    });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Actualizar curso
exports.updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacidadMaxima, turno, activo } = req.body;

    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Actualizar capacidad y recalcular vacantes
    if (capacidadMaxima !== undefined) {
      const diferencia = capacidadMaxima - curso.capacidadMaxima;
      curso.capacidadMaxima = capacidadMaxima;
      curso.vacantesDisponibles = Math.max(0, curso.vacantesDisponibles + diferencia);
    }

    if (turno) curso.turno = turno;
    if (typeof activo === 'boolean') curso.activo = activo;

    await curso.save();

    res.json({
      success: true,
      message: 'Curso actualizado exitosamente',
      data: curso
    });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Eliminar curso (desactivar)
exports.deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar si tiene matrículas activas
    const matriculasActivas = await Matricula.count({
      where: {
        cursoId: id,
        estado: ['Aprobada', 'Activa']
      }
    });

    if (matriculasActivas > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede desactivar un curso con matrículas activas'
      });
    }

    curso.activo = false;
    await curso.save();

    res.json({
      success: true,
      message: 'Curso desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener estudiantes de un curso
exports.getEstudiantesPorCurso = async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    const matriculas = await Matricula.findAll({
      where: {
        cursoId: id,
        estado: ['Aprobada', 'Activa']
      }
    });

    // Obtener estudiantes de MongoDB
    const { Estudiante } = require('../models');
    const estudianteIds = matriculas.map(m => m.estudianteId);
    const estudiantes = await Estudiante.find({ _id: { $in: estudianteIds } });

    res.json({
      success: true,
      data: {
        curso,
        estudiantes
      }
    });
  } catch (error) {
    console.error('Error al obtener estudiantes del curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
