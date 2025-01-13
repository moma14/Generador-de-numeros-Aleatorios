const express = require('express');
const axios = require('axios');

const router = express.Router();

const binomialController = require('../controllers/BinomialController');
const indexGenerateController = require('../controllers/indexGenerate');
const { renderIndex, handleContinuous, handleDiscrete } = require('../controllers/indexGenerate');
const { handleExponential } = require('../controllers/ExponencialController');

// URL base de la API
const API_URL = 'http://localhost:3002'; // Asegúrate de que esta URL sea la correcta para tu API

// Rutas para la distribución binomial
router.post('/binomial', binomialController);

// Ruta principal
router.get('/', indexGenerateController.renderIndex);

// Ruta para login
router.get('/login', (req, res) => {
    res.render('login');
});


// Ruta para obtener usuarios desde la API
router.get('/usuarios', async (req, res) => {
    try {
        // Solicitud GET a la API para obtener los usuarios
        const response = await axios.get(`${API_URL}/usuarios`);
        // Renderiza la vista "usuarios" con los datos obtenidos
        res.render('usuarios', { usuarios: response.data });
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).send('Error al obtener usuarios');
    }
});

// Ruta para subir un gráfico a la API
router.post('/subir-grafico', async (req, res) => {
    try {
        const { file } = req.body; // Supone que los archivos se envían en el cuerpo de la solicitud
        const formData = new FormData();
        formData.append('grafico', file);

        // Solicitud POST a la API para subir el archivo
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        res.send(response.data);
    } catch (error) {
        console.error('Error al subir gráfico:', error.message);
        res.status(500).send('Error al subir gráfico');
    }
});

  
  // Procesar el formulario de login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Enviar solicitud a la API
      const response = await axios.post('http://localhost:3002/usuarios/login', { email, password });
  
      // Guardar el token en sesión o cookie
      req.session.token = response.data.token;
  
      // Redirigir al dashboard u otra vista
      res.redirect('/'); // Cambia "/dashboard" por la ruta deseada
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
  
      // Mostrar el error en la vista de login
      res.render('login', {
        error: error.response?.data?.error || 'Error al iniciar sesión',
      });
    }
  });

  router.get('/registro', (req, res) => {
    res.render('registro', { mensaje: null, error: null });
  });
  
  

// Rutas adicionales
router.post('/continuous', handleContinuous);
router.post('/discrete', handleDiscrete);
router.post('/exponential', handleExponential);

module.exports = router;
