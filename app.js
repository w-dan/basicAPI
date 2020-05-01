const express = require('express');
const app = express();
const morgan = require('morgan');   // log


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// if we make it past these 2 middlewares none of the routes
// were suited to handle the incoming request, hence we can handle
// error catching all requests that make is past these 2 middlewares

app.use((req, res, next) => {
    const error = Error('Not found');
    error.status = 404;
    next(error);            // forwards error
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
}); // handles errors thrown from anywhere in the application

module.exports = app;