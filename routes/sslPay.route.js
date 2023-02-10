const { sslPayment } = require('../controllers/sslPay.controller');


const router = require('express').Router();




// ------ SSL Payment  ---------\\
router.post('/sslPay', sslPayment);


module.exports = router;
