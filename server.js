require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

// Importación de Enrutadores
const tareasRouter = require('./routes/tareas');
const climaRouter = require('./routes/clima');
const authRouter = require('./routes/auth');

// Importación de Middleware
const verificarToken = require('./middleware/auth');

const app = express();

// Middlewares globales
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// --- Rutas Públicas ---
app.use('/api/auth', authRouter);

// Ruta de prueba
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

// Healthcheck
app.get('/api/salud', (req, res) => {
    res.json({ status: 'ok' });
});

// Registro de usuario
app.post(
  '/api/registro',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido').escape(),
    body('correo').trim().isEmail().withMessage('Debe proporcionar un correo electrónico válido').normalizeEmail()
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

// --- Rutas Protegidas (Requieren Token) ---
app.use('/api/tareas', verificarToken, tareasRouter);
app.use('/api/clima', verificarToken, climaRouter);

module.exports = app;