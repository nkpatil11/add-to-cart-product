'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email_address: { type: String, lowercase: true },
    hashedPassword: String,
    salt: String,
    resetPasswordTokenSalt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    created_date: { type: Date, default: Date.now },
  });

UserSchema.path('email_address')
.validate(function (value, respond) {
  var self = this;
  this.constructor.findOne({ email_address: value }, function (err, user) {
    if (err) throw err;
    if (user) {
      if (self.id === user.id) return respond(true);
      return respond(false);
    }
    respond(true);
  });
}, 'The specified email address is already in use.');

module.exports = mongoose.model('User', UserSchema);
