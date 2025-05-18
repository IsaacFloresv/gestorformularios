const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

app.use(express.static(path.join(__dirname, './')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

app.get('/health', async (req, res) => {
  try {
    // Ping a la API
    const response = await axios.get('https://fwmback-production.up.railway.app/asepress', { timeout: 5000 });

    if (response.status === 200) {
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(500).json({ status: 'api_error' });
    }
  } catch (err) {
    res.status(500).json({ status: 'unreachable', message: err.message });
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
