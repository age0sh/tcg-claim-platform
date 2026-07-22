const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { username, nombres, apellidos, ciudad, correo, password } = req.body;
        
        if (!correo || !password) return res.status(400).json({ mensaje: 'Faltan datos' });

        const userExists = await User.findOne({ correo: correo.toLowerCase().trim() });
        if (userExists) return res.status(400).json({ mensaje: 'El correo ya está registrado' });

        const passwordEncriptada = await bcrypt.hash(password, 10);
        
        const nuevoUsuario = new User({ 
            username, nombres, apellidos, ciudad, 
            correo: correo.toLowerCase().trim(), 
            password: passwordEncriptada, 
            isVerified: true 
        });
        
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Registro exitoso' });
    } catch (e) { 
        console.error("Error en registro:", e);
        res.status(500).json({ mensaje: 'Error interno' }); 
    }
});

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        // Verificación de seguridad básica
        if (!identifier || !password) {
            return res.status(400).json({ mensaje: 'Credenciales incompletas' });
        }

        // Búsqueda segura
        const cleanEmail = identifier.toString().toLowerCase().trim();
        const user = await User.findOne({ correo: cleanEmail });
        
        if (!user) return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ usuario: user, token });
    } catch (e) {
        console.error("Error en login:", e);
        res.status(500).json({ mensaje: 'Error en el login' });
    }
});

module.exports = router;