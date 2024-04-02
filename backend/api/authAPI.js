const express = require('express');
const router = express.Router();

const CustomerModel = require('../models/customer');
const AdminModel = require('../models/admin');
const ProductModel = require('../models/products');
const SupplierModel = require('../models/supplier');

router.post('/customer-login', async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({message:"please enter all fields"});
        }
        const customer = CustomerModel.findOne({email:email});
        if(!customer){
            return res.json({message:"customer does not exist"});
        }
        if(customer.password !== password){
            return res.json({message:"invalid credentials"});
        }
        res.status(200).json({message:"success"});
    }catch(err){
        res.json({message:"error"});
    }
})

router.post('/admin-login', async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({message:"please enter all fields"});
        }
        const admin = AdminModel.findOne({email:email});
        if(!admin){
            return res.json({message:"admin does not exist"});
        }
        if(admin.password !== password){
            return res.json({message:"invalid credentials"});
        }
        res.status(200).json({message:"success"});
    }catch(err){
        res.json({message:"error"});
    }
})


router.post("customer-register", async(req, res) => {
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.json({message:"please enter all fields"});
        }
        const customer = CustomerModel.findOne({email:email});
        if(customer){
            return res.json({message:"customer already exists"});
        }
        const newCustomer = new CustomerModel({
            email,
            password,
            name
        });
        await newCustomer.save();
        res.status(200).json({message:"success"});
    }catch(err){
        res.json({message:"error"});
    }
})

router.post("admin-register", async(req, res) => {
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.json({message:"please enter all fields"});
        }
        const admin = AdminModel.findOne({email:email});
        if(admin){
            return res.json({message:"admin already exists"});
        }
        const newAdmin = new AdminModel({
            email,
            password,
            name
        });
        await newAdmin.save();
        res.status(200).json({message:"success"});
    }catch(err){
        res.json({message:"error"});
    }
})

router.post("/supplier-register", async(req, res) => {
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.json({message:"please enter all fields"});
        }
        const supplier = await SupplierModel.findOne({email:email});
        if(supplier){
            return res.json({message:"supplier already exists"});
        }
        const newSupplier = new SupplierModel({
            email,
            password,
            name
        });
        await newSupplier.save();
        res.status(200).json({message:"success", user:newSupplier});
    }catch(err){
        res.json({message:"error"});
    }
})

router.post("/supplier-login", async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({message:"please enter all fields"});
        }
        const supplier = await SupplierModel.findOne({email:email}).lean();
        if(!supplier){
            return res.json({message:"supplier does not exist"});
        }
        if(supplier.password !== password){
            return res.json({message:"invalid credentials"});
        }
        res.status(200).json({message:"success", user:supplier});
    }catch(err){
        res.json({message:"error"});
    }
})





module.exports = router;