const generateBernoulli = require('../models/Discretas.js/Bernoulli');
const generateNormal = require('../models/Continuas/Normal');
const generatePoisson = require('../models/Discretas.js/Poisson');
const generateExponential = require('../models/Continuas/Exponencial');
// Nuevas 
const generateWeibull = require('../models/Continuas/Weibull');
const generateGamma = require('../models/Continuas/Gamma');
const generateBeta = require('../models/Continuas/Beta');
const generateCauchy = require('../models/Continuas/Cauchy');
const generateTriangular = require('../models/Continuas/Triangular');


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
    console.log('Datos recibidos en /continuous:', JSON.stringify(req.body, null, 2));

    const { type, params } = req.body;

    if (!type || !params) {
        return res.status(400).json({ error: 'Faltan parámetros para la distribución continua.' });
    }

    try {
        const normalizedType = type.toLowerCase().trim();

        if (normalizedType === 'uniform') {
            console.log('Tipo normalizado:', normalizedType);
            const min = parseFloat(params.min);
            const max = parseFloat(params.max);
            const count = parseInt(params.count, 10);

            if (isNaN(min) || isNaN(max) || isNaN(count) || min >= max || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución uniforme.' });
            }

            const results = generateUniform(min, max, count);
            return res.json({ results });
        }

        if (normalizedType === 'normal') {
            console.log('Tipo normalizado:', normalizedType);
            const mean = parseFloat(params.mean);
            const stddev = parseFloat(params.stddev);
            const count = parseInt(params.count, 10);

            if (isNaN(mean) || isNaN(stddev) || isNaN(count) || stddev <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución normal.' });
            }

            const results = Array.from({ length: count }, () => {
                const u = Math.random();
                const v = Math.random();
                return mean + stddev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
            });
            return res.json({ results });
        }

        if (normalizedType === 'exponential') {
            console.log('Tipo normalizado:', normalizedType);
            const lambda = parseFloat(params.lambda);
            const count = parseInt(params.count, 10);
        
            // Validación de parámetros
            if (isNaN(lambda) || isNaN(count) || lambda <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución exponencial.' });
            }
        
            try {
                // Generar los números aleatorios usando la función
                const results = generateExponential(lambda, count);
                return res.json({ results });
            } catch (error) {
                console.error('Error generando la distribución exponencial:', error.message);
                return res.status(500).json({ error: 'Error interno al generar la distribución exponencial.' });
            }
        }        

        if (normalizedType === 'gamma') {
            console.log('Tipo normalizado:', normalizedType);
            const shape = parseFloat(params.shape);
            const scale = parseFloat(params.scale);
            const count = parseInt(params.count, 10);

            if (isNaN(shape) || isNaN(scale) || isNaN(count) || shape <= 0 || scale <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución gamma.' });
            }

            const results = generateGamma(shape, scale, count);
            return res.json({ results });
        }

        if (normalizedType === 'beta') {
            console.log('Tipo normalizado:', normalizedType);
            const alpha = parseFloat(params.alpha);
            const beta = parseFloat(params.beta);
            const count = parseInt(params.count, 10);

            if (isNaN(alpha) || isNaN(beta) || isNaN(count) || alpha <= 0 || beta <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución beta.' });
            }

            const results = generateBeta(alpha, beta, count);
            return res.json({ results });
        }

        if (normalizedType === 'log-normal') {
            console.log('Tipo normalizado:', normalizedType);
            const mean = parseFloat(params.mean);
            const stddev = parseFloat(params.stddev);
            const count = parseInt(params.count, 10);

            if (isNaN(mean) || isNaN(stddev) || isNaN(count) || stddev <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución log-normal.' });
            }

            const results = Array.from({ length: count }, () => {
                const u = Math.random();
                const v = Math.random();
                return Math.exp(mean + stddev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
            });
            return res.json({ results });
        }

        if (normalizedType === 'weibull') {
            console.log('Tipo normalizado:', normalizedType);
            const shape = parseFloat(params.shape);
            const scale = parseFloat(params.scale);
            const count = parseInt(params.count, 10);

            if (isNaN(shape) || isNaN(scale) || isNaN(count) || shape <= 0 || scale <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución Weibull.' });
            }

            const results = generateWeibull(shape, scale, count);
            return res.json({ results });
        }

        if (normalizedType === 'cauchy') {
            console.log('Tipo normalizado:', normalizedType);
            const location = parseFloat(params.location);
            const scale = parseFloat(params.scale);
            const count = parseInt(params.count, 10);

            if (isNaN(location) || isNaN(scale) || isNaN(count) || scale <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución Cauchy.' });
            }

            const results = generateCauchy(location, scale, count);
            return res.json({ results });
        }

        if (normalizedType === 'triangular') {
            console.log('Tipo normalizado:', normalizedType);
            const min = parseFloat(params.min);
            const mode = parseFloat(params.mode);
            const max = parseFloat(params.max);
            const count = parseInt(params.count, 10);

            if (isNaN(min) || isNaN(mode) || isNaN(max) || isNaN(count) || min >= mode || mode >= max || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución triangular.' });
            }

            const results = generateTriangular(min, mode, max, count);
            return res.json({ results });
        }

        return res.status(400).json({ error: `Tipo de distribución continua no soportada: ${type}` });
    } catch (error) {
        console.error('Error al procesar /continuous:', error.message);
        return res.status(500).json({ error: 'Error interno al procesar la distribución continua.' });
    }
};

