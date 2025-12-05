const express = require('express');
const router = express.Router();
const anioEscolarController = require('../controllers/anioEscolarController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', anioEscolarController.getAllAniosEscolares);
router.get('/actual', anioEscolarController.getAnioEscolarActual);
router.get('/:id', anioEscolarController.getAnioEscolarById);
router.post('/', authorize('Administrador'), anioEscolarController.createAnioEscolar);
router.put('/:id', authorize('Administrador'), anioEscolarController.updateAnioEscolar);
router.delete('/:id', authorize('Administrador'), anioEscolarController.deleteAnioEscolar);

module.exports = router;
