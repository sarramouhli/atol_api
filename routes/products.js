const express = require('express');

const router = express.Router();
const mongodb = require('mongodb');


const MongoDao = require('../mongodao')

require('dotenv/config');


let instance = new MongoDao();

//Routes

// get all products
router.get('/', function (req, res) {

    instance.readCollection(`${process.env.DB_PRODUCTS}`, function (items) {
        res.send(items);
    });
})

// find product by id
router.get('/:_id', function (req, res) {
    instance.printDocument((`${process.env.DB_PRODUCTS}`), req.params._id, function (items) {
        res.send(items);
    });
});


// insert one element
router.post('/', function (req, res) {
    // Sending request to create a data
    instance.insertDocument((`${process.env.DB_PRODUCTS}`), req.body, function (insertedElement) {
        res.send(insertedElement);
    });
});

router.put('/:_id', function (req, res) {
    // updating a data by it's ID and new value
    instance.updateDocument((`${process.env.DB_PRODUCTS}`),
        req.params._id, req.body,
        function (insertedElement) {
            res.send(insertedElement);
        }
    )
})

router.delete('/:_id', function (req, res) {
    // deleting a data by it's ID
    instance.deleteDocument((`${process.env.DB_PRODUCTS}`),
        req.params._id,
        function () {
            res.send(req.params._id)
        }
    )
})





module.exports = router;