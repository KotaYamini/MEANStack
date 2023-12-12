const { Category } = require('../models/category');
const { Product } = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// http://localhost:3000/api/v1/products
//GetAll
router.get('/', async (req, res) => {
    let filter = {};
    if (req.query?.categories) {
        filter = { category: req.query?.categories?.split(',') };
    }
    const productsList = await Product.find(filter).populate('category');

    if (!productsList) {
        res.status(500).json({ success: false });
    }
    res.send(productsList);
});

//GetById
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({ success: false });
    }
    res.send(product);
});

//Post
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
//Put
router.put('/:id', async (req, res) => {
    // to check whether we are getting the valid id or  not, mongoose provides the isValidObjectId method
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    let category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid Category Id');
    }
    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color
        },
        { new: true }
    )

    if (!product)
        return req.status(400).send('The product cannot be updated!');

    res.status(200).send(product);
});

// Delete
router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then((product) => {
        if (product) {
            return res.status(200).json({ success: true, message: 'The Product Id deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Product not Found!' });
        }
    }).catch((err) => {
        return res.status(400).json({ success: false, error: err });
    })
})

//GetCount
router.get('/get/count', async (req, res) => {
    // To get the count of the documents in the table, we use countDocuments from the model
    // Here in mongoose count documents stop accepting the callbacks , so simply pass countDocuments() method on the model we are consuming
    let productCount = await Product.countDocuments();

    if (!productCount) {
        res.status(500).json({ success: false });
    }

    res.send({ productCount: productCount });
});

// FeatureCount
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    // to show only the featured items onto the homepage with a limit of records by the user
    let products = await Product.find({ isFeatured: true }).limit(+count);
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
})

module.exports = router;