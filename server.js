const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise'); // Importa versión con promesas
const app = express();
const PORT = process.env.PORT || 9000;

// Datos de conexión MySQL desde variables de entorno (como en Railway)
const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
};

// Static files
app.use(express.static(path.join(__dirname, './')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

// Healthcheck directo a la base de datos
app.get('/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('SELECT 1');
    await connection.end();
    res.status(200).send('OK');
  } catch (err) {
    console.error('Health check DB error:', err.message);
    res.status(500).send('DB Connection Failed');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
