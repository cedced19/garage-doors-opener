module.exports = ['$scope', '$http', '$rootScope', 'notie', '$location', function ($scope, $http, $rootScope, notie, $location) {
    var date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    $scope.date = date;
    $scope.name = 'Clé temporaire';

    function generateNumber() {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 30; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    $scope.addKeys = function () {
        $http.post('/api/keys/', {
            id: generateNumber(),
            date: $scope.date.getTime(),
            name: $scope.name
        }).success(function () {
            notie.alert(1, 'La clé a été ajoutée avec succès.', 3);
            $location.path('/keys/');
        }).error($rootScope.$error);
    };
}];