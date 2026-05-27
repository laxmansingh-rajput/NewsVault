const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const info = require('../models/userInfo.js');
const admininfo = require('../models/adminInfo.js');
const s3 = require('../confiq/client.js')
const { S3Client, ListObjectsV2Command, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

require('dotenv').config();

mongoose.connect(process.env.DB_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const authenticate = async (req, res, next) => {
    try {
        let user = jwt.verify(req.cookies.AccessToken, process.env.JWT_SECRET)
        let profile = await info.findOne({ email: user.email });
        if (profile.Admin) {
            next()
        } else {
            res.json(
                {
                    status: "something went wrong"
                }
            )
            return;
        }
    } catch {
        try {
            const user = jwt.verify(req.cookies.RefreshToken, process.env.REFRESH_SECRET);
            const profile = await info.findOne({ email: user.email });
            if (!profile.Admin) {
                res.json(
                    {
                        status: "something went wrong"
                    }
                )
                return;
            } else {
                const newAccess = jwt.sign({
                    email: profile.email,
                    name: profile.name,
                    premium: profile.premium,
                    type: profile.premiumType,
                    Admin: profile.Admin
                }, process.env.JWT_SECRET, { expiresIn: '15m' });

                res.cookie('AccessToken', newAccess, {
                    maxAge: 15 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'Lax'
                });

                req.user = profile;
                next();
            }
        } catch (err) {
            res.json(
                {
                    status: "something went wrong"
                }
            )
        }
    }
}




const listObjectsInFolder = async (bucketName, folderPath) => {
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: folderPath,
        Delimiter: '/',
    });
    try {
        const response = await s3.send(command)
        const fileNames = response.Contents?.map(obj => obj.Key) || [];
        return fileNames;
    } catch (error) {
        console.error("Error listing objects:", error);
        return [];
    }
};


const Delete = async (KEY) => {
    const bucketParams = { Bucket: process.env.BUCKET_NAME, Key: KEY };
    try {
        const data = await s3.send(new DeleteObjectCommand(bucketParams));
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};
function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
}
const getUpload = async (folder) => {
    let f = (folder == 'Paper1') ? 'The-Hindu' : 'Time-Of-India'
    let name = f + "[" + getTodayDate() + "].pdf"

    let key = `${folder}/${name}`
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ContentType: 'application/pdf',
        })
        const url = await getSignedUrl(s3, command, {
            expiresIn: 3600 * 0.25,
        })
        return url
    } catch (err) {
        console.error("Error generating signed URL:", err)
        throw err
    }
}

router.get('/get', authenticate, async (req, res) => {
    try {
        let type = req.query.type
        let result = await listObjectsInFolder(process.env.BUCKET_NAME, type);
        res.json({
            keys: result,
            size: result.length - 1,
            status: "all the objects are sent"
        })
    } catch (err) {
        res.json({
            status: "someThing went wrong",
            error: err
        })
    }
});

router.get('/delete', authenticate, async (req, res) => {
    try {
        let key = req.query.key;
        let a = await Delete(key);
        if (a.$metadata.httpStatusCode === 204) {
            let arr = key.split('/')
            let result = await listObjectsInFolder(process.env.BUCKET_NAME, arr[0] + '/');
            res.json({
                keys: result,
                size: result.length - 1,
                status: "all the objects are sent"
            })
        } else {
            res.json({
                status: "someThing went wrong",
            })
        }
    } catch (err) {
        res.json({
            status: "someThing went wrong",
            error: err
        })
    }
})
router.get('/upload', authenticate, async (req, res) => {
    try {
        let folder = req.query.folder
        let url = await getUpload(folder)
        res.json({
            status: 'success',
            Url: url
        })
    } catch (err) {
        res.json({ status: "some thing went wrong" })
    }

})
module.exports = router
