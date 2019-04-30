'use strict';
var common = (function () {

    function initialize(req, res, next) {
        res.locals.results = [];
        res.locals.details = [];
        res.locals.errors = [];
        res.locals.validationErrors = [];
        res.locals.customOutcome = {};
        next();
    }

    return {
        initialize: initialize
    };


}());

module.exports = common;