const express = require('express');
const router = express.Router();

const ProductModel = require('../models/products');

const {prodUpload} = require("../multer");

const s3 = require("../s3");


router.post("/add-product", prodUpload, async (req, res) => {
    try {
        const response = await s3.uploadFile(process.env.AWS_BUCKET_NAME,req.files.prodImage[0]) ; 
        const {name,price,description,category,supplier,stock} = req.body;
        const newId = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
        const product = new ProductModel({
            productId : newId,
            name,
            price,
            description,
            category,
            supplier,
            stock,
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
        const products = await ProductModel.find();
        res.status(200).json(products);
    } catch (err) {
        res.json({ message: "error" });
    }
})

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
        for(let i = 0; i < productsToBuy.length; i++){
            const productId = productsToBuy[i].productId;
            const quantity = productsToBuy[i].quantity;
            const product = await ProductModel.findOne({productId:productId});
            if(!product){
                continue;
            }
            for(let j = 0; j < quantity; j++){
                product.stock -= 1;
                const p = product.products.find((p) => p.customerId === null);
                p.customerId = customerId;
                p.purchaseDate = new Date().toUTCString();
            }
            product.save();
        }
        res.status(200).json({message:"successfull"});
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong... ;)" });
    }
});

router.get("/claim-product/:customerId/:productId/:randomNumber", async(req, res) => {
    try{
        const customerId = req.params.customerId;
        const productId = req.params.productId;
        const randomNumber = req.params.randomNumber;

        const product = await ProductModel.find({productId:productId});
        product[0].products.find((p) => p.randomNumber === randomNumber && p.customerId === customerId).claimed = true;

        res.status(200).send({message: "successfull"});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong... ;)" });
    }
});


router.get("/warranty-product/:customerId/:productId/:randomNumber", async(req, res) => {
    try{
        const customerId = req.params.customerId;
        const productId = req.params.productId;
        const randomNumber = req.params.randomNumber;

        const product = await ProductModel.find({productId:productId});
        product[0].products.find((p) => p.randomNumber === randomNumber && p.customerId === customerId).claimed = true;

        res.status(200).send({message: "successfull"});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong... ;)" });
    }
});


module.exports = router;