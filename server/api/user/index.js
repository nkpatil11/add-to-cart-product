'use strict';
var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.post('/save', function (req, res) {
    controller.saveUser(req)
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
            res.status(409).send(error);
        });
});

router.post('/password/change', auth.isAuthenticated(), function (req, res) {
    controller.changePassword(req).then(function (data) {
        res.json(data);
    }).catch(function (error) {
        res.statusCode(error.status).send(error);
    });
});

router.post('/forgot', function (req, res) {
    controller.forgotPassword(req).then(function (data) {
        res.json(data);
    }).catch(function (error) {
        res.statusCode(error.status).send(error);
    });
});

router.get('/ref/:ref/verify/:token', function (req, res) {
    controller.verifyToken(req).then(function (data) {
        res.json(data);
    }).catch(function (error) {
        res.statusCode(error.status).send(error);
    });
});

router.post('/ref/:ref/reset/:token', function (req, res) {
    controller.resetPassword(req).then(function (data) {
        res.json(data);
    }).catch(function (error) {
        res.statusCode(error.status).send(error);
    });
});

module.exports = router;