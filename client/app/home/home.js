'use strict';
angular.module('mynewtask').config(function ($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/home', {
            url: '/home',
            templateUrl: 'app/home/home.html',
            controller: 'mainController',
            authenticate: true
        });
});