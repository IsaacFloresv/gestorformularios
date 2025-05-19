const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, './')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).send('OK - Application is running');
});

app.listen(9000);
