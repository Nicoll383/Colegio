const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const estudianteRoutes = require('./estudiante.routes');
const matriculaRoutes = require('./matricula.routes');
const cursoRoutes = require('./curso.routes');
const anioEscolarRoutes = require('./anioEscolar.routes');
const pagoRoutes = require('./pago.routes');
const reporteRoutes = require('./reporte.routes');

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/estudiantes', estudianteRoutes);
router.use('/matriculas', matriculaRoutes);
router.use('/cursos', cursoRoutes);
router.use('/anios-escolares', anioEscolarRoutes);
router.use('/pagos', pagoRoutes);
router.use('/reportes', reporteRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date()
  });
});

module.exports = router;
