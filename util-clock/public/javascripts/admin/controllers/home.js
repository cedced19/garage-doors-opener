module.exports = ['$scope', '$http', '$rootScope', 'notie', function ($scope, $http, $rootScope, notie) {

    $http.get('/api/garage/status').success(function(data) {
        $scope.closed = data.closed
    }).error($rootScope.$error);

    $scope.garageInterface = function (interface) {
        notie.confirm('Êtes-vous sûre de vouloir faire cette action ?', 'Oui', 'Annuler', function() {
            $http.get('/api/garage/' + interface).success(function(data) {
                notie.alert(1, 'L\'action a été réalisé avec succès.', 3);
                if (data.hasOwnProperty('closed')) {
                    $scope.closed = data.closed
                }
            }).error($rootScope.$error);
        });
    };
}]
