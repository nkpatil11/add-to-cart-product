'use strict';
var nodemailer = require('nodemailer');
var config = require('./environment');

var sesTransport = require('nodemailer-ses-transport');

var hbs_options = {
    viewEngine: {
        extname: '.html',
        layoutsDir: '../email_templates/'
    },
    viewPath: '../email_templates/',
    extName: '.html'
};

var options = {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    serviceUrl: config.serviceUrl
};

module.exports.transpoter = function () {
    var client = nodemailer.createTransport(sesTransport(options));
    return client;
};