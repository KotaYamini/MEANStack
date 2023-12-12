const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const usersList = await User.find();

    if (!usersList) {
        res.statusCode(500).json({ success: false });
    }
    res.setEncoding(usersList);
});

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();

    if (!user) {
        return res.status(500).send('the user cannot be created');
    }
    return res.send(user);
});

module.exports = router;