const cron = require('node-cron');

const sendEmail = require("./sendEmail");
const Product = require("../models/products");
const Customer = require("../models/customer");

// 1) Cron job to send expiry alerts (runs every 10 minutes)
cron.schedule('*/1 * * * *', async () => {
  const currentDate = new Date().toUTCString();
  try {
    const products = await Product.find({});
    for (const product of products) {
      if (product.expiry !== null) {
        for (const p of product.products) {
          if (p.customerId !== null && p.expiryDate !== null && !p.expiryNotification) {
            if (new Date(p.expiryDate) < new Date(currentDate)) {
              const customer = await Customer.findById(p.customerId);
              sendEmail(
                customer.name, 
                customer.email, 
                'Expiry Alert', 
                `Your product ${product.name} purchased on ${p.purchaseDate.toLocaleDateString()} has expired on ${p.expiryDate.toLocaleDateString()}.`);
                p.expiryNotification = true;
            }
          }
        }
      }
      await product.save();
    }
  } catch (error) {
    console.error('Error processing products:', error);
  }
});

// 2) Cron job to send warranty alerts (runs every 10 minutes)
cron.schedule('*/1 * * * *', async () => {
  const currentDate = new Date().toUTCString();
  try {
    const products = await Product.find({});
    for (const product of products) {
      if (product.expiry !== null) {
        for (const p of product.products) {
          if (p.customerId !== null && p.expiryDate !== null && !p.warrantyNotification) {
            if (new Date(p.expiryDate) < new Date(currentDate)) {
              const customer = await Customer.findById(p.customerId);
              sendEmail(
                customer.name, 
                customer.email, 
                'Warranty Alert', 
                `Your product warranty for ${product.name} purchased on ${p.purchaseDate.toLocaleDateString()} has expired on ${p.warrantyDate.toLocaleDateString()}.`);
                p.warrantyNotification = true;
            }
          }
        }
      }
      await product.save();
    }
  } catch (error) {
    console.error('Error processing products:', error);
  }
});