'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: String,
    price: Number,
    image: String,
    created_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', ProductSchema);
