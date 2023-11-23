const express = require('express')
const app = express()
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser')
const session = require('express-session')

// .well-known/apple-app-site-association

app.use(session({
  secret: 'hello',
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 1000 * 60 * 60 
  },
}))


app.use(cookieParser())

app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(__dirname, '/')))

app.use("/.well-known/apple-app-site-association", function (req, res) {
    console.log(__dirname)
    console.log(__filename)
    res.sendFile(path.join(__dirname, "", ".well-known/apple-app-site-association"))
} )

const stripe = require('stripe')('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');
// // const stripe = require('stripe')('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');
const PORT = process.env.PORT || 3000

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 20,
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

app.use('/a', async(req, res) => {
    res.render('index.html', { layout: false });
})

app.listen(PORT, 
	() => console.log("Server is running..."));
