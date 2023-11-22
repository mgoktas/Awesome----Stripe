const express = require('express')

const app = express()

const stripe = require('stripe')('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');
// const stripe = require('stripe')('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');
const PORT = 3000

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    // publishableKey: 'pk_live_51MzWeiEYzAPwGPE13wscXu5RF5KI12zxxPgLcDS4fMW6T1DOlAjNqREMP2g5SIfDeZVSGtvQuAj8bpQMIGmYrt5U00ZHCar5IV'
  });
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});