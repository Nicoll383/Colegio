const { Estudiante } = require('../models');

// Obtener todos los estudiantes
exports.getAllEstudiantes = async (req, res) => {
  try {
    const { search, estado, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (estado) {
      filter.estado = estado;
    }

    if (search) {
      filter.$or = [
        { nombres: { $regex: search, $options: 'i' } },
        { apellidos: { $regex: search, $options: 'i' } },
        { 'documento.numero': { $regex: search, $options: 'i' } }
      ];
    }

    const offset = (page - 1) * limit;

    const estudiantes = await Estudiante.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ fechaRegistro: -1 });

    const total = await Estudiante.countDocuments(filter);

    res.json({
      success: true,
      data: {
        estudiantes,
        pagination: {
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener estudiante por ID
exports.getEstudianteById = async (req, res) => {
  try {
    const { id } = req.params;

    const estudiante = await Estudiante.findById(id);

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    res.json({
      success: true,
      data: estudiante
    });
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Crear estudiante
exports.createEstudiante = async (req, res) => {
  try {
    const estudianteData = req.body;

    // Verificar si ya existe un estudiante con ese documento
    const existingEstudiante = await Estudiante.findOne({
      'documento.numero': estudianteData.documento.numero
    });

    if (existingEstudiante) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un estudiante con ese número de documento'
      });
    }

    const estudiante = await Estudiante.create(estudianteData);

    res.status(201).json({
      success: true,
      message: 'Estudiante registrado exitosamente',
      data: estudiante
    });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Actualizar estudiante
exports.updateEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const estudiante = await Estudiante.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Estudiante actualizado exitosamente',
      data: estudiante
    });
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Eliminar estudiante (cambiar estado a Inactivo)
exports.deleteEstudiante = async (req, res) => {
  try {
    const { id } = req.params;

    const estudiante = await Estudiante.findByIdAndUpdate(
      id,
      { estado: 'Inactivo' },
      { new: true }
    );

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Estudiante desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Agregar documento a estudiante
exports.addDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, nombre } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó archivo'
      });
    }

    const estudiante = await Estudiante.findById(id);

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    const documento = {
      tipo,
      nombre: nombre || req.file.originalname,
      url: req.file.path,
      fechaCarga: new Date()
    };

    estudiante.documentos.push(documento);
    await estudiante.save();

    res.json({
      success: true,
      message: 'Documento agregado exitosamente',
      data: documento
    });
  } catch (error) {
    console.error('Error al agregar documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Agregar apoderado
exports.addApoderado = async (req, res) => {
  try {
    const { id } = req.params;
    const apoderadoData = req.body;

    const estudiante = await Estudiante.findById(id);

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    // Si es principal, desmarcar otros apoderados principales
    if (apoderadoData.esPrincipal) {
      estudiante.apoderados.forEach(a => a.esPrincipal = false);
    }

    estudiante.apoderados.push(apoderadoData);
    await estudiante.save();

    res.json({
      success: true,
      message: 'Apoderado agregado exitosamente',
      data: estudiante
    });
  } catch (error) {
    console.error('Error al agregar apoderado:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
