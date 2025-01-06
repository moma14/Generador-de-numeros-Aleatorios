const generateBernoulli = require('../models/Discretas.js/Bernoulli');
const generateNormal = require('../models/Continuas/Normal');
const generatePoisson = require('../models/Discretas.js/Poisson');

// Función auxiliar para generar números aleatorios uniformes
const generateUniform = (min, max, count) => {
    return Array.from({ length: count }, () => Math.random() * (max - min) + min);
};

// Renderiza la página principal
const renderIndex = (req, res) => {
    res.render('index');
};

// Maneja las distribuciones continuas
const handleContinuous = (req, res) => {
    console.log('Datos recibidos en /continuous:', req.body);

    const { type, params } = req.body;

    if (!type || !params) {
        return res.status(400).json({ error: 'Faltan parámetros para la distribución continua.' });
    }

    try {
        if (type === 'uniform') {
            const { min, max, count } = params;

            if (min >= max || count <= 0 || !Number.isInteger(parseInt(count))) {
                return res.status(400).json({
                    error: 'Parámetros inválidos para distribución uniforme. Asegúrate de que "min" sea menor que "max" y "count" sea un entero positivo.',
                });
            }

            const results = generateUniform(parseFloat(min), parseFloat(max), parseInt(count));
            return res.json({ results });
        } else if (type === 'normal') {
            const { mean, stddev, count } = params;

            if (stddev <= 0 || count <= 0 || !Number.isInteger(parseInt(count))) {
                return res.status(400).json({
                    error: 'Parámetros inválidos para distribución normal. "stddev" debe ser positivo y "count" un entero positivo.',
                });
            }

            const results = Array.from({ length: parseInt(count) }, () => {
                const u = Math.random();
                const v = Math.random();
                return parseFloat(mean) + parseFloat(stddev) * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
            });

            return res.json({ results });
        } else {
            return res.status(400).json({ error: 'Tipo de distribución continua no soportada.' });
        }
    } catch (error) {
        console.error('Error al procesar /continuous:', error.message);
        return res.status(500).json({ error: 'Error interno al procesar la distribución continua.' });
    }
};

// Maneja las distribuciones discretas
const handleDiscrete = (req, res) => {
    console.log('Datos recibidos en /discrete:', req.body);

    const { type, params } = req.body;

    if (!type || !params) {
        return res.status(400).json({ error: 'Faltan parámetros para la distribución discreta.' });
    }

    try {
        if (type === 'binomial') {
            const { n, p, count } = params;

            if (p < 0 || p > 1 || n <= 0 || count <= 0 || !Number.isInteger(parseInt(n)) || !Number.isInteger(parseInt(count))) {
                return res.status(400).json({
                    error: 'Parámetros inválidos para distribución binomial. Asegúrate de que "p" esté entre 0 y 1, y "n" y "count" sean enteros positivos.',
                });
            }

            const results = Array.from({ length: parseInt(count) }, () => {
                let successes = 0;
                for (let i = 0; i < parseInt(n); i++) {
                    if (Math.random() < parseFloat(p)) successes++;
                }
                return successes;
            });

            return res.json({ results });
        } else if (type === 'bernoulli') {
            const { p, count } = params;

            if (p < 0 || p > 1 || count <= 0 || !Number.isInteger(parseInt(count))) {
                return res.status(400).json({
                    error: 'Parámetros inválidos para distribución Bernoulli. Asegúrate de que "p" esté entre 0 y 1, y "count" sea un entero positivo.',
                });
            }

            const results = Array.from({ length: parseInt(count) }, () => (Math.random() < parseFloat(p) ? 1 : 0));
            return res.json({ results });
        } else if (type === 'poisson') {
            const { lambda, count } = params;

            if (lambda <= 0 || count <= 0 || !Number.isInteger(parseInt(count))) {
                return res.status(400).json({
                    error: 'Parámetros inválidos para distribución Poisson. Asegúrate de que "lambda" sea positivo y "count" sea un entero positivo.',
                });
            }

            const results = generatePoisson(parseFloat(lambda), parseInt(count));
            return res.json({ results });
        } else {
            return res.status(400).json({ error: 'Tipo de distribución discreta no soportada.' });
        }
    } catch (error) {
        console.error('Error al procesar /discrete:', error.message);
        return res.status(500).json({ error: 'Error interno al procesar la distribución discreta.' });
    }
};

module.exports = {
    renderIndex,
    handleContinuous,
    handleDiscrete,
};
