const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', authorize('Administrador', 'Secretaria', 'Finanzas'), pagoController.getAllPagos);
router.get('/mis-pagos', authorize('Padre'), pagoController.getMisPagos);
router.get('/matricula/:matriculaId', pagoController.getPagosPorMatricula);
router.get('/:id', pagoController.getPagoById);
router.post('/', authorize('Administrador', 'Secretaria', 'Finanzas'), pagoController.createPago);
router.put('/:id/anular', authorize('Administrador', 'Finanzas'), pagoController.anularPago);

module.exports = router;
