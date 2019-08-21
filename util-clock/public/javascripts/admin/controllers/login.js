module.exports = ['$scope', '$location', '$http', '$rootScope',  function($scope, $location, $http, $rootScope) {

    if ($rootScope.user) {
        $location.path('/');
    }

    $scope.login = function () {
        $http.post('/login', {
            email: $scope.email,
            password: $scope.password
        }).success(function(data) {
            $rootScope.user = data;
            $location.path('/');
        }).error($rootScope.$error);
    };
}];