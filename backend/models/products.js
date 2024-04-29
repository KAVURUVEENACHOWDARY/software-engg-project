const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId:{
        type: Number,
        required:true
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    description:{
        type: String,
        required: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    imageUrl:{
        type: String,
        required: true,
    },
    supplier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplier',
        required: true,
    },
    expiry:{
        type:Number,
        default:null
    },
    warranty:{
        type:Number,
        default:null
    },
    products:[
        {
            randomNumber: {
                type: String,
                required: true,
            },
            customerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'customer'
            },
            claimed: {
                type: Boolean,
                required: true
            },
            purchaseDate:{
                type: Date,
            },
            expiryDate:{
                type:Date
            },
            warrantyDate:{
                type:Date
            },
            expiryNotification:{
                type:Boolean,
                default:false
            },
            warrantyNotification:{
                type:Boolean,
                default:false
            },
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema);