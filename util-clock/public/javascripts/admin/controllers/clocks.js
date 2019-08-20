module.exports = ['$scope', '$http', '$rootScope', 'notie', function ($scope, $http, $rootScope, notie) {
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
        },
        up: true
    };

    $scope.sunset = new Date();

    function getNextTrigger(name, obj) {
        var h = obj[name].hour;
        var m = obj[name].minute;
        if (name == 'morning') {
            var date = new Date();
            if (date.getHours() > h) {
                date.setDate(date.getDate() + 1);
            }
            date.setHours(Number(h));
            date.setMinutes(Number(m));
            obj[name].nextTrigger = date;
        }
        if (name == 'night') {
            var tmpDate = new Date();
            if (tmpDate.getHours() > h) {
                tmpDate.setDate(date.getDate() + 1);
            }
            tmpDate.setHours(Number(h));
            tmpDate.setMinutes(Number(m));
            if ($scope.sunset.getTime() < tmpDate.getTime()) {
                obj[name].nextTrigger = tmpDate;
            } else {
                obj[name].nextTrigger = $scope.sunset;
            }
        }
    }

    function updateNextTriggers(obj) {
        getNextTrigger('morning', obj);
        getNextTrigger('night', obj);
    }

    $http.get('/api/clocks').success(function (data) {
        $scope.clocks = data.clocks;
        $scope.sunset = new Date(data.sunset);
        updateNextTriggers(data.clocks);
    }).error(function () {
        $rootScope.$error()
        updateNextTriggers($scope.clocks);
    });


    $scope.updateClock = function (name) {
        var h = $scope.clocks[name].hour;
        var m = $scope.clocks[name].minute;
        getNextTrigger(name, $scope.clocks);
        $http.put('/api/clocks/' + name, {
            hour: h,
            minute: m
        }).success(function (data) {
            notie.alert(1, 'La minuterie a bien été modifié.', 3);
        }).error($rootScope.$error);
    };

    $scope.toggleSystem = function (stat) {
        $http.put('/api/clocks/toggle', {
            up: stat
        }).success(function (data) {
            $scope.clocks.up = data.up;
            notie.alert(1, 'La minuterie a bien été ' + (data.up ? 'activée.': 'stoppée.'), 3);
        }).error($rootScope.$error);

    }
}];