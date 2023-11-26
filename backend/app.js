const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const connection_string = process.env.CONNECTION_STRING;

//middleware
app.use(express.json());
app.use(morgan('tiny'));

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// API URL
const api = process.env.API_URL;

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);



mongoose.connect(connection_string)
    .then(() => {
        console.log('Database connection is ready....');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log('server is running http://localhost:3000');
});