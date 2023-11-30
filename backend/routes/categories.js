const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// http://localhost:3000/api/v1/categories
//Get 
router.get('/', async (req, res) => {
    const categoriesList = await Category.find();

    if (!categoriesList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(categoriesList);
});

// Put
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        { new: true }
    )

    if (!category)
        return req.status(400).send('The Category cannot be updated!');

    res.status(200).send(category);
});

//GetById
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ message: 'The Category with the given ID was not found!' });
    }
    return res.status(200).send(category);
});

//Post
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if (!category) {
        return res.status(404).send('the category cannot be created!')
    }
    return res.send(category);
});

//Delete
router.delete('/:id', (req, res) => {
    Category.findOneAndDelete({ _id: req.params.id }).then((category) => {
        if (category) {
            return res.status(200).json({ success: true, message: 'The Category Id deleted!' });
        } else {
            return res.status(404).json({ suceess: false, message: 'Category not found' });
        }

    }).catch((err) => {
        return res.status(400).json({ success: false, error: err });
    })
})

module.exports = router;