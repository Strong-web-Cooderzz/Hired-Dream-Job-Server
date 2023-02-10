const SSLCommerzPayment = require("sslcommerz-lts");
const { jobsCollection, ObjectId, featuredJobCollection } = require("../models/mongodb.model");

// SSL Commerze
const store_id = process.env.SOTRE_ID
const store_passwd = process.env.STORE_PASS
console.log(store_id,store_passwd)
const is_live = false //true for live, false for sandbox


exports.sslPayment = async (req, res) => {
    const id = req.body.id;

    const payJob = await jobsCollection.findOne({_id: ObjectId(id)})

    const dbUser = req.body.dbUser
    const transactionId =  new ObjectId().toString()
    // sslcommerz init
    const data = {
        total_amount: 499,
        currency: 'BDT',
        tran_id:transactionId, // use unique tran_id for each api call
        success_url: 'http://localhost:5173/success',
        fail_url: 'http://localhost:5173/fail',
        cancel_url: 'http://localhost:5173/cancel',
        ipn_url: 'http://localhost:5173/ipn',
        shipping_method: 'Online',
        product_name: payJob.title,
        product_category: payJob.category,
        product_profile: 'general',
        cus_name: payJob.company,
        cus_email: payJob.jobEmail,
        cus_add1: payJob.location,
        cus_add2: payJob.location,
        cus_city:dbUser.city,
        cus_state: payJob.location,
        cus_postcode: dbUser.zipCode,
        cus_country: dbUser.country,
        cus_phone: dbUser.phoneNumber,
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    console.log(data)
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {

        featuredJobCollection.insertOne({
            ...payJob, transactionId: transactionId, 
        })
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({url:GatewayPageURL})
        console.log('Redirecting to: ', apiResponse)
    });
};

