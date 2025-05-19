const express = require('express');
const path = require('path');
const app = express();

// Ruta /health para verificar que el servidor está funcionando
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(express.static(path.join(__dirname, './')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
