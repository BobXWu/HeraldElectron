// const ipc = require('electron').ipcRenderer;

// angular.module('toolbar', ['ngMaterial'])

// .controller('AppCtrl', function($scope) {
// 	$scope.newWindow = function(){
// 		createWindow();
// 	}

// 	function createWindow () {
// 	  ipc.send('createWebWindow');
// 	}
// });

var app = angular.module('app',['ngMaterial', 'ngRoute']);

app.config(function($httpProvider){  

   $httpProvider.defaults.transformRequest = function(obj){  
     var str = [];  
     for(var p in obj){  
       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
     }  
     return str.join("&");  
   }  

   $httpProvider.defaults.headers.post = {  
        'Content-Type': 'application/x-www-form-urlencoded'  
   }  

});

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/pe',{
			templateUrl: 'content/pe.html',
			controller: 'pe_ctrl'})
		.when('/gpa',{
			templateUrl: 'content/gpa.html',
			controller: 'gpa_ctrl'})
		.when('tice', {
			templateUrl: 'content/tice.html',
			controller: 'tice_ctrl'
		})
		.when('lecture', {
			templateUrl: 'content/lecture.html',
			controller: 'lecture_ctrl'
		})
		.when('card', {
			templateUrl: 'content/card.html',
			controller: 'card_ctrl'
		})
		.when('nic', {
			templateUrl: 'content/nic.html',
			controller: 'nic_ctrl'
		})
		.when('library', {
			templateUrl: 'content/library.html',
			controller: 'library_ctrl'
		})
		.when('jwc', {
			templateUrl: 'content/jwc.html',
			controller: 'jwc_ctrl'
		})
		.when('schoolbus', {
			templateUrl: 'content/schoolbus.html',
			controller: 'schoolbus_ctrl'
		})
		.when('phylab', {
			templateUrl: 'content/phylab.html',
			controller: 'phylab_ctrl'
		})
		.when('exam', {
			templateUrl: 'content/exam.html',
			controller: 'exam_ctrl'
		});
}]);

app.controller('pe_ctrl', function($scope, $http){

	var uuid = "87291a4edb373dd82a5f11bdd5f81ab30cb83445";

	// get_uuid();
	get_pe();

	function get_uuid(){

		var user = '213141166';
		var password = 'wuxiaobao1166'
		
		$http({
			method: 'post',
			url: 'http://www.heraldstudio.com/uc/auth',
			data: {
				'user': user,
				'password': password,
				'appid': '34cc6df78cfa7cd457284e4fc377559e'
			}
		}).success( function(data){
			console.log(data);
			uuid = data;
		});
	}

	

	function get_pe(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/pe',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  
			$scope.pe_count = data.content;
			$scope.left_days = data.remain;
		});
	}


});

// app.controller('srtp_ctrl', function($scope, $http){

// 	function get_srtp(){
// 		$http({
// 			method:'post', 
// 			url:'http://www.heraldstudio.com/api/srtp',
// 			data:{
// 				"uuid": uuid
// 			}
// 		}).success( function(data){  
// 			$scope.srtp = data
// 		});
// 	}
// });