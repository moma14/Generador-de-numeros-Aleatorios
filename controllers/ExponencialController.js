const generateExponential = require('../models/Continuas/Exponencial');

const handleExponential = (req, res) => {
    console.log('Datos recibidos en /exponential:', req.body);

    const { lambda, count } = req.body;

    if (!lambda || !count) {
        return res.status(400).json({ error: 'Faltan parámetros para la distribución exponencial.' });
    }

    try {
        const parsedLambda = parseFloat(lambda);
        const parsedCount = parseInt(count);

        if (parsedLambda <= 0 || parsedCount <= 0 || !Number.isInteger(parsedCount)) {
            return res.status(400).json({
                error: 'Parámetros inválidos para la distribución exponencial. "lambda" debe ser positivo y "count" debe ser un entero positivo.',
            });
        }

        const results = generateExponential(parsedLambda, parsedCount);
        return res.json({ results });
    } catch (error) {
        console.error('Error al procesar /exponential:', error.message);
        return res.status(500).json({ error: 'Error interno al procesar la distribución exponencial.' });
    }
};

module.exports = { handleExponential };
