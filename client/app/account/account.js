'use strict';
angular.module('mynewtask').config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'app/account/login/login.html',
            controller: 'SignupLoginCtrl',
            authenticate: false
        }).when('/settings', {
            templateUrl: 'app/account/settings/settings.html',
            controller: 'SettingsCtrl',
            authenticate: true
        });
});