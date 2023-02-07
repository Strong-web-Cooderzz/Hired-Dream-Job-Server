const stripe = require("stripe")("sk_test_51M6FsBLZ3fbZi8VUMpanZHl2iofYhhfuaS0rf480kvRvJOAd1IX2hi0RfEYWL5cnkosFLUUVR2a3DuuQd8BAL1tV007WmiFBlu");

exports.payForFeaturedJob = async (req, res) => {
	const jobManage = req.body;
	const price = jobManage.price;
	const ammount = price * 100;
	const paymentIntent = await stripe.paymentIntents.create({
		currency: 'usd',
		ammount: ammount,
		'payment_method_types': [
			'card'
		]
	})
	res.send({
		clientSecret: paymentIntent.client_secret,
	})
};
