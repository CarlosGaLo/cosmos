const express = require('express');
const router = express.Router();
const { registerUser, loginUser, recoverPassword } = require('../controllers/authController');


router.post('/recover-password', recoverPassword);
// Ruta de Registro
router.post('/register', registerUser);

// Ruta de Login
router.post('/login', loginUser);

module.exports = router;