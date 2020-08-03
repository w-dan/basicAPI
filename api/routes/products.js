const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products' + doc._id
                    }
                }
            })
        };

        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// POST
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json ({
            message: 'Handling POST requests to /products',
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products' + result._id
                }
            }
        });
    }) // stores in database
    .catch(err => { 
        console.log(err);
        res.status(500).json({ error: err })
    });
});


// GET
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'GET_ALL_PRODUCTS',
                    url: 'http://localhost:3000/products'
                }
            });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}); // responses in then/catch logs because asynchronous


// PATCH
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});


// DELETE
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: { name: 'String', price: 'Number' }
            },
        });
    })

    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;