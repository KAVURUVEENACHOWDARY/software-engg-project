const express=require("express");
const app=express();
const cors=require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config({ path: __dirname +'/.env' });
require("./cron jobs/cron");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://veena:1234567890@cluster0.sp01vnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db=mongoose.connection;
db.on("error",(error)=> console.log(error));
db.once("open",()=>console.log("connected to database"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authApi = require("./api/authAPI");
const productApi = require("./api/productAPI");
const couponApi = require("./api/coupon");

app.use("/product", productApi);
app.use("/auth", authApi);
app.use("/coupon", couponApi);

app.all("/*",(req,res)=>{
    return res.status(404).json({message:"page not found"});
});

app.listen(3002, ()=>{
    console.log("running on 3002");
});
