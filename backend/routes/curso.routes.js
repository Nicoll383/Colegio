const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', cursoController.getAllCursos);
router.get('/:id', cursoController.getCursoById);
router.get('/:id/estudiantes', authorize('Administrador', 'Secretaria', 'Docente'), cursoController.getEstudiantesPorCurso);
router.post('/', authorize('Administrador', 'Secretaria'), cursoController.createCurso);
router.put('/:id', authorize('Administrador', 'Secretaria'), cursoController.updateCurso);
router.delete('/:id', authorize('Administrador'), cursoController.deleteCurso);

module.exports = router;
