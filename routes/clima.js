const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const { obtenerClima } = require('../services/clima');

function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  next();
}

// GET /api/clima/:ciudad — Endpoint independiente del reto
router.get('/:ciudad',
  [
    param('ciudad')
      .trim()
      .notEmpty().withMessage('El parámetro ciudad es requerido')
      .isAlpha('es-ES', { ignore: ' ' }).withMessage('La ciudad solo debe contener letras')
  ],
  validar,
  async (req, res) => {
    try {
      const clima = await obtenerClima(req.params.ciudad);
      res.status(200).json(clima);
    } catch (error) {
      res.status(502).json({ error: error.message });
    }
  }
);

module.exports = router;