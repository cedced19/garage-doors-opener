require('angular'); /*global angular*/
require('angular-route');
require('ng-notie');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

var app = angular.module('GarageDoorsOpenerClock', ['ngNotie', 'ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
    // Route configuration
    $routeProvider
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/clocks/', {
            templateUrl: '/views/clocks.html',
            controller: 'ClocksCtrl'
        })
        .when('/keys/', {
            templateUrl: '/views/keys.html',
            controller: 'KeysCtrl'
        })
        .when('/keys/new', {
            templateUrl: '/views/new-keys.html',
            controller: 'NewKeysCtrl'
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
app.run(['$rootScope', '$location', 'notie', '$http', function ($rootScope, $location, notie, $http) {
    $rootScope.$error = function () { // Send message error
        notie.alert(3, 'Une erreur est survenue.', 3);
        $http.get('/authenticated').success(function (data) {
            if (data.status) {
                $rootScope.user = data.user;
            } else {
                $rootScope.user = false;
                $location.path('/login');
            }
        });
    }
    $rootScope.$goTo = function (path) {
        $location.path(path);
    }

    $http.get('/authenticated').success(function (data) {
        if (data.status) {
            $rootScope.user = data.user;
        } else {
            $rootScope.user = false;
            $location.path('/login');
        }
    });
}]);
app.controller('HomeCtrl', require('./controllers/home.js'));
app.controller('ClocksCtrl', require('./controllers/clocks.js'));
app.controller('KeysCtrl', require('./controllers/keys.js'));
app.controller('NewKeysCtrl', require('./controllers/new-keys.js'));
app.controller('LoginCtrl', require('./controllers/login.js'));