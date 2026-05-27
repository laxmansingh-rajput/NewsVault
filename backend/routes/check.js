const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const info = require('../models/userInfo.js');
const admininfo = require('../models/adminInfo.js');
require('dotenv').config();

mongoose.connect(process.env.DB_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


router.get('/login', async (req, res) => {
    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
        let profile = await info.findOne({ email: user.email });

        res.json({
            check: true,
            premium: profile.premium,
            premiumDate: profile.premiumDate,
            premiumType: profile.premiumType,
            picture: profile.pictureUrl
        })
    } catch (err) {
        try {
            let user = jwt.verify(req.cookies.RefreshToken, process.env.REFRESH_SECRET)
            let profile = await info.findOne({ email: user.email });
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
            res.json({
                check: true,
                premium: profile.premium,
                premiumDate: profile.premiumDate,
                premiumType: profile.premiumType,
                picture: profile.pictureUrl
            })
        } catch {
            res.json({
                check: false,
                error: 'something went wrong'
            })
        }
    }
})

router.get('/logout', async (req, res) => {

    res.clearCookie('AccessToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    });

    res.clearCookie('RefreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/name', async (req, res) => {
    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
        let profile = await info.findOne({ email: user.email });
        res.json({
            name: profile.name,
            password: profile.password
        })
    }
    catch {
        res.status(401).json({ error: true });
    }
})

module.exports = router