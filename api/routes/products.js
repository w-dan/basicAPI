const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json ({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json ({
        message: 'Handling POST requests to /products'
    });
});


// GET
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if(id === 'special') {
        res.status(200).json ({
            message: 'You discovered the special ID',
            id: id,
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});          // variable name like productId in get


// PATCH
router.patch('/:productId', (req, res, next) => {
    res.status(200).json ({
        message: 'Product updated',
    });
});


// DELETE
router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        messsage: 'Product deleted',
    });
});

module.exports = router;