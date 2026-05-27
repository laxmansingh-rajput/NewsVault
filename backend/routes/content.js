const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const info = require('../models/userInfo.js');
const s3 = require('../confiq/client.js')
const { GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const cfsign = require('aws-cloudfront-sign');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

mongoose.connect(process.env.DB_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


const authenticate = async (req, res, next) => {
    try {
        const user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET);
        const profile = await info.findOne({ email: user.email });
        if (profile?.premium && (profile.premiumType === req.query.type || profile.premiumType === "Full Access")) {
            return next();
        }
    } catch { }

    try {
        const user = jwt.verify(req.cookies.RefreshToken, process.env.REFRESH_SECRET);
        const profile = await info.findOne({ email: user.email });
        if (!profile?.premium) throw new Error();
        const newAccess = jwt.sign({
            email: profile.email,
            name: profile.name,
            premium: profile.premium,
            type: profile.premiumType
        }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.cookie('AccessToken', newAccess, { maxAge: 15 * 60 * 1000, httpOnly: true, sameSite: 'Lax' });
        if (profile.premiumType === req.query.type || profile.premiumType === "Full Access") {
            return next();
        }
    } catch {
        return res.json({ status: "something went wrong" });
    }
};

const getAccessUrl = async (s3Key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: s3Key
    });

    const signedUrl = await getSignedUrl(s3, command, {
        expiresIn: 60 * 10
    });
    return signedUrl;
};

router.get('/pdfAccess', authenticate, async (req, res) => {
    try {
        const key = req.query.key;
        const signedUrl = await getAccessUrl(key);
        res.json({ success: true, status: true, url: signedUrl });
    } catch (err) {
        console.error("Error in /pdfAccess:", err);
        res.status(500).json({ status: false, error: err.toString() });
    }
});

router.get('/list', authenticate, async (req, res) => {
    try {
        const type = req.query.type + "/";
        const command = new ListObjectsV2Command({ Bucket: process.env.BUCKET_NAME, Prefix: type, Delimiter: '/' });
        const response = await s3.send(command);
        const fileNames = response.Contents?.map(obj => obj.Key) || [];
        res.json({ success: true, keys: fileNames, size: fileNames.length, status: "all the objects are sent" });
    } catch (err) {
        console.log(err)
        res.json({ success: false, status: "someThing went wrong", error: err });
    }
});

module.exports = router;
