const express = require('express');
const router = express.Router();
const generateBinomial = require('../models/Discretas.js/Binomial'); // Ajusta la ruta según tu estructura

// Ruta para la distribución binomial
router.post('/binomial', (req, res) => {
    console.log('Datos recibidos en el backend:', req.body);

    const { n, p, count } = req.body;

    try {
        // Validar parámetros en el servidor
        if (!n || !p || !count) {
            console.error('Parámetros faltantes o inválidos:', { n, p, count });
            return res.status(400).json({ error: 'Faltan parámetros: n, p o count.' });
        }

        console.log('Generando números binomiales...');
        const results = generateBinomial(parseInt(n), parseFloat(p), parseInt(count));
        console.log('Resultados generados:', results);

        res.json({ results });
    } catch (error) {
        console.error('Error al generar números binomiales:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
