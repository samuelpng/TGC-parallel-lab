const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const landingRoutes = require('./routes/landing')
const postersRoutes = require('./routes/posters')

app.use('/', landingRoutes)
app.use('/posters', postersRoutes)

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

async function main() {
  
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});