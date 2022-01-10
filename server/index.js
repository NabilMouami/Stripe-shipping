const express = require("express");
const cors = require('cors');
const uuid = require('uuid')
const app = express();
const stripe = require("stripe")("sk_test_51K6YxnLDcLVLx47giV2nVOjH0cqgfKp3olhkOWui41pzT2SYl2DzkZTxEitoykGCwJtBbEBb3aC7gBn8ZQMtgwSS005rC162If");



// middleware
app.use(express.json());
app.use(cors())

// routes
app.post("/payment", (req, res) => {
    const { product,token } = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    const idempontencyKey = uuid();
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price *100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        },{idempontencyKey})
    }).then(result => res.status(200).json(result))
    .catch(err => console.log(err))
});

// listening...
const port = process.env.PORT || 8282;
app.listen(port, () => console.log(`Listening on port ${port}...`));