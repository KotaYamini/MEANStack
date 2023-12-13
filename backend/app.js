const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');

require('dotenv/config');

//middleware
app.use(express.json()); // to parse the request body in the form of json
app.use(morgan('tiny')); // for logging the url hits on to the console
app.use(authJwt);

//cors
app.use(cors()); // to enable cross origin resource sharing between FE & BE
app.options('*', cors()); // applicable for all methods in the rest api like get,post,delete,update


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

// mongoose connection to the webserver application
const connection_string = process.env.CONNECTION_STRING;
mongoose.connect(connection_string)
    .then(() => {
        console.log('Database connection is ready....');
    })
    .catch((err) => {
        console.log(err);
    });

//server start
app.listen(3000, () => {
    console.log('server is running http://localhost:3000');
});