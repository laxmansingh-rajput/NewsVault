const express = require('express')
const router = express.Router()
const passport = require('passport');
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


const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URI
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const { email, name, picture } = profile._json;
        let user = await info.findOne({ email });
        let isAdmin = process.env.Owner_Email === email;
        if (!isAdmin) {
            const admin = await admininfo.findOne({ email });
            if (admin) isAdmin = true;
        }
        if (!user) {
            const newUser = new info({
                email,
                name,
                password: '',
                pictureUrl: picture,
                premium: false,
                premiumDate: null,
                premiumType: null,
                expiry: null,
                Admin: isAdmin
            });
            const savedUser = await newUser.save();
            return cb(null, savedUser);
        } else {
            return cb(null, user);
        }
    } catch (error) {
        console.error('Error in Google strategy:', error);
        return cb(error, null);
    }
}));

function makeAccessToken(user) {
    try {
        return jwt.sign(
            {
                email: user.email,
                name: user.name,
                premium: user.premium,
                type: user.premiumType
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
    } catch (err) {
        console.error('Error generating access token:', err);
        return null;
    }
}

function makeRefreshToken(user) {
    try {
        return jwt.sign(
            { email: user.email },
            process.env.REFRESH_SECRET,
            { expiresIn: '7d' }
        );
    } catch (err) {
        console.error('Error generating refresh token:', err);
        return null;
    }
}

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.frontend + '/login', session: false }),
    (req, res) => {
        try {
            const user = req.user;
            if (!user) return res.status(400).send('User not authenticated');

            const accessToken = makeAccessToken(user);
            const refreshToken = makeRefreshToken(user);

            if (!accessToken || !refreshToken) {
                return res.status(500).json({ error: 'Token generation failed' });
            }

            res.cookie('AccessToken', accessToken, {
                maxAge: 900000,
                httpOnly: false,
                sameSite: 'None',
                secure: true,
            });

            res.cookie('RefreshToken', refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                sameSite: 'None',
                secure: true,
            });

            if (user.password == "") {
                res.redirect(process.env.frontend + '/form');
            } else {
                res.redirect(process.env.frontend + '/');
            }
        } catch (err) {
            l
            console.error('Error in callback route:' + err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

router.get('/getAccess', async (req, res) => {
    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
        let profile = await info.findOne({ email: user.email });
        if (profile.expiry && profile.expiry < Date.now()) {
            await info.updateOne({ email: profile.email }, {
                premium: false,
                premiumDate: null,
                premiumType: null,
                expiry: null
            })
            profile = await info.findOne({ email: user.email })
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
            const accessToken = makeAccessToken(profile);
            const refreshToken = makeRefreshToken(profile);
            res.cookie('AccessToken', accessToken, {
                maxAge: 900000,
                httpOnly: true,
                sameSite: 'lax',
            });
            res.cookie('RefreshToken', refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax',
            });
        }
        res.json({
            loginStatus: "true",
            email: profile.email,
            name: profile.name,
            picture: profile.pictureUrl,
            premium: profile.premium,
            premiumDate: profile.premiumDate,
            premiumType: profile.premiumType
        })
    } catch (err) {
        try {
            let user = jwt.verify(req.cookies.RefreshToken, process.env.REFRESH_SECRET)
            let profile = await info.findOne({ email: user.email });
            if (profile.expiry && profile.expiry < Date.now()) {
                await info.updateOne({ email: profile.email }, {
                    premium: false,
                    premiumDate: null,
                    premiumType: null,
                    expiry: null
                })
                profile = await info.findOne({ email: user.email })
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

                const accessToken = makeAccessToken(profile);
                const refreshToken = makeRefreshToken(profile);

                res.cookie('AccessToken', accessToken, {
                    maxAge: 900000,
                    httpOnly: true,
                    sameSite: 'lax',
                });

                res.cookie('RefreshToken', refreshToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'lax',
                });
            } else {
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
            }
            res.json({
                loginStatus: "true",
                email: profile.email,
                name: profile.name,
                picture: profile.pictureUrl,
                premium: profile.premium,
                premiumDate: profile.premiumDate,
                premiumType: profile.premiumType
            })
        } catch {
            res.json({ loginStatus: "false", error: 'something went wrong' })
        }
    }
});
router.post('/login', async (req, res) => {
    try {
        let mail = req.body.Email;
        let password = req.body.password
        let profile = await info.findOne({ email: mail })
        if (!profile) {
            res.json({ status: "some thingh went wrong", redirect: null })
        }
        let a = await bcrypt.compare(password, profile.password);

        if (a == false) {
            res.json({ status: 'Some thing went wrong' })
        } else {
            const accessToken = makeAccessToken(profile);
            const refreshToken = makeRefreshToken(profile);
            if (!accessToken || !refreshToken) {
                return res.status(500).json({ error: 'Token generation failed' });
            }
            res.cookie('AccessToken', accessToken, {
                maxAge: 900000,
                httpOnly: true,
                sameSite: 'lax',
            });
            res.cookie('RefreshToken', refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax',
            });
            res.json({ redirect: process.env.frontend + '/' })
        }
    } catch (err) {
        res.json({ status: "some thingh went wrong", redirect: null })

    }
})

module.exports = router