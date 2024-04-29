const multer=require("multer");
const path = require("path");
const fs = require('fs');


//multer Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, require('path').resolve(__dirname, '..') + "/backend/upload");
    },
    filename: function (req, file, cb) {
        if(file.fieldname === "prodImage"){
            cb(null, Math.floor(Math.random() * 100000000) + '-' + file.fieldname + '.png');
        }
        if(file.fieldname === "couponImage"){
            cb(null, Math.floor(Math.random() * 100000000) + '-' + file.fieldname + '.png');
        }
    }
})


const upload = multer({ storage: storage });

const prodUpload = upload.fields([
    { name: 'prodImage', maxCount: 1 }, 
    
])

const couponUpload = upload.fields([
    { name: 'couponImage', maxCount: 1 }, 
    
])

module.exports = {
    prodUpload,
    couponUpload
};