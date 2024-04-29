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
