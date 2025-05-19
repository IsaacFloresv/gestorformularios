const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, './')));

// Endpoint raíz
app.get('/', function (req, res) {
res.sendFile(path.join(__dirname, './', 'index.html'));
});

// Endpoint /health para que Railway verifique que el servidor está activo
app.get('/health', (req, res) => {
res.status(200).send('OK');
});

// Puerto de escucha
app.listen(9000, () => {
console.log('Servidor escuchando en puerto 9000');
});
