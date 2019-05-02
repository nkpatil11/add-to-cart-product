'use strict';
angular.module('mynewtask').factory('UserService', function ($http) {

    var createUser = function (data) {
        return $http.post('/api/users/save', data);
    };

    var changePassword = function (passwords) {
        return $http.post('/api/users/password/change', passwords);
    };

    var forgotPassword = function (email) {
        return $http.post('/api/users/forgot', email);
    };

    var verifyToken = function (ref, token) {
        return $http.get('/api/users/ref/' + ref + '/verify/' + token);
    };

    var resetPassword = function (ref, token, newPassword) {
        return $http.post('/api/users/ref/' + ref + '/reset/' + token, newPassword);
    };

    return {
        createUser: createUser,
        changePassword: changePassword,
        forgotPassword: forgotPassword,
        verifyToken: verifyToken,
        resetPassword: resetPassword
    };
});