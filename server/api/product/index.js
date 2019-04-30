'use strict';
var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

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