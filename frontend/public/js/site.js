
angular.module('sapphireJS', [ 'ngMaterial' ])

.controller('sapphireDemo', function ($scope, $timeout, $mdSidenav, $log) {
	$scope.toggleLeft = function () {
		$mdSidenav('left').toggle()
	};

	$scope.close = function () {
		$mdSidenav('left').close()
	};

});
