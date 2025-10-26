const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

// Ruta protegida
router.get('/perfil', verifyToken, (req, res) => {
  res.json({
    message: 'Ruta protegida',
    userData: req.user  // contiene id y rol del usuario
  });
});

module.exports = router;
