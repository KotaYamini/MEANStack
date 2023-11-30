const { Category } = require('../models/category');
const { Product } = require('../models/products');
const express = require('express');
const router = express.Router();


// http://localhost:3000/api/v1/products
router.get('/', async (req, res) => {
    const productsList = await Product.find();

    if (!productsList) {
        res.status(500).json({ success: false });
    }
    res.send(productsList);
});

router.post('/', async (req, res) => {
    let category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid Category');
    }
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();

    if (!product) {
        return res.status(500).send('The Product cannot be created');
    }
    return res.send(product);
});

module.exports = router;