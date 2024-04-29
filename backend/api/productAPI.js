const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const QRCode = require('qr-image');
const ProductModel = require('../models/products');
const Coupon = require('../models/coupon');
const { prodUpload } = require("../multer");
const fs = require('fs');
const s3 = require("../s3");
const { default: mongoose } = require('mongoose');

const pageWidth = 612;
const pageHeight = 792;
const qrWidth = 100;
const qrHeight = 100;
const marginX = 50;
const marginY = 50;
const columnSpacing = 50;
const rowSpacing = 50;
const maxColumns = Math.floor((pageWidth - 2 * marginX + columnSpacing) / (qrWidth + columnSpacing));
const pageMarginX = marginX + qrWidth + columnSpacing;
const pageMarginY = marginY + qrHeight + rowSpacing;

router.post("/add-product", prodUpload, async (req, res) => {
    try {
        const response = await s3.uploadFile(process.env.AWS_BUCKET_NAME,req.files.prodImage[0]); 
        const { name,
                price,
                description,
                category,
                supplier,
                stock,
                expiry,
                warranty
            } = req.body;
        const newId = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
        const product = new ProductModel({
            productId : newId,
            name,
            price,
            description,
            category,
            supplier,
            stock,
            expiry,
            warranty,
            imageUrl:response.Location
        });
        const qrCodes = [], products = [];
        for(let i = 0; i< stock; i++){
            const newProduct = {
                randomNumber : Math.floor(1000000000000000 + Math.random() * 9000000000000000),
                customerId: null,
                claimed: false
            }
            products.push(newProduct);
            const qrCode = QRCode.imageSync(`http://192.168.1.7:3000/${newId}/${newProduct.randomNumber}`, { type: 'png' });
            qrCodes.push(qrCode);
        }
        product.products = products;
        await product.save();

        const doc = new PDFDocument();
        const pdfFileName = `product_qrs.pdf`;
        doc.pipe(fs.createWriteStream(pdfFileName));

        const qrCodesCount = qrCodes.length;
        const columns = Math.min(maxColumns, qrCodesCount);
        let currentPage = 1;
        let currentColumn = 0;
        let currentRow = 0;

        const maxRowsPerPage = Math.floor((pageHeight - 2 * marginY + rowSpacing) / (qrHeight + rowSpacing));

        qrCodes.forEach((qrCode, index) => {
            const x = marginX + currentColumn * pageMarginX;
            const y = marginY + currentRow * pageMarginY;
        
            if (currentRow >= maxRowsPerPage) {
                doc.addPage();
                currentPage++;
                currentColumn = 0;
                currentRow = 0;
            }
        
            doc.image(qrCode, x, y, { width: qrWidth, height: qrHeight });
            doc.moveDown();
        
            currentColumn++;
            if (currentColumn >= columns) {
                currentColumn = 0;
                currentRow++;
            }
        });        

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=product_qrs.pdf',
                'Content-Length': pdfData.length
            });
            res.end(pdfData);
        });
        doc.end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong... ;)" });
    }
});

router.get("/get-products", async (req, res) => {
    try {
        const products = await ProductModel.find().select({productId:1, _id:0, description:1, stock:1, price:1, imageUrl:1, name:1, category:1});
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Something Went Wrong... ;)" });
    }
});

router.get("/get-products/:supplierId", async (req, res) => {
    try {
        const supplierId = req.params.supplierId;
        const products = await ProductModel.find({supplier:new mongoose.Types.ObjectId(supplierId)}).select({productId:1, _id:0, description:1, stock:1, price:1, imageUrl:1, name:1, category:1});
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong... ;)" });
    }
});

router.post("/buy-product/:customerId", prodUpload, async(req, res) => {
    try{
        const productsToBuy = req.body.products;
        const customerId = req.params.customerId;

        const productQuantityMap = productsToBuy.reduce((map, product) => {
            map[product.productId] = (map[product.productId] || 0) + product.quantity;
            return map;
        }, {});

        const productIds = Object.keys(productQuantityMap);
        const products = await ProductModel.find({ productId: { $in: productIds } });

        for (let product of products) {
            const quantity = productQuantityMap[product.productId];
            const purchaseDate = new Date().toUTCString();

            for (let i = 0; i < quantity; i++) {
                product.stock -= 1;
                const p = product.products.find((p) => p.customerId === null);
                if (p) {
                    p.customerId = customerId;
                    p.purchaseDate = purchaseDate;

                    if (product.expiry !== null) {
                        let purchaseDateObj = new Date(purchaseDate);
                        purchaseDateObj.setDate(purchaseDateObj.getDate() + product.expiry);
                        p.expiryDate = purchaseDateObj.toUTCString();
                    }

                    if (product.warranty !== null) {
                        let purchaseDateObj = new Date(purchaseDate);
                        purchaseDateObj.setDate(purchaseDateObj.getDate() + product.warranty);
                        p.warrantyDate = purchaseDateObj.toUTCString();
                    }
                }
            }

            await product.save();
        }

        let coupon = null;
        for(let i = 0; i < 3; i++){
            const randomProductIndex = Math.floor(Math.random() * productsToBuy.length);
            const randomProduct = productsToBuy[randomProductIndex];
            const product = await ProductModel.findOne({productId:randomProduct.productId});

            coupon = await Coupon.findOne({supplierId:product.supplier, customerId:null});
            if(coupon){
                break;
            }
        }
        if(coupon){
            coupon.customerId = customerId;
            await coupon.save();
        }
        res.status(200).json({message:"successfull", couponReceived: coupon?true:false});
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong...)" });
    }
});

router.get("/claim-product/:customerId/:productId/:randomNumber", async(req, res) => {
    try{
        const customerId = req.params.customerId;
        const productId = req.params.productId;
        const randomNumber = req.params.randomNumber;

        const product = await ProductModel.find({productId:productId});
        product[0].products.find((p) => p.randomNumber === randomNumber && p.customerId === customerId).claimed = true;
        await product[0].save();

        res.status(200).send({message: "successfull"});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong... ;)" });
    }
});

router.post("/verify-product/:productId/:randomNumber", async(req, res) => {
    try{
        const customerId = req.body.customerId;
        const productId = req.params.productId;
        const randomNumber = req.params.randomNumber;

        const product = await ProductModel.find({productId:productId});
        if(product.length === 0){
            return res.status(404).json({message : "Product not found"});
        }
        const productClaimed = product[0].products.find((p) => p.randomNumber === randomNumber);
        const claimedCustomer = productClaimed.customerId;

        const {name, price, category, description, imageUrl} = product[0];

        if(claimedCustomer === null){
            return res.status(200).send({message: "Authentic", name, price, category, description, imageUrl});
        }
        if(claimedCustomer.toString() === customerId){
            const { purchaseDate } = productClaimed;
            return res.status(200).send({message: "owned", name, price, category, description, imageUrl, purchaseDate});
        }

        return res.status(200).send({message: "fake", name, price, category, description, imageUrl});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong... ;)" });
    }
});

module.exports = router;