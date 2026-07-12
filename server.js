require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

// Importación de los Enrutadores Modulares
const tareasRouter = require('./routes/tareas');
const climaRouter = require('./routes/clima'); // Enrutador del Reto de la Sesión 3

const app = express();

app.use(helmet());          // Cabeceras de seguridad HTTP
app.use(express.json());    // Parseo seguro de JSON
app.use(morgan('dev'));     // Bitácora de peticiones en consola

// Registro de Rutas Modulares Principales
app.use('/api/tareas', tareasRouter);
app.use('/api/clima', climaRouter);   // Conexión del reto independiente

// Ruta de prueba con validación de entrada (Sesión 1)
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

// Endpoint de verificación de estado (Healthcheck)
app.get('/api/salud', (req, res) => {
    res.json({ status: 'ok' });
});

// Endpoint seguro de registro de usuarios (Sesión 2)
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