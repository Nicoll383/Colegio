const { Matricula, Curso, AnioEscolar, Pago, User, Estudiante } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Reporte de matrículas por curso
exports.reporteMatriculasPorCurso = async (req, res) => {
  try {
    const { anioEscolarId } = req.query;

    if (!anioEscolarId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el ID del año escolar'
      });
    }

    const cursos = await Curso.findAll({
      where: { anioEscolarId },
      include: [
        {
          model: Matricula,
          as: 'matriculas',
          where: { estado: ['Aprobada', 'Activa'] },
          required: false
        }
      ],
      order: [['nivel', 'ASC'], ['grado', 'ASC'], ['seccion', 'ASC']]
    });

    const reporte = cursos.map(curso => ({
      curso: `${curso.nivel} - ${curso.grado}° ${curso.seccion}`,
      nivel: curso.nivel,
      grado: curso.grado,
      seccion: curso.seccion,
      turno: curso.turno,
      capacidadMaxima: curso.capacidadMaxima,
      matriculados: curso.matriculas.length,
      vacantesDisponibles: curso.vacantesDisponibles,
      porcentajeOcupacion: ((curso.matriculas.length / curso.capacidadMaxima) * 100).toFixed(2)
    }));

    // Resumen general
    const resumen = {
      totalCursos: cursos.length,
      totalCapacidad: cursos.reduce((sum, c) => sum + c.capacidadMaxima, 0),
      totalMatriculados: cursos.reduce((sum, c) => sum + c.matriculas.length, 0),
      totalVacantes: cursos.reduce((sum, c) => sum + c.vacantesDisponibles, 0)
    };

    res.json({
      success: true,
      data: {
        reporte,
        resumen
      }
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Reporte de pagos
exports.reportePagos = async (req, res) => {
  try {
    const { anioEscolarId, fechaInicio, fechaFin, tipoPago } = req.query;

    const where = { estado: 'Pagado' };

    if (tipoPago) {
      where.tipoPago = tipoPago;
    }

    if (fechaInicio && fechaFin) {
      where.fechaPago = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }

    let matriculaWhere = {};
    if (anioEscolarId) {
      matriculaWhere.anioEscolarId = anioEscolarId;
    }

    const pagos = await Pago.findAll({
      where,
      include: [
        {
          model: Matricula,
          as: 'matricula',
          where: matriculaWhere,
          include: [
            { model: Curso, as: 'curso' },
            { model: AnioEscolar, as: 'anioEscolar' }
          ]
        }
      ],
      order: [['fechaPago', 'DESC']]
    });

    // Calcular totales
    const totales = {
      totalPagos: pagos.length,
      montoTotal: pagos.reduce((sum, p) => sum + parseFloat(p.monto), 0),
      porTipo: {}
    };

    // Agrupar por tipo de pago
    pagos.forEach(pago => {
      if (!totales.porTipo[pago.tipoPago]) {
        totales.porTipo[pago.tipoPago] = {
          cantidad: 0,
          monto: 0
        };
      }
      totales.porTipo[pago.tipoPago].cantidad++;
      totales.porTipo[pago.tipoPago].monto += parseFloat(pago.monto);
    });

    res.json({
      success: true,
      data: {
        pagos,
        totales
      }
    });
  } catch (error) {
    console.error('Error al generar reporte de pagos:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Reporte de vacantes disponibles
exports.reporteVacantes = async (req, res) => {
  try {
    const { anioEscolarId } = req.query;

    if (!anioEscolarId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el ID del año escolar'
      });
    }

    const cursos = await Curso.findAll({
      where: { anioEscolarId, activo: true },
      order: [['nivel', 'ASC'], ['grado', 'ASC'], ['seccion', 'ASC']]
    });

    const reportePorNivel = {};

    cursos.forEach(curso => {
      if (!reportePorNivel[curso.nivel]) {
        reportePorNivel[curso.nivel] = {
          cursos: [],
          totalVacantes: 0,
          totalCapacidad: 0
        };
      }

      reportePorNivel[curso.nivel].cursos.push({
        curso: `${curso.grado}° ${curso.seccion}`,
        vacantes: curso.vacantesDisponibles,
        capacidad: curso.capacidadMaxima,
        turno: curso.turno
      });

      reportePorNivel[curso.nivel].totalVacantes += curso.vacantesDisponibles;
      reportePorNivel[curso.nivel].totalCapacidad += curso.capacidadMaxima;
    });

    res.json({
      success: true,
      data: reportePorNivel
    });
  } catch (error) {
    console.error('Error al generar reporte de vacantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Dashboard con estadísticas generales
exports.dashboard = async (req, res) => {
  try {
    const { anioEscolarId } = req.query;

    if (!anioEscolarId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el ID del año escolar'
      });
    }

    // Estadísticas de matrículas
    const totalMatriculas = await Matricula.count({
      where: { anioEscolarId }
    });

    const matriculasPorEstado = await Matricula.findAll({
      where: { anioEscolarId },
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['estado'],
      raw: true
    });

    // Estadísticas de cursos
    const totalCursos = await Curso.count({
      where: { anioEscolarId, activo: true }
    });

    const cursos = await Curso.findAll({
      where: { anioEscolarId, activo: true },
      attributes: ['capacidadMaxima', 'vacantesDisponibles']
    });

    const totalCapacidad = cursos.reduce((sum, c) => sum + c.capacidadMaxima, 0);
    const totalVacantes = cursos.reduce((sum, c) => sum + c.vacantesDisponibles, 0);

    // Estadísticas de pagos
    const pagosHoy = await Pago.count({
      where: {
        fechaPago: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        },
        estado: 'Pagado'
      },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          where: { anioEscolarId },
          attributes: []
        }
      ]
    });

    const [ingresosMes] = await Pago.findAll({
      where: {
        fechaPago: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        },
        estado: 'Pagado'
      },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          where: { anioEscolarId },
          attributes: []
        }
      ],
      attributes: [
        [sequelize.fn('SUM', sequelize.col('monto')), 'total']
      ],
      raw: true
    });

    // Total de estudiantes activos
    const totalEstudiantes = await Estudiante.countDocuments({ estado: 'Activo' });

    res.json({
      success: true,
      data: {
        matriculas: {
          total: totalMatriculas,
          porEstado: matriculasPorEstado
        },
        cursos: {
          total: totalCursos,
          capacidadTotal: totalCapacidad,
          vacantesDisponibles: totalVacantes,
          ocupacion: totalCapacidad > 0 ?
            (((totalCapacidad - totalVacantes) / totalCapacidad) * 100).toFixed(2) : 0
        },
        pagos: {
          hoy: pagosHoy,
          ingresosMes: parseFloat(ingresosMes?.total || 0)
        },
        estudiantes: {
          total: totalEstudiantes
        }
      }
    });
  } catch (error) {
    console.error('Error al generar dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Reporte comparativo entre años
exports.reporteComparativo = async (req, res) => {
  try {
    const aniosEscolares = await AnioEscolar.findAll({
      where: { activo: true },
      order: [['nombre', 'DESC']],
      limit: 3
    });

    const comparacion = await Promise.all(
      aniosEscolares.map(async (anio) => {
        const matriculas = await Matricula.count({
          where: {
            anioEscolarId: anio.id,
            estado: ['Aprobada', 'Activa']
          }
        });

        const pagos = await Pago.findAll({
          where: { estado: 'Pagado' },
          include: [
            {
              model: Matricula,
              as: 'matricula',
              where: { anioEscolarId: anio.id },
              attributes: []
            }
          ],
          attributes: [
            [sequelize.fn('SUM', sequelize.col('monto')), 'total']
          ],
          raw: true
        });

        return {
          anio: anio.nombre,
          matriculas,
          ingresos: parseFloat(pagos[0]?.total || 0)
        };
      })
    );

    res.json({
      success: true,
      data: comparacion
    });
  } catch (error) {
    console.error('Error al generar reporte comparativo:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
