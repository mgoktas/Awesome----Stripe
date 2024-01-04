const express = require('express')
const app = express()
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbUser:qAz687213@atlascluster.n9lzqth.mongodb.net/?retryWrites=true&w=majority";
const cors = require('cors');

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

app.use(cors()); // Allows request from any IP (prevent any CORS error)

// Enable parsing of URL-encoded data on all routes:
app.use(express.urlencoded({
   extended: false, // Whether to use algorithm that can handle non-flat data strutures
   limit: 10000, // Limit payload size in bytes
   parameterLimit: 2, // Limit number of form items on payload
}));

// app.get('/', async (req,res) => {
//   res.sendFile(path.join(__dirname+'/willdoro.html'));
// })

const nodemailer = require('nodemailer');

app.post('/deleteaccount', async function (req, res) {

  const email = await req.body.email

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'mgoktasmgoktas@gmail.com',
      pass: 'vwaf atti uhgs acqd'
    },
  });
  
  var mailOptions = {
    from: 'mgoktasmgoktas@gmail.com',
    to: 'ahmethkhkhk@gmail.com',
    subject: 'Account Deletion Request',
    text: 'Please delete this accounts info from database. That was easy!, email' + email
  };
  
  await transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

})

app.get('/', async(req, res) => {
  res.render('willdoro.html', { layout: false });
})

app.use("/.well-known/apple-app-site-association", async function (req, res) {
    console.log(__dirname)
    console.log(__filename)
    res.sendFile(path.join(__dirname, "", ".well-known/apple-app-site-association"))
} )

const stripe = require('stripe')('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');
// const stripe = require('stripe')('sk_test_51MzWeiEYzAPwGPE1vKrubfWOhfFxWYxotsGYVSdS8QcXWHwNk1IcLOzIqsZPhSRGymalUo8TrAAIQrnl0eLiCmHh00WRnMD5Wg');
const PORT = process.env.PORT || 3000

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 499,
    currency: 'usd',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    amount: paymentIntent.amount,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    // publishableKey: 'pk_live_51MzWeiEYzAPwGPE13wscXu5RF5KI12zxxPgLcDS4fMW6T1DOlAjNqREMP2g5SIfDeZVSGtvQuAj8bpQMIGmYrt5U00ZHCar5IV'
  });
});

app.post('/create-checkout-session', async (req, res) => {

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price: 'price_1OFSqJEYzAPwGPE1fvwe4P2b',
        // price: 'price_1OGDO2EYzAPwGPE1sx7e0bOP',
      },
    ],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
    trial_period_days: 7
  });


  
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 499,

    currency: 'usd',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      subscriptionId: subscription.id,
      reason: 'subscription',
    },
  });
 
    res.json({
      paymentIntent: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      subscription: subscription.id
    });
});

app.post('/in-app', async (req, res) => {


  console.log(req.body)

  
  
  
 
 
});

app.post('/create-checkout-session2', async (req, res) => {
  console.log('499')

  const {priceId} = req.query
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
    trial_period_days: 7
  });


  
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 499,
    currency: 'usd',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      subscriptionId: subscription.id,
      reason: 'subscription',
    },
  });
  
  // const session = await stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   line_items: [
  //     {
  //       price: priceId,
  //       // For metered billing, do not pass quantity
  //       quantity: 1,
  //     },
  //   ],
  //   // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
  //   // the actual Session ID is returned in the query parameter when your customer
  //   // is redirected to the success page.
  //   success_url: "http://will-doro-ff47e2266450.herokuapp.com/success?email=email",
  //   success_url: "http://yoursite.com/order/success?session_id={CHECKOUT_SESSION_ID}",
  //   cancel_url: 'https://example.com/canceled.html',
  // });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      // publishableKey: 'pk_live_51MzWeiEYzAPwGPE13wscXu5RF5KI12zxxPgLcDS4fMW6T1DOlAjNqREMP2g5SIfDeZVSGtvQuAj8bpQMIGmYrt5U00ZHCar5IV'
    });

  // res.redirect(303, 'http://will-doro-ff47e2266450.herokuapp.com/success?email=email')
});

app.post('/cancel-sub', async (req, res) => {

  const {subId} = req.query

  try {    
    const subscription = await stripe.subscriptions.cancel(subId);
  } catch (err){
    res.json({
      result: err
    })
  }

  res.json({
    result: '200'
  })

});

app.use(express.static(path.join(__dirname, '/')));

var engines = require('consolidate');

app.set('views', __dirname);
app.engine('html', engines.mustache);
app.set('view engine', 'html');




app.listen(PORT, 
	() => console.log("Server is running..."));
