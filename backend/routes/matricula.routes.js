const express = require('express');
const router = express.Router();
const matriculaController = require('../controllers/matriculaController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', authorize('Administrador', 'Secretaria', 'Finanzas'), matriculaController.getAllMatriculas);
router.get('/mis-matriculas', authorize('Padre'), matriculaController.getMisMatriculas);
router.get('/:id', matriculaController.getMatriculaById);
router.post('/', authorize('Administrador', 'Secretaria', 'Padre'), matriculaController.createPreinscripcion);
router.put('/:id/aprobar', authorize('Administrador', 'Secretaria'), matriculaController.aprobarMatricula);
router.put('/:id/rechazar', authorize('Administrador', 'Secretaria'), matriculaController.rechazarMatricula);
router.put('/:id/activar', authorize('Administrador', 'Secretaria', 'Finanzas'), matriculaController.activarMatricula);

module.exports = router;
