const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const usersList = await User.find().select('-passwordHash');

    if (!usersList) {
        res.statusCode(500).json({ success: false });
    }
    res.send(usersList);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({ message: 'The user with the given Id was not found!' });
    }

    return res.status(200).send(user);
})

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

router.put('/:id', async (req, res) => {
    // checking whether the password is already existed or not
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = userExist.passwordHash;
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            color: req.body.color,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        }
    )

    if (!user)
        return req.status(400).send('The User cannot be updated!');

    res.status(200).send(user);
})

module.exports = router;