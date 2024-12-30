const generatePoisson = require('../models/Discretas.js/Poisson');

const generatePoissonHandler = (req, res) => {
    const { lambda, count } = req.body.params;

    try {
        if (lambda <= 0 || count <= 0 || !Number.isInteger(count)) {
            return res.status(400).json({
                error: 'Parámetros inválidos: "lambda" debe ser mayor que 0 y "count" debe ser un entero positivo.',
            });
        }

        const results = generatePoisson(lambda, count);
        console.log('Resultados generados (poisson):', results);
        return res.json({ results });
    } catch (error) {
        console.error('Error al generar números de Poisson:', error.message);
        return res.status(500).json({ error: 'Error interno al generar números.' });
    }
};

module.exports = generatePoissonHandler;
