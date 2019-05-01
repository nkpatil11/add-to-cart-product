'use strict';
angular.module('mynewtask').service('Auth', function ($http, $cookieStore, $localStorage, $q) {

    var currentUser = {};

    var login = function (user) {
        var defer = $q.defer();
        $http.post('/auth', user).success(function (data) {
            $cookieStore.put('token', data.token);
            $cookieStore.put('currentUser', data.currentUser);
            $localStorage.currentUser = data.currentUser;
            defer.resolve(data);
        }).error(function (err) {
            logout();
            defer.reject(err);
        });
        return defer.promise;
    };

    var getCurrentUser = function () {
        if ($cookieStore.get('currentUser')) {
            return $localStorage.currentUser;
        }
    };

    var isLoggedIn = function () {
        if ($cookieStore.get('token')) {
            return true;
        } else {
            return false;
        }
    };

    var logout = function () {
        $cookieStore.remove('token');
        $cookieStore.remove('currentUser');
        currentUser = {};
    };

    return {
        login: login,
        getCurrentUser: getCurrentUser,
        isLoggedIn: isLoggedIn,
        logout: logout
    };
});