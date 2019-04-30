'use strict';
angular.module('mynewtask', ['ngRoute', 'ui.bootstrap', 'toaster', 'ngStorage', 'ngCookies'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .otherwise('/login');
        $httpProvider.interceptors.push('authInterceptor');
    }).factory('authInterceptor', function ($q, $cookieStore, $location) {
        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                if ($cookieStore.get('token')) {
                    config.headers.Authorization = $cookieStore.get('token');
                }
                return config;
            },
            // Intercept 401s and redirect you to login
            responseError: function (response) {
                if (response.status === 401) {
                    $location.path('/login');
                    // remove any stale tokens
                    $cookieStore.remove('token');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    }).run(function ($rootScope, $location, $cookieStore) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var loggedIn = $cookieStore.get('token');
            if (next.authenticate && !loggedIn) {
                $location.path('/login');
                return;
            }
        });
    });