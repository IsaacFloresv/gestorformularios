const express = require('express');
const path = require('path');
const axios = require('axios');  // para hacer la llamada HTTP

const app = express();

const URI = "https://fwmback-production.up.railway.app/";

// Endpoint healthcheck que verifica la API
app.get('/health', async (req, res) => {
  try {
    // Hacemos una petición GET a la API
    const response = await axios.get(URI);

    // Si la API responde con status 200, consideramos que está OK
    if (response.status === 200) {
      res.status(200).send('OK');
    } else {
      // Si no responde 200, enviamos error
      res.status(500).send('API not healthy');
    }
  } catch (err) {
    console.error('API Error:', err.message);
    res.status(500).send('API not reachable');
  }
});

app.use(express.static(path.join(__dirname, './')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
