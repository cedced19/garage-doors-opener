module.exports = ['$scope', '$http', '$rootScope', 'notie', '$location', function ($scope, $http, $rootScope, notie) {
    $scope.clocks = {
        morning: {
            hour: 6,
            minute: 30,
            nextTrigger: new Date()
        },
        night: {
            hour: 20,
            minute: 0,
            nextTrigger: new Date()
        }
    };
    $scope.up = true;
 

    $http.get('/api/clock').success(function (data) {

    }).error($rootScope.$error);

    $scope.updateMeta = function (name) {
        $http.put('/api/clocks/' + name, {
                hours: $scope.clocks[name].hours,
                minutes: $scope.clocks[name].minutes
        }).success(function (data) {
            notie.alert(1, 'La minuterie a bien été modifié.', 3);
            $scope.clocks[name].nextTrigger=data.nextTrigger;
        }).error($rootScope.$error);
    };
}];