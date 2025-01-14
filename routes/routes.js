const express = require('express');
const session = require('express-session');
const axios = require('axios');
const FormData = require('form-data'); // Importar para manejar datos multipart

const router = express.Router();

const binomialController = require('../controllers/BinomialController');
const indexGenerateController = require('../controllers/indexGenerate');
const { renderIndex, handleContinuous, handleDiscrete } = require('../controllers/indexGenerate');
const { handleExponential } = require('../controllers/ExponencialController');

// URL base de la API
const API_URL = 'http://localhost:3002'; // Asegúrate de que esta URL sea la correcta para tu API

// Configuración de sesión
router.use(
  session({
    secret: 'mi_secreto_sesion', // Cambiar a un secreto seguro
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware para propagar la sesión a todas las vistas
router.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.token = req.session.token || null;
  next();
});

// Ruta principal
router.get('/', (req, res) => {
  console.log('Datos de la sesión actual:', req.session); // Log para verificar la sesión

  // Renderizar la vista principal pasando los datos de la sesión
  res.render('index', {
    userId: req.session.userId || null,
    token: req.session.token || null,
  });
});

// Ruta para login (GET)
router.get('/login', (req, res) => {
  res.render('login');
});

// Procesar el formulario de login (POST)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Datos recibidos para login:', { email, password }); // Log para depurar datos recibidos

  try {
    // Enviar solicitud a la API
    const response = await axios.post(`${API_URL}/usuarios/login`, { email, password });

    console.log('Respuesta de la API al login:', response.data); // Log para depurar la respuesta de la API

    // Guardar el token y el usuario en sesión
    req.session.token = response.data.token;
    req.session.userId = response.data.id_usuario;

    console.log('Sesión creada:', { token: req.session.token, userId: req.session.userId }); // Log para depurar la sesión

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

// Ruta para registro (GET)
router.get('/registro', (req, res) => {
  res.render('registro', { mensaje: null, error: null });
});

// Procesar el formulario de registro (POST)
router.post('/registro', async (req, res) => {
  const { nombres, apellido_paterno, apellido_materno, email, telefono, usuario, contrasenia } = req.body;

  try {
    // Enviar solicitud a la API para registrar un nuevo usuario
    const response = await axios.post(`${API_URL}/usuarios`, {
      nombres,
      apellido_paterno,
      apellido_materno,
      email,
      telefono,
      usuario,
      contrasenia,
    });

    // Redirigir a la página de login con un mensaje de éxito
    res.render('login', { mensaje: 'Registro exitoso. Ahora puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);

    // Mostrar el error en la vista de registro
    res.render('registro', {
      mensaje: null,
      error: error.response?.data?.error || 'Error al registrar usuario',
    });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.status(500).send('Error al cerrar sesión');
      }
      res.clearCookie('connect.sid'); // Limpia la cookie de sesión
      res.status(200).send('Sesión cerrada correctamente');
  });
});

// Ruta para obtener usuarios desde la API
router.get('/usuarios', async (req, res) => {
  try {
    // Solicitud GET a la API para obtener los usuarios
    const response = await axios.get(`${API_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${req.session.token}` }, // Enviar token si es necesario
    });

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
    if (!req.body.file) {
      return res.status(400).send('No se proporcionó ningún archivo');
    }

    const formData = new FormData();
    formData.append('grafico', req.body.file);

    // Solicitud POST a la API para subir el archivo
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: formData.getHeaders(),
    });

    res.send(response.data);
  } catch (error) {
    console.error('Error al subir gráfico:', error.message);
    res.status(500).send('Error al subir gráfico');
  }
});

// Rutas adicionales
router.post('/continuous', handleContinuous);
router.post('/discrete', handleDiscrete);
router.post('/exponential', handleExponential);

module.exports = router;