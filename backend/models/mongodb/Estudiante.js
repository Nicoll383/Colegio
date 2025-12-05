const mongoose = require('mongoose');

const EstudianteSchema = new mongoose.Schema({
  // Datos Personales
  nombres: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  documento: {
    tipo: {
      type: String,
      enum: ['DNI', 'Pasaporte', 'CE', 'RUT', 'Otro'],
      required: true
    },
    numero: {
      type: String,
      required: true,
      unique: true
    }
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  lugarNacimiento: {
    pais: String,
    departamento: String,
    ciudad: String
  },
  genero: {
    type: String,
    enum: ['Masculino', 'Femenino', 'Otro'],
    required: true
  },
  direccion: {
    calle: String,
    numero: String,
    distrito: String,
    ciudad: String,
    codigoPostal: String
  },
  telefonoContacto: String,
  email: {
    type: String,
    lowercase: true,
    trim: true
  },

  // Datos Familiares
  apoderados: [{
    tipo: {
      type: String,
      enum: ['Padre', 'Madre', 'Tutor', 'Abuelo', 'Otro'],
      required: true
    },
    nombres: {
      type: String,
      required: true
    },
    apellidos: {
      type: String,
      required: true
    },
    documento: String,
    telefono: String,
    email: String,
    ocupacion: String,
    lugarTrabajo: String,
    esPrincipal: {
      type: Boolean,
      default: false
    },
    viveConEstudiante: {
      type: Boolean,
      default: true
    },
    usuarioId: {
      type: Number,
      ref: 'User'
    }
  }],

  // Información Médica
  informacionMedica: {
    tipoSangre: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    alergias: [String],
    enfermedadesCronicas: [String],
    medicamentosRecurrentes: [String],
    seguroMedico: {
      tiene: Boolean,
      nombre: String,
      numeroPoliza: String
    },
    contactoEmergencia: {
      nombre: String,
      relacion: String,
      telefono: String
    },
    observaciones: String
  },

  // Historial Académico
  historialAcademico: [{
    anio: Number,
    institucion: String,
    nivel: String,
    grado: String,
    promedio: Number,
    observaciones: String
  }],

  // Documentos
  documentos: [{
    tipo: {
      type: String,
      enum: ['Partida Nacimiento', 'DNI', 'Foto', 'Certificado Estudios', 'Certificado Medico', 'Otro']
    },
    nombre: String,
    url: String,
    fechaCarga: {
      type: Date,
      default: Date.now
    }
  }],

  // Estado y Control
  estado: {
    type: String,
    enum: ['Activo', 'Inactivo', 'Retirado', 'Graduado'],
    default: 'Activo'
  },
  observaciones: String,
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para nombre completo
EstudianteSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombres} ${this.apellidos}`;
});

// Virtual para edad
EstudianteSchema.virtual('edad').get(function() {
  if (!this.fechaNacimiento) return null;
  const hoy = new Date();
  const nacimiento = new Date(this.fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
});

// Índices
EstudianteSchema.index({ 'documento.numero': 1 });
EstudianteSchema.index({ nombres: 'text', apellidos: 'text' });

module.exports = mongoose.model('Estudiante', EstudianteSchema);
