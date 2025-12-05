const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.use(authenticate);

router.get('/', estudianteController.getAllEstudiantes);
router.get('/:id', estudianteController.getEstudianteById);
router.post('/', authorize('Administrador', 'Secretaria', 'Padre'), estudianteController.createEstudiante);
router.put('/:id', authorize('Administrador', 'Secretaria', 'Padre'), estudianteController.updateEstudiante);
router.delete('/:id', authorize('Administrador', 'Secretaria'), estudianteController.deleteEstudiante);
router.post('/:id/documentos', authorize('Administrador', 'Secretaria', 'Padre'), upload.single('archivo'), estudianteController.addDocumento);
router.post('/:id/apoderados', authorize('Administrador', 'Secretaria'), estudianteController.addApoderado);

module.exports = router;
