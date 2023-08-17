const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const helloRoute = require('./routes/helloRoute');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/hello', helloRoute);
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '120603',
  database: 'test',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
