'use strict';
var express = require('express');
var controller = require('./transaction.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/list', auth.isAuthorized(), function (req, res) {
    controller.getAllTransactions(req)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            res.status(error.status).send(error);
        });
});

module.exports = router;