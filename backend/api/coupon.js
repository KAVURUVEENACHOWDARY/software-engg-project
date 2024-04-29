const router = require('express').Router();
const Coupon = require('../models/coupon');
const mongoose = require('mongoose');

const { couponUpload } = require("../multer");
const s3 = require("../s3");
const fs = require('fs');


router.post('/add-coupon', couponUpload, async(req, res) => {
    try{
        const {supplierId, terms, quantity, couponName} = req.body;
        if(!req.files || !quantity || !couponName || !supplierId){
            return res.status(400).json({message:"All fields are required"});
        }

        const response = await s3.uploadFile(process.env.AWS_BUCKET_NAME,req.files.couponImage[0]); 
        const couponId = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
        for(let i = 0; i< quantity; i++){
            const newCoupon = new Coupon({
                supplierId,
                couponId,
                terms,
                couponImageUrl: response.Location,
                couponName
            });
            await newCoupon.save();
        }
        res.status(200).json({message:"coupons added successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"});
    }
});

router.get('/get-coupons/supplier/:supplierId', async(req, res) => {
    try{
        const supplierId = new mongoose.Types.ObjectId(req.params.supplierId);
        const coupons = await Coupon.aggregate([
            {
                $match: {supplierId: supplierId}
            },
            {
                $group: {
                    _id: "$couponId",
                    claimed: {$sum: {$cond: [{$eq: ["$customerId", null]}, 0, 1]}},
                    notClaimed: {$sum: {$cond: [{$eq: ["$customerId", null]}, 1, 0]}},
                    couponImageUrl: {$first: "$couponImageUrl"},
                    couponName: {$first: "$couponName"},
                    couponTerms: {$first: "$terms"}
                }
            },
            {
                $project: {
                    _id: 1,
                    claimed: 1,
                    notClaimed: 1,
                    couponImageUrl: 1,
                    couponName:1,
                    couponTerms: 1
                }
            }
        ]);
        res.status(200).json(coupons);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"});
    }
});

router.get('/get-coupons/customer/:customerId', async(req, res) => {
    try{
        const customerId = new mongoose.Types.ObjectId(req.params.customerId);
        const coupons = await Coupon.find({customerId: customerId}).select({_id: 1, terms: 1, couponImageUrl: 1, scratched: 1, couponName: 1});
        res.status(200).json(coupons);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"});
    }
});

router.get('/update-coupon/:couponId', async(req, res) => {
    try{
        const couponId = new mongoose.Types.ObjectId(req.params.couponId);
        const coupon = await Coupon.findOne({_id: couponId});
        coupon.scratched = true;
        await coupon.save();
        res.status(200).json({message:"coupon updated successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"});
    }
});

module.exports = router;