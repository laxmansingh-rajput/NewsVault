const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const info = require('../models/userInfo.js');
const admininfo = require('../models/adminInfo.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config();
mongoose.connect(process.env.DB_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


router.post('/password', async (req, res) => {
    let AccessToken = req.cookies.AccessToken
    let RefreshToken = req.cookies.RefreshToken
    let plainPass = req.body.password
    let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
    let update = await info.findOneAndUpdate({ email: user.email }, { name: req.body.Name }, { new: true });
    try {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(plainPass, salt, async function (err, hash) {
                let updated = await info.findOneAndUpdate({ email: user.email }, { password: hash }, { new: true });
                res.json({ status: 'password Created', redirect: process.env.frontend + "/" })
            });
        });
    } catch (err) {
        try {
            let user = jwt.verify(req.cookies.RefreshToken, process.env.REFRESH_SECRET)
            let profile = await info.findOne({ email: user.email })
            let update = await info.findOneAndUpdate({ email: user.email }, { name: req.body.Name }, { new: true });
            let newAccess = jwt.sign(
                {
                    email: profile.email,
                    name: profile.name,
                    premium: profile.premium,
                    type: profile.premiumType
                },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );
            res.cookie('AccessToken', newAccess, {
                maxAge: 900000,
                httpOnly: true,
                sameSite: 'lax',
            });
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(plainPass, salt, async function (err, hash) {
                    let updated = await info.findOneAndUpdate({ email: user.email }, { password: hash }, { new: true });
                    res.json({ status: 'password Created', redirect: process.env.frontend+"/" })
                });
            });

        } catch {
            res.send('something went wrong')
        }
    }
})

module.exports = router