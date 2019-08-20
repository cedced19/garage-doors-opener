module.exports = ['$scope', '$http', '$rootScope', 'notie', '$location', function ($scope, $http, $rootScope, notie, $location) {
    $scope.keys=[];
    $http.get('/api/keys').success(function(data) {
        $scope.keys = data;
    }).error($rootScope.$error);

    $scope.url = '';
    $scope.share = function (id) {
        $scope.url = location.protocol + '//' + location.host + '/hosts/' + id + '/';
    }

    $scope.removeKey = function (id) {
        notie.confirm('Êtes-vous sûre de vouloir supprimer cette clé ?', 'Oui', 'Annuler', function() {
            $http.delete('/api/keys/' + id).success(function() {
                notie.alert(1, 'La clé a été supprimé avec succès.', 3);
                $location.path('/');
            }).error($rootScope.$error);
        });
    };
}];