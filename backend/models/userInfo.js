const mongoose = require('mongoose');
const { Schema } = mongoose;

const infoSchema = new Schema({
    email: String,
    name: String,
    password: String,
    pictureUrl: String,
    premium: { type: Boolean, default: false },
    premiumDate: { type: Date, default: null },
    premiumType: {
        type: String,
        enum: ['Paper1', 'Paper2', 'Full access', null],
        default: null
    },
    expiry: Date,
    Admin: { type: Boolean, default: false }
});

const Info = mongoose.model('Info', infoSchema);
module.exports = Info;
