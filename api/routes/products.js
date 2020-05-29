const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs =>{
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    });

    product
    .save()
    .then(result => {
        res.status(201).json ({
            message: 'Handling POST requests to /products',
            createdProduct: result
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
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json(doc);
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
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({ error: err });
    });
});


// DELETE
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;