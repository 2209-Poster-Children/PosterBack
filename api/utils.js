const stripe = require("stripe")('sk_test_51MF3pUJXXCrR1XV9yGmA9MfWy1idajVryHp15VLBXgLQ30g5fyi42Kmd2784wFEPxIQvm41aRf7vdhxtsstRXotL00zpL5cytk');

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