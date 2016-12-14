const ipc = require('electron').ipcRenderer;

angular.module('toolbar', ['ngMaterial'])

.controller('AppCtrl', function($scope) {
	$scope.newWindow = function(){
		createWindow();
	}

	function createWindow () {
	  ipc.send('createWebWindow');
	}
});

