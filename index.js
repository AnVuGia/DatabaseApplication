const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const port = 3000;

const appRoute = require('./routes/appRoute');
const productRoute = require('./routes/productRoute');
const warehouseRoute = require('./routes/warehouseRoute');
const categoryRoute = require('./routes/categoryRoute');
const productCategoryRoute = require('./routes/productCategoryRoute');
const customerRoute = require('./routes/customerRoute');
const ordersRoute = require('./routes/ordersRoute');
const productWarehouseRoute = require('./routes/productWarehouseRoute');
const db = require('./models');
const app = express();
const session = require('express-session');

const fs = require('fs');
const { default: mongoose } = require('mongoose');

const mongodb_uri = 'mongodb://127.0.0.1:27017';
const dbName = '/group_asm2';
const connectString = mongodb_uri + dbName;

mongoose.connect(connectString);

const mongodb = mongoose.connection;

mongodb.on('error', (error) => console.log(error));
mongodb.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: '.localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    },
  })
);
app.use('/', appRoute);
app.use('/product', productRoute);
app.use('/warehouse', warehouseRoute);
app.use('/category', categoryRoute);
app.use('/attribute',productCategoryRoute)
app.use('/customer', customerRoute);
app.use('/productWarehouse', productWarehouseRoute);
app.use('/order', ordersRoute);
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
