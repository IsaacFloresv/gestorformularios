const express = require('express');
const path = require('path');
const axios = require('axios');  // Usamos axios para hacer la petición HTTP
const app = express();

app.use(express.static(path.join(__dirname, './')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

// Endpoint /health para Railway
app.get('/health', async (req, res) => {
  try {
    // Hacemos una petición GET a la API para verificar que está arriba
    const response = await axios.get('https://fwmback-production.up.railway.app/asepress');
    
    if (response.status === 200) {
      return res.status(200).json({ status: 'ok' });
    } else {
      return res.status(500).json({ status: 'error', message: 'API no respondió con 200' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(9000, () => {
  console.log('Servidor corriendo en puerto 9000');
});
