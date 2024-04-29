const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    couponId: {
        type: String,
        required: true,
    },
    couponName:{
        type: String,
        required: true
    },
    terms: {
        type: String,
        required: true
    },
    couponImageUrl:{
        type: String,
        required: true
    },
    scratched:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});


module.exports = mongoose.model("Coupon", couponSchema);