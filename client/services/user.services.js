'use strict';
angular.module('mynewtask').factory('UserService', function ($http) {

    var createUser = function (data) {
        return $http.post('/api/users/save', data);
    };

    var changePassword = function (passwords) {
        return $http.post('/api/users/password/change', passwords);
    };

    return {
        createUser: createUser,
        changePassword: changePassword
    };
});