const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const MongoDao = require('./mongodao');
const cors = require('cors');


//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});


//Import Routes
const productsRoute = require('./routes/products');

app.use('/products', productsRoute);





//listen

app.listen(4000);