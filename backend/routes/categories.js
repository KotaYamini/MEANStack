const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// http://localhost:3000/api/v1/categories
router.get('/', async (req, res) => {
    const categoriesList = await Category.find();

    if (!categoriesList) {
        res.status(500).json({ success: false });
    }
    res.send(categoriesList);
});

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

router.delete('/:id', (req, res) => {
    Category.findOneAndDelete({ _id: req.params.id }).then((category) => {
        if (category) {
            return res.status(200).json({ success: true, message: 'The Category Id deleted!' });
        } else {
            return res.status(404).json({ suceess: false, message: 'Category not found' })
        }

    }).catch((err) => {
        return res.status(400).json({ success: false, error: err })
    })
})

module.exports = router;