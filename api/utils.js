const stripe = require("stripe")('pk_test_51MF3pUJXXCrR1XV9xc3wPIVqnj5k8WRMaWK6mpMAZa8d56IKNXLBznyaYBV6bA5Bmp3AOGyGSDLz3X1AFqfKSsAE00KMt9puEH');

function requireUser(req,res, next){
    console.log("This is req user",req.user)
    if(!req.user){
        res.status(403)
        next({
            name: "MissingUserError",
            message: "You MUST be loggied in to perform this action"
        });
    }
    next();
}
//unfinished

  async function makePurchase (req, res) {
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.totalPrice,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return paymentIntent.client_secret;
};

module.exports ={
    requireUser,
    makePurchase
}