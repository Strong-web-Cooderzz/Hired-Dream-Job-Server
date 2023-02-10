const { stripePayment } = require('../controllers/stripe.controller');

const router = require('express').Router();




// ------ Stripe  ---------\\
router.post('/payment_intents', stripePayment);


module.exports = router;
