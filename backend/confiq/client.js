const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS,
        secretAccessKey: process.env.AWS_SECRET
    }
});

module.exports = s3;