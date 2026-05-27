const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const info = require('../models/userInfo.js');
const admininfo = require('../models/adminInfo.js');
const payInfo = require('../models/paymentInfo.js')
const Razorpay = require('razorpay')
const crypto = require('crypto');
const { request } = require('http');
require('dotenv').config();

mongoose.connect(process.env.DB_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

var instance = new Razorpay({
    key_id: process.env.RAZOR_ID,
    key_secret: process.env.RAZOR_SECRET,
});

const authenticate = async (req, res, next) => {
    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
        let profile = await info.findOne({ email: user.email });
        req.userInformation = {
            loginStatus: "true",
            email: profile.email,
            name: profile.name,
            picture: profile.pictureUrl,
            premium: profile.premium,
            premiumDate: profile.premiumDate,
            premiumType: profile.premiumType
        }
        if (profile.premium && profile.premiumType == 'Full Access') {
            if (req.query.type == 'Order2' || req.query.type == 'Order3') {
                next()
            } else {
                return res.send({ upgrade: "To switch to single paper wait to expire current plan if you want you can switch to any other dual paper plan" })
            }
        } else if (profile.premium && profile.premiumType == 'Paper1') {
            if (req.query.paper == 'Paper1') {
                next()
            }
            else {
                return res.send({ upgrade: "You cannot upgrade to Times of India or a dual-paper plan at the moment. Please wait for your current plan to end or choose to extend it for The Hindu." })
            }
        } else if (profile.premium && profile.premiumType == 'Paper2') {
            if (req.query.paper == 'Paper2') {
                next()
            } else {
                return res.send({ upgrade: "You cannot upgrade to The Hindu or a dual-paper plan at the moment. Please wait for your current plan to end or choose to extend it for Times of India. " })
            }
        } else {
            next()
        }

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
            req.userInformation = {
                loginStatus: "true",
                email: profile.email,
                name: profile.name,
                picture: profile.pictureUrl,
                premium: profile.premium,
                premiumDate: profile.premiumDate,
                premiumType: profile.premiumType
            }
            if (profile.premium && profile.premiumType == 'Full Access') {
                if (req.query.type == 'Order2' || req.query.type == 'Order3') {
                    next()
                } else {
                    return res.send({ Upgrade: "To switch to single paper wait to expire current plan" })
                }
            } else if (profile.premium && profile.premiumType == 'Paper1') {
                if (req.query.paper == 'Paper1') {
                    next()
                } else {
                    return res.send({ Upgrade: "You can only upgrade for The Hindu to switch wait to expire current plan " })
                }
            } else if (profile.premium && profile.premiumType == 'Paper2') {
                if (req.query.paper == 'Paper2') {
                    next()
                } else {
                    return res.send({ Upgrade: "You can only upgrade for Times Of India  to switch wait to expire current plan " })
                }
            } else {
                next()
            }

        } catch (e) {
            res.json({ status: "failed", error: e })
        }
    }
}

router.get('/order', authenticate, async (req, res) => {
    try {
        let orderType = req.query.type;
        let amount = 0;
        let paper = ''
        if (orderType === 'Order1') {
            amount = 49;
            paper = req.query.paper
        }
        else if (orderType === 'Order2') {
            amount = 89;
            paper = 'Full Access'
        } else if (orderType == 'Order3') {
            amount = 250;
            paper = 'Full Access'
        } else {
            return res.send({ status: "failed" })
        }
        var options = {
            amount: amount * 100,
            currency: "INR",
        };
        let data = req.userInformation
        let order = await instance.orders.create(options)
        let pay = new payInfo({
            email: data.email,
            name: data.name,
            order_id: order.id,
            order_type: orderType,
            paperType: paper,
            orderTime: Date.now(),
            paymentTime: null,
            payment_id: null,
            signature: null,
            paymentStatus: 'due',
        });
        await pay.save()
        res.send({ status: "success", key: process.env.RAZOR_ID, order });
    } catch (e) {
        res.send({ status: "failed", error: e })
    }
})

router.post('/verify', async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;
    const secret = process.env.RAZOR_SECRET;
    const generatedSignature = crypto.createHmac('sha256', secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    const isValid = generatedSignature === razorpay_signature;

    if (isValid) {
        try {
            let orderInfo = await payInfo.findOne({ order_id: razorpay_order_id })

            let userInfo = await info.findOne({ email: orderInfo.email })
            let Expiry = (userInfo.expiry == null) ? Date.now() : userInfo.expiry
            if (orderInfo.order_type == 'Order1' || orderInfo.order_type == 'Order2') {
                Expiry = Expiry + 30 * 24 * 60 * 60 * 1000;
            } else if (orderInfo.order_type == 'Order3') {
                Expiry = Expiry + 90 * 24 * 60 * 60 * 1000;
            }
            let updatedInfo = await info.updateOne({ email: orderInfo.email }, {
                premium: true,
                premiumDate: Date.now(),
                premiumType: orderInfo.paperType,
                expiry: Expiry,
            })
            await payInfo.updateOne(
                { order_id: razorpay_order_id },
                {
                    payment_id: razorpay_payment_id,
                    signature: razorpay_signature,
                    paymentTime: new Date(),
                    paymentStatus: 'paid',
                }
            );
            res.redirect(process.env.frontend + '/plan')
            res.send({ status: "success", message: "Payment verified" });
        } catch (e) {
            res.send({ status: "failed", message: "something went wrong", error: e });
            res.redirect(process.env.frontend + '/plan')
        }
    } else {
        res.status(400).send({ status: "failed", message: "Invalid signature" });
    }

})


module.exports = router