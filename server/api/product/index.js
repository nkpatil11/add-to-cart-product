'use strict';
var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');
var config = require('../../config/environment');
var Transaction = require('../transaction/transaction.model');
var Q = require('q');
var router = express.Router();

var keySecret = config.keySecret;
var stripe = require("stripe")(keySecret);

router.post('/paynow', auth.isAuthorized(), function (req, res) {
    var defer = Q.defer();
    stripe.customers.create({
        email: req.body.email,
        source: req.body.id
    }).then(customer => stripe.charges.create({
            amount: req.body.options.amount,
            description: req.body.options.description,
            currency: "usd",
            customer: customer.id
    })).then(function (charge) {

    req.body.user_id = req.user.userId;
    req.body.price = req.body.options.amount/100;
    req.body.quantity = req.body.options.description.split(' ')[0];
    req.body.email_address = req.body.email;
    req.body.status = charge.status;
    var transaction = new Transaction(req.body);
    transaction.save(function (err, result) {
        if (err) {
            console.error(err);
            var error = new Error('An Internal Error Has Occured');
            defer.reject(error);
        } else {
            defer.resolve(result);
        }
    });
    res.json(charge);
    });
});

router.get('/', auth.isAuthorized(), function (req, res) {
    controller.getAllProducts(req)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            res.status(error.status).send(error);
        });
});

module.exports = router;