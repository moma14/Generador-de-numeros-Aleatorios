const express = require('express');
const router = express.Router();
const generateBernoulli = require('../models/Discretas.js/Bernoulli');
const generateNormal = require('../models/Continuas/Normal'); // Importamos el modelo para la distribución normal

// Función para generar Uniforme
const generateUniform = (min, max, count) => {
    return Array.from({ length: count }, () => Math.random() * (max - min) + min);
};

// Ruta principal
router.get('/', (req, res) => {
    res.render('index');
});

router.post('/generate', (req, res) => {
    console.log('Datos recibidos en el servidor (raw):', JSON.stringify(req.body, null, 2));

    const { type, params } = req.body;

    if (!type) {
        console.error('El campo "type" no está presente en la solicitud.');
        return res.status(400).json({ error: 'Falta el tipo de distribución.' });
    }

    const normalizedType = type.trim().toLowerCase();
    console.log('Tipo de distribución normalizado:', normalizedType);

    // Procesar Distribuciones
    try {
        if (normalizedType === 'uniform') {
            console.log('Procesando distribución uniforme...');
            const { min, max, count } = params;

            if (min >= max || count <= 0 || !Number.isInteger(count)) {
                return res.status(400).json({
                    error: 'Parámetros inválidos: "min" debe ser menor que "max" y "count" debe ser un entero positivo.',
                });
            }

            const results = generateUniform(min, max, count);
            console.log('Resultados generados (uniform):', results);
            return res.json({ results });

        } else if (normalizedType === 'bernoulli') {
            console.log('Procesando distribución Bernoulli...');
            const { p, count } = params;

            if (p < 0 || p > 1 || count <= 0 || !Number.isInteger(count)) {
                return res.status(400).json({
                    error: 'Parámetros inválidos: "p" debe estar entre 0 y 1, "count" debe ser un entero positivo.',
                });
            }

            const results = generateBernoulli(p, count);
            console.log('Resultados generados (bernoulli):', results);
            return res.json({ results });

        } else if (normalizedType === 'normal') {
            console.log('Procesando distribución Normal...');
            const { mean, stddev, count } = params;

            if (stddev <= 0 || count <= 0 || !Number.isInteger(count)) {
                return res.status(400).json({
                    error: 'Parámetros inválidos: "stddev" debe ser positivo y "count" debe ser un entero positivo.',
                });
            }

            const results = generateNormal(mean, stddev, count);
            console.log('Resultados generados (normal):', results);
            return res.json({ results });

        } else {
            console.error('Tipo de distribución no soportada:', normalizedType);
            return res.status(400).json({ error: 'Tipo de distribución no soportada.' });
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        return res.status(500).json({ error: 'Error interno al generar números.' });
    }
});

module.exports = router;
