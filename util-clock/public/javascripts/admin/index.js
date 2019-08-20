require('angular'); /*global angular*/
require('angular-route');
require('ng-notie');


var app = angular.module('GarageDoorsOpenerClock', ['ngNotie', 'ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
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
        .otherwise({
            redirectTo: '/'
        });
}]);
app.run(['$rootScope', '$location', 'notie', function ($rootScope, $location,  notie) {
    $rootScope.$error = function () { // Send message error
        notie.alert(3, 'Une erreur est survenue.', 3);
    }
    $rootScope.$goTo = function (path) {
        $location.path(path);
    }
}]);
app.controller('HomeCtrl', require('./controllers/home.js'));
app.controller('ClocksCtrl', require('./controllers/clocks.js'));
app.controller('KeysCtrl', require('./controllers/keys.js'));
app.controller('NewKeysCtrl', require('./controllers/new-keys.js'));