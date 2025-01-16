const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No estás autorizado para acceder a este recurso.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto_jwt'); // Cambia 'mi_secreto_jwt' por tu clave secreta
        req.user = decoded; // Agrega el usuario decodificado a la solicitud para usarlo en otros controladores
        next(); // Continúa al siguiente middleware o controlador
    } catch (error) {
        console.error('Token inválido:', error.message);
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};
module.exports = verifyToken;