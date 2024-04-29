const express = require('express');
const router = express.Router();
const SupplierModel = require("../models/supplier")
const CustomerModel = require('../models/customer');

router.post('/customer-login', async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"please enter all fields"});
        }
        const customer = await CustomerModel.findOne({email:email});
        if(!customer){
            return res.status(404).json({message:"customer does not exist"});
        }
        if(customer.password !== password){
            return res.status(400).json({message:"invalid credentials"});
        }
        res.status(200).json({message:"success", user: customer});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"});
    }
})

router.post("/customer-register", async(req, res) => {
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({message:"please enter all fields"});
        }
        const customer = await CustomerModel.findOne({email:email});
        if(customer){
            return res.status(400).json({message:"customer already exists"});
        }
        const newCustomer = new CustomerModel({
            email,
            password,
            name
        });
        await newCustomer.save();
        const customerDetails = await CustomerModel.findOne({email:email});
        res.status(200).json({message:"successfull", data:customerDetails});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"});
    }
})

router.post("/supplier-register", async(req, res) => {
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({message:"please enter all fields"});
        }
        const supplier = await SupplierModel.findOne({email:email});
        if(supplier){
            return res.status(400).json({message:"supplier already exists"});
        }
        const newSupplier = new SupplierModel({
            email,
            password,
            name
        });
        await newSupplier.save();
        res.status(200).json({message:"success", user:newSupplier});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"});
    }
})

router.post("/supplier-login", async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"please enter all fields"});
        }
        const supplier = await SupplierModel.findOne({email:email}).lean();
        if(!supplier){
            return res.status(404).json({message:"supplier does not exist"});
        }
        if(supplier.password !== password){
            return res.status(400).json({message:"invalid credentials"});
        }
        res.status(200).json({message:"success", user:supplier});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"});
    }
})

module.exports = router;