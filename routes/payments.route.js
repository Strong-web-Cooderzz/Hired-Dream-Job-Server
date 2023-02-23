const router = require('express').Router();
const { payForFeaturedJob } = require('../controllers/payments.controller');

router.post('/create-payment-intent', payForFeaturedJob);

module.exports = router;
