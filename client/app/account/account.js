'use strict';
angular.module('mynewtask').config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'app/account/login/login.html',
            controller: 'SignupLoginCtrl',
            authenticate: false
        })
        .when('/forgot', {
            templateUrl: 'app/account/settings/forgot_password.html',
            controller: 'ForgotPasswordCtrl',
            authenticate: false
        })
        .when('/ref/:ref/reset/:token', {
            templateUrl: 'app/account/settings/reset_password.html',
            controller: 'ResetCtrl',
            authenticate: false
        }).when('/settings', {
            templateUrl: 'app/account/settings/settings.html',
            controller: 'SettingsCtrl',
            authenticate: true
        });
});