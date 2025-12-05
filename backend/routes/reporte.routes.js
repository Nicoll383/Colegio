const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);
router.use(authorize('Administrador', 'Secretaria', 'Finanzas'));

router.get('/dashboard', reporteController.dashboard);
router.get('/matriculas-por-curso', reporteController.reporteMatriculasPorCurso);
router.get('/pagos', reporteController.reportePagos);
router.get('/vacantes', reporteController.reporteVacantes);
router.get('/comparativo', reporteController.reporteComparativo);

module.exports = router;
