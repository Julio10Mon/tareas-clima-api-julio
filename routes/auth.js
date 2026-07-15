const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const usuariosModel = require('../models/usuarios');
const verificarToken = require('../middleware/auth'); // Importación al inicio

// Middleware de validación mejorado
const validar = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
};

// Registro
router.post(
    '/registro',
    [
        body('correo').isEmail().withMessage('El correo no es válido').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    ],
    validar,
    async (req, res) => {
        try {
            const { correo, password } = req.body;
            
            if (usuariosModel.buscarPorCorreo(correo)) {
                return res.status(409).json({ error: 'El correo ya está registrado' });
            }

            const hash = await bcrypt.hash(password, 10);
            const usuario = usuariosModel.crear(correo, hash);
            
            res.status(201).json({ id: usuario.id, correo: usuario.correo });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);

// Login
router.post(
    '/login',
    [
        body('correo').isEmail().normalizeEmail(),
        body('password').notEmpty().withMessage('La contraseña es requerida')
    ],
    validar,
    async (req, res) => {
        try {
            const { correo, password } = req.body;
            const usuario = usuariosModel.buscarPorCorreo(correo);
            
            if (!usuario) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const coincide = await bcrypt.compare(password, usuario.password);
            if (!coincide) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { id: usuario.id, correo: usuario.correo },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Error al procesar el login' });
        }
    }
);

// Perfil (Ruta protegida)
router.get('/perfil', verificarToken, (req, res) => {
    res.status(200).json({
        mensaje: "Perfil del usuario",
        datos: req.usuario
    });
});

module.exports = router;