const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ mensaje: 'Acceso denegado, no hay token' });

    try {
        const token = authHeader.replace('Bearer ', '');
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Esto pone los datos del usuario en la petición
        next();
    } catch (err) {
        res.status(400).json({ mensaje: 'Token no válido' });
    }
};