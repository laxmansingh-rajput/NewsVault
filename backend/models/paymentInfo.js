const mongoose = require('mongoose');
const { Schema } = mongoose;
const paySchema = new Schema({
    email: String,
    name: String,
    order_id: String,
    order_type: String,
    paperType: String,
    orderTime: Date,
    paymentTime: Date,
    payment_id: String,
    signature: String,
    paymentStatus: String,
});

const paymentInfo = mongoose.model('paymentInfo', paySchema);
module.exports = paymentInfo;
