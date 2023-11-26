const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');


const api = process.env.API_URL;
const connection_string = process.env.CONNECTION_STRING;

//middleware
app.use(express.json());
app.use(morgan('tiny'));


const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

// http://localhost:3000/api/v1/products
app.get(api + '/products', (req, res) => {
    res.send('First response'); // This is fine
    res.json({ message: 'Second response' });

});

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });

    product.save().then((createdProduct) => {
        res.json(createdProduct)
    }).catch((err) => {
        res.json({
            error: err,
            success: false
        })
    })
});


mongoose.connect(connection_string)
    .then(() => {
        console.log('Database connection is ready....');
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(3000, () => {
    console.log('server is running http://localhost:3000');
});