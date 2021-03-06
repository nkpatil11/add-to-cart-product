'use strict';
module.exports = function (app) {

    app.use('/api/users', require('./api/user'));
    app.use('/auth', require('./auth'));
    app.use('/api/products', require('./api/product'));
    app.use('/api/transactions', require('./api/transaction'));

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./client/index.html');
    });
};