// const ipc = require('electron').ipcRenderer;
const uuid = "87291a4edb373dd82a5f11bdd5f81ab30cb83445";

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
		.when('/tice', {
			templateUrl: 'content/tice.html',
			controller: 'tice_ctrl'})
		.when('/srtp', {
			templateUrl: 'content/srtp.html',
			controller: 'srtp_ctrl'})
		.when('/lecture', {
			templateUrl: 'content/lecture.html',
			controller: 'lecture_ctrl'})
		.when('/card', {
			templateUrl: 'content/card.html',
			controller: 'card_ctrl'})
		.when('/nic', {
			templateUrl: 'content/nic.html',
			controller: 'nic_ctrl'})
		.when('/library', {
			templateUrl: 'content/library.html',
			controller: 'library_ctrl'})
		.when('/jwc', {
			templateUrl: 'content/jwc.html',
			controller: 'jwc_ctrl'})
		.when('/schoolbus', {
			templateUrl: 'content/schoolbus.html',
			controller: 'schoolbus_ctrl'})
		.when('/phylab', {
			templateUrl: 'content/phylab.html',
			controller: 'phylab_ctrl'})
		.when('/exam', {
			templateUrl: 'content/exam.html',
			controller: 'exam_ctrl'});
}]);


app.controller('pe_ctrl', function($scope, $http){

	get_pe();

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

app.controller('phylab_ctrl', function($scope, $http){
	get_phylab();

	function get_phylab(){
		$http({
			method: 'post',
			url: 'http://www.heraldstudio.com/api/phylab',
			data: {
				'uuid':uuid
			}
		}).success( function(data){
			$scope.content = data.content;
		});
	}

})

app.controller('jwc_ctrl', function($scope, $http){
	get_jwc();

	function get_jwc(){
		$http({
			method: 'post',
			url: 'http://www.heraldstudio.com/api/jwc',
			data: {
				'uuid':uuid
			}
		}).success( function(data){
			$scope.content = data.content;
		});
	}

})

app.controller('srtp_ctrl', function($scope, $http){
	get_srtp();

	function get_srtp(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/srtp',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  
			$scope.content = data;
		});
	}
});

app.controller('lecture_ctrl', function($scope, $http){
	get_lecture();

	function get_lecture(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/lecture',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  

		});
	}
});

app.controller('gpa_ctrl', function($scope, $http){
	get_gpa();

	function get_gpa(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/gpa',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  

		});
	}
});

app.controller('tice_ctrl', function($scope, $http){
	get_tice();

	function get_tice(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/tice',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  

		});
	}
});

app.controller('card_ctrl', function($scope, $http){
	get_card();

	function get_card(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/card',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  

		});
	}
});

app.controller('nic_ctrl', function($scope, $http){
	get_nic();

	function get_nic(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/nic',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  

		});
	}
});

app.controller('schoolbus_ctrl', function($scope, $http){
	get_schoolbus();

	function get_schoolbus(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/schoolbus',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			$scope.content = data.content;
		});
	}
});

app.controller('exam_ctrl', function($scope, $http){
	get_exam();

	function get_exam(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/exam',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  

		});
	}
});