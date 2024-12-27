const express = require('express');
const path = require('path');
const routes = require('./controllers/indexGenerate');
const binomialController = require('./controllers/BinomialController');

const app = express();

// Middleware para procesar JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Configuración de vistas y rutas estáticas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/generate', binomialController);



// Rutas
app.use('/', routes);

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
