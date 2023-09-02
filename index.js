const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const port = 3000;
const appRoute = require('./routes/appRoute');
const userRoute = require('./routes/userRoute');
const shopRoute = require('./routes/shopRoute');
const warehouse = require('./routes/warehouseRoute');
const db = require('./models');
const app = express();

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middle ware below may not be needed
// app.use(express.static(path.join(__dirname, 'views')));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', appRoute);
app.use('/user', userRoute);
app.use('/shop', shopRoute);
app.use('/warehouse', warehouse);
db.sequelize.sync().then((req) => {
  const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    const io = require('./socket').init(server);
    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('post item', (item) => {
        console.log(item);
        io.emit('post item', item);
      });
    });
  });
});
