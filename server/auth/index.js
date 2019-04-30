'use strict';
var express = require('express');
var controller = require('./auth.controller');
var router = express.Router();

router.post('/', function (req, res) {
    controller.authUser(req).then(function (result) {
        if (result.status === 200) {
            res.status(200).send(result);
        } else if (result.status === 401 || result.status === 400) {
            res.status(result.status).send(result);
        } else {
            res.status(500).send(result);
        }
    }).catch(function (error) {
        if (error.status === 400) {
            res.status(error.status).send(error);
        } else {
            res.status(500).send(error);
        }

    });
});

module.exports = router;