// Maneja las distribuciones discretas
// Maneja las distribuciones discretas
const handleDiscrete = (req, res) => {
    console.log('Datos recibidos en /discrete:', req.body);

    const { type, params } = req.body;

    if (!type || !params) {
        return res.status(400).json({ error: 'Faltan parámetros para la distribución discreta.' });
    }

    try {
        // Binomial
        if (type === 'binomial') {
            const { n, p, count } = params;
            if (p < 0 || p > 1 || n <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución binomial.' });
            }
            const results = Array.from({ length: parseInt(count) }, () => {
                let successes = 0;
                for (let i = 0; i < parseInt(n); i++) {
                    if (Math.random() < parseFloat(p)) successes++;
                }
                return successes;
            });
            return res.json({ results });
        }

        // Geometric
        if (type === 'geometric') {
            const { p, count } = params;
            if (p <= 0 || p >= 1 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución geométrica.' });
            }
            const results = Array.from({ length: parseInt(count) }, () =>
                Math.floor(Math.log(1 - Math.random()) / Math.log(1 - p))
            );
            return res.json({ results });
        }

        // Hypergeometric
        if (type === 'hypergeometric') {
            const { population, successes, samples, count } = params;
            if (population <= 0 || successes <= 0 || samples <= 0 || count <= 0 || samples > population) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución hipergeométrica.' });
            }
            const results = Array.from({ length: parseInt(count) }, () => {
                let x = 0;
                let N = parseInt(population);
                let K = parseInt(successes);
                for (let i = 0; i < parseInt(samples); i++) {
                    if (Math.random() < K / N) {
                        x++;
                        K--;
                    }
                    N--;
                }
                return x;
            });
            return res.json({ results });
        }

        // Multinomial
        if (type === 'multinomial') {
            const { n, probs, count } = params;
            const probabilities = probs.split(',').map(Number);
            const sum = probabilities.reduce((acc, p) => acc + p, 0);
            if (sum !== 1 || count <= 0 || probabilities.some((p) => p < 0)) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución multinomial.' });
            }
            const results = Array.from({ length: parseInt(count) }, () => {
                const trials = Array(probabilities.length).fill(0);
                for (let i = 0; i < parseInt(n); i++) {
                    let r = Math.random();
                    for (let j = 0; j < probabilities.length; j++) {
                        if (r < probabilities[j]) {
                            trials[j]++;
                            break;
                        }
                        r -= probabilities[j];
                    }
                }
                return trials;
            });
            return res.json({ results });
        }

        // Bernoulli
        if (type === 'bernoulli') {
            const { p, count } = params;
            if (p < 0 || p > 1 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución Bernoulli.' });
            }
            const results = Array.from({ length: parseInt(count) }, () =>
                Math.random() < parseFloat(p) ? 1 : 0
            );
            return res.json({ results });
        }

        // Poisson
        if (type === 'poisson') {
            const { lambda, count } = params;
            if (lambda <= 0 || count <= 0) {
                return res.status(400).json({ error: 'Parámetros inválidos para distribución Poisson.' });
            }
            const results = Array.from({ length: parseInt(count) }, () => {
                let L = Math.exp(-lambda);
                let k = 0;
                let p = 1;
                do {
                    k++;
                    p *= Math.random();
                } while (p > L);
                return k - 1;
            });
            return res.json({ results });
        }

        return res.status(400).json({ error: 'Tipo de distribución discreta no soportada.' });
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
