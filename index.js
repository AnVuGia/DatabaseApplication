const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const port = 3000;
const helloRoute = require('./routes/helloRoute');
const userRoute = require('./routes/userRoute');
const db = require('./models');
const app = express();

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/hello', helloRoute);
app.use('/user', userRoute);
db.sequelize.sync().then((req) => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
