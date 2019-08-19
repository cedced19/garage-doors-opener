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

    function getNextTrigger (name) {
        var h = $scope.clocks[name].hour;
        var m = $scope.clocks[name].minute;
        if (name == 'morning') {
            var date = new Date();
            if (date.getHours() > h) {
                date.setDate(date.getDate()+1);
            }
            date.setHours(Number(h));
            date.setMinutes(Number(m));
            $scope.clocks[name].nextTrigger = date;
        } 
        if (name == 'night') {
            var tmpDate = new Date();
            if (tmpDate.getHours() > h) {
                tmpDate.setDate(date.getDate()+1);
            }
            tmpDate.setHours(Number(h));
            tmpDate.setMinutes(Number(m));
            // compare
            $scope.clocks[name].nextTrigger = tmpDate;
            
        }
    }

    function updateNextTriggers() {
        for (i in $scope.clocks) {
            getNextTrigger(i);
        }
    } 

    $http.get('/api/clock').success(function (data) {
        updateNextTriggers();
    }).error($rootScope.$error);

    updateNextTriggers();

    $scope.updateClock = function (name) {
        var h = $scope.clocks[name].hour;
        var m = $scope.clocks[name].minute;
        getNextTrigger(name);
        $http.put('/api/clocks/' + name, {
                hour: h,
                minute: m
        }).success(function (data) {
            notie.alert(1, 'La minuterie a bien été modifié.', 3);
            $scope.clocks[name].nextTrigger=data.nextTrigger;
        }).error($rootScope.$error);
    };
}];