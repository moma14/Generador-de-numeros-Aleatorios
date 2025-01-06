const express = require('express');
const router = express.Router();

const binomialController = require('../controllers/BinomialController');
const indexGenerateController = require('../controllers/indexGenerate');
const { renderIndex, handleContinuous, handleDiscrete } = require('../controllers/indexGenerate');
const { handleExponential } = require('../controllers/ExponencialController'); 


// Rutas para la distribución binomial
router.post('/binomial', binomialController);

// Rutas principales
router.get('/', indexGenerateController.renderIndex);

router.post('/continuous', handleContinuous);
router.post('/discrete', handleDiscrete);

router.post('/exponential', handleExponential);

module.exports = router;
