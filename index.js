const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
})
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)
const csrf = require('csurf')

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(express.urlencoded({
  extended: false
}));

//setup sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(flash())
//Register Flash middleware
app.use(function(req, res, next) {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next()
})

//enable csrf
app.use(csrf());
//share the csrf with hbs files
app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken();
  next()
})

app.use(function(err, req,res,next){
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash('error_messages', 'The form has expired. Please try again')
    res.redirect('back')
  } else {
    next()
  }
})

const landingRoutes = require('./routes/landing')
const postersRoutes = require('./routes/posters')
const usersRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary')
const cartRoutes = require('./routes/carts');
const { checkIfAuthenticated } = require("./middlewares");

app.use('/', landingRoutes)
app.use('/posters', postersRoutes)
app.use('/users', usersRoutes)
app.use('/cloudinary', cloudinaryRoutes)
app.use('/cart', checkIfAuthenticated, cartRoutes)

// const landingRoutes = require('./routes/landing')

// const productRoutes = require('./routes/products')

// app.use('/', landingRoutes)

// app.use('/products', productRoutes)

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);


//share user data with hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user
  next()
})

async function main() {
  
}

main();

app.listen(8000, () => {
  console.log("Server has started");
});