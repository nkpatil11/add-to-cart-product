// set up ======================================================================
var express = require('express');
var app = express(); // create our app w/ express
var config = require('./server/config/environment');
var port = config.server_port; // set the port
var morgan = require('morgan');
var bodyParser = require('body-parser');
var common = require('./server/common');
var mongoose = require('mongoose');

mongoose.connect(config.mongo.url);

if (config.seedDB) { require('./server/config/seed/seed'); }

// configuration ===============================================================
app.use(express.static('./client'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// routes ======================================================================
app.use(common.initialize);
require('./server/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);