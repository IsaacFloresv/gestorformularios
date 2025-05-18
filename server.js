const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

// Configura la conexión a tu base de datos
const dbConfig = {
  host: 'viaduct.proxy.rlwy.net',     // o el host que use Railway
  user: 'root',    // usuario MySQL
  password: 'hbb6hfAH5g541h5Hhe3ca5fhdDF4AGa4',
  database: 'railway'
};

// Endpoint de healthcheck con verificación de BD
app.get('/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('SELECT 1'); // simple test query
    await connection.end();
    res.status(200).send('OK');
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).send('Database not connected');
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

