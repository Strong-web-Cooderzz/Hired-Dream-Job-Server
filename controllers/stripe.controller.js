const { stripe } = require('../models/mongodb.model');

exports.stripePayment = async (req, res) => {
    const { price } = req.body;
    const amount = price*100
    console.log(amount)

    // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    "payment_method_types": ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

