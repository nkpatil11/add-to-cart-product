'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    user_id: String,
    email_address: String,
    quantity: Number,
    price: Number,
    status: String,
    created_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Transaction', TransactionSchema);
