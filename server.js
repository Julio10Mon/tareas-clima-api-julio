require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());              // cabeceras de seguridad HTTP
app.use(express.json());        // parseo seguro de JSON
app.use(morgan('dev'));         // bitácora de peticiones

// Ruta de prueba con validación de entrada
app.post(
    '/api/echo',
    body('mensaje').isString().trim().isLength({ min: 1, max: 200 }).escape(),
    (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
    }
    res.json({ recibido: req.body.mensaje });
    }
);

app.get('/api/salud', (req, res) => {
    res.json({ status: 'ok' });
});

// =========================================================================
// JUSTIFICACIÓN DE CODIFICACIÓN SEGURA:
// Este endpoint aplica el principio de "Validación de Entradas" (Input Validation)
// y "Defensa en Profundidad". Nunca se debe confiar en los datos que envía el cliente.
// Al validar y sanitizar el correo con .isEmail() y asegurar que el nombre no esté
// vacío con .notEmpty(), evitamos que datos mal formados, nulos o maliciosos 
// comprometan la integridad y la lógica de negocio de nuestra aplicación.
// =========================================================================
app.post(
  '/api/registro',
  [
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre es requerido')
      .escape(),
    body('correo')
      .trim()
      .isEmail().withMessage('Debe proporcionar un correo electrónico válido')
      .normalizeEmail()
  ],
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, correo } = req.body;

    res.status(201).json({
      mensaje: 'Usuario registrado con éxito de forma segura',
      usuario: { nombre, correo }
    });
  }
);

module.exports = app;