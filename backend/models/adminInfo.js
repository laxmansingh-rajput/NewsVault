const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    email: String,
    name: String,
    date: Date,

});

const AdminInfo = mongoose.model('AdminInfo', adminSchema);
module.exports = AdminInfo;
