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




router.get('/check', async (req, res) => {
    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
        let profile = await info.findOne({ email: user.email });
        res.send(profile.Admin)
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
            res.send(profile.Admin)
        } catch {
            res.send(false)
        }
    }
})

router.post('/newmember', async (req, res) => {
    let adder = req.body.email;
    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
        let profile = await info.findOne({ email: user.email });
        if (profile.Admin) {
            try {
                let check = await admininfo.findOne({ email: adder });
                if (check) {
                    res.json({ status: 'admin already exist' })
                    return;
                }
                let updated = await info.findOneAndUpdate({ email: adder }, { Admin: true }, { new: true });
                let adminupdate = new admininfo({ email: updated.email, name: updated.name, date: Date.now() })
                await adminupdate.save()
                res.json({
                    status: 'admin added'
                })
                return;
            } catch (err) {
                console.error('Error while updating admin:', err.message);
                res.json({
                    status: err.message
                });
                return;
            }
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
            if (profile.Admin) {
                try {
                    let check = await admininfo.findOne({ email: adder });
                    if (check) {
                        res.json({ status: 'admin already exist' })
                        return;
                    }
                    let updated = await info.findOneAndUpdate({ email: adder }, { Admin: true }, { new: true });
                    let adminupdate = new admininfo({ email: updated.email, name: updated.name, date: Date.now() })
                    await adminupdate.save()
                    res.json({
                        status: 'admin added'
                    })
                    return;
                } catch (err) {
                    console.error('Error while updating admin:', err.message);
                    res.json({
                        status: err.message
                    });
                    return;
                }
            }
        } catch {
            res.json({
                status: 'something went wrong'
            })
            return;
        }
    }
})
router.post('/remove', async (req, res) => {
    let remover = req.body.email;
    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
        let profile = await info.findOne({ email: user.email });
        if (profile.Admin) {
            try {
                let check = await admininfo.findOne({ email: remover });
                if (check && process.env.Owner_Email != remover) {
                    let updated = await info.findOneAndUpdate({ email: remover }, { Admin: false }, { new: true });
                    await admininfo.deleteOne({ email: updated.email })
                    res.json({ status: 'admin removed' })
                    return;
                } else {
                    if (process.env.Owner_Email == remover) {
                        res.json({ status: 'he is your boss' })
                        return;
                    }
                    res.json({ status: 'admin not exist' })
                    return;
                }
            } catch (err) {
                console.error('Error while updating admin:', err.message);
                res.json({
                    status: err.message
                });
                return;
            }
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
            if (profile.Admin) {
                try {
                    let check = await admininfo.findOne({ email: remover });
                    if (check && process.env.Owner_Email != remover) {
                        let updated = await info.findOneAndUpdate({ email: remover }, { Admin: false }, { new: true });
                        await admininfo.deleteOne({ email: updated.email })
                        res.json({ status: 'admin removed' })
                        return;
                    } else {
                        if (process.env.Owner_Email == remover) {
                            res.json({ status: 'he is your boss' })
                            return;
                        }
                        res.json({ status: 'admin not exist' })
                        return;
                    }
                } catch (err) {
                    console.error('Error while updating admin:', err.message);
                    res.json({
                        status: err.message
                    });
                    return;
                }
            }
        } catch {
            res.json({
                status: 'something went wrong'
            })
            return;
        }
    }
})
router.post('/premium', async (req, res) => {
    const { email: mail, Type, PaperType } = req.body;

    let inc;
    if (Type === 'Basic') inc =30 ;
    else if (Type === 'Medium') inc = 30;
    else inc = 90;

    const millisInDay = 24 * 60 * 60 * 1000;
    const now = Date.now();

    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET);
        let adminProfile = await info.findOne({ email: user.email });

        if (!adminProfile || !adminProfile.Admin) {
            return res.status(403).json({ status: "Not authorized" });
        }

        let targetProfile = await info.findOne({ email: mail });
        if (!targetProfile) {
            return res.json({ status: "Target user does not exist" });
        }

        const newExpiry = targetProfile.expiry
            ? new Date(new Date(targetProfile.expiry).getTime() + inc * millisInDay)
            : new Date(now + inc * millisInDay);

        const updated = await info.findOneAndUpdate(
            { email: mail },
            {
                premium: true,
                premiumDate: now,
                premiumType: PaperType,
                expiry: newExpiry,
            },
            { new: true }
        );

        return res.json({
            status: `Premium ${Type} granted to ${mail}`,
        });

    } catch (err) {
        try {
            let user = jwt.verify(req.cookies.RefreshToken, process.env.REFRESH_SECRET);
            let adminProfile = await info.findOne({ email: user.email });

            if (!adminProfile || !adminProfile.Admin) {
                return res.status(403).json({ status: "Not authorized" });
            }

            const newAccess = jwt.sign(
                {
                    email: adminProfile.email,
                    name: adminProfile.name,
                    premium: adminProfile.premium,
                    type: adminProfile.premiumType,
                },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            res.cookie('AccessToken', newAccess, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax',
            });

            let targetProfile = await info.findOne({ email: mail });
            if (!targetProfile) {
                return res.json({ status: "Target user does not exist" });
            }

            const newExpiry = targetProfile.expiry
                ? new Date(new Date(targetProfile.expiry).getTime() + inc * millisInDay)
                : new Date(now + inc * millisInDay);

            const updated = await info.findOneAndUpdate(
                { email: mail },
                {
                    premium: true,
                    premiumDate: now,
                    premiumType: PaperType,
                    expiry: newExpiry,
                },
                { new: true }
            );

            return res.json({
                status: `Premium ${Type} granted to ${mail} for ${PaperType}`,
            });

        } catch (e) {
            console.error("Refresh token error:", e);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }
});

module.exports = router