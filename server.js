const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

// Endpoint de healthcheck que verifica la API externa
app.get('/health', async (req, res) => {
  try {
    // Llamada a tu backend (que maneja la conexión con la BD)
    const response = await axios.get('https://fwmback-production.up.railway.app/user');
    
    // Si responde con 200, todo está bien
    if (response.status === 200) {
      res.status(200).send('OK');
    } else {
      res.status(500).send('API responded but not OK');
    }
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).send('API not reachable');
  }
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, './')));

// Ruta principal
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

// Usar el puerto proporcionado por Railway o 3000 por defecto (para local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
