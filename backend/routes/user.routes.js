const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', authorize('Administrador', 'Secretaria'), userController.getAllUsers);
router.get('/:id', authorize('Administrador', 'Secretaria'), userController.getUserById);
router.post('/', authorize('Administrador'), userController.createUser);
router.put('/:id', authorize('Administrador'), userController.updateUser);
router.delete('/:id', authorize('Administrador'), userController.deleteUser);

module.exports = router;
