const express = require('express');
const path = require('path');
const session = require('express-session'); // Importa express-session
const routes = require('./routes/routes'); 

const app = express();

// Configuración de sesión
app.use(
  session({
    secret: 'mi_secreto_sesion', // Cambia esto por un secreto seguro
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Cambia a true si usas HTTPS
  })
);

// Middleware para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de vistas y rutas estáticas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para propagar la sesión a las vistas
app.use((req, res, next) => {
  console.log('Datos de la sesión: (Nuevo mensaje)', { userId: req.session.userId, token: req.session.token });
  res.locals.userId = req.session.userId || null; // Propaga el userId si está en la sesión
  res.locals.token = req.session.token || null; // Propaga el token si está en la sesión
  next();
});

// Rutas unificadas
app.use('/', routes);

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});