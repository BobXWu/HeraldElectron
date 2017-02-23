// const ipc = require('electron').ipcRenderer;
const uuid = "87291a4edb373dd82a5f11bdd5f81ab30cb83445";

var app = angular.module('app',['ngMaterial', 'ui.router', 'ngAnimate']);
var contents = {};

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

app.config(function($stateProvider){
	$stateProvider
	.state('home', {
		url: '/:name',
		templateUrl: function($stateParams){
			if ($stateParams.name==""){
				return "content/home.html";
			}
			else{
				return 'content/' + $stateParams.name + '.html';
			}
		}
	});
});

app.controller('home_ctrl', function($scope, $http){

	if(contents.pe){
		$scope.pe = contents.pe;
	}else{
		$scope.pe_loading = true;
		get_pe();
	}

	if(contents.nic){
		$scope.nic = contents.nic.content;
	}else{
		$scope.nic_loading = true;
		get_nic();
	}

	function get_pe(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/pe',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			contents.pe = data;
			$scope.pe = data;
			$scope.pe_loading = false;
		});
	}

	function get_nic(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/nic',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			contents.nic = data;
			$scope.nic = data.content;
			$scope.nic_loading = false;
		});
	}
});

app.controller('huodong_ctrl', function($scope, $http, $timeout){
	if(contents.huodong){
		$scope.content = contents.huodong;
		$timeout(function () {
				$scope.loading = false;
			}, 100);
	}else{
		get_huodong();
	}


	function get_huodong(){
		$http({
			method:'get', 
			url: 'http://www.heraldstudio.com/herald/api/v1/huodong/get'
		}).success( function(data){
			$scope.content = data.content;
			contents.huodong = data.content;

			$timeout(function () {
				$scope.loading = false;
				}, 100);
		});
	}

	
});

app.controller('phylab_ctrl', function($scope, $http){
	
	if(contents.phylab){
		$scope.content = contents.phylab.content;
	}else{
		$scope.loading = true;
		get_phylab();
	}

	function get_phylab(){
		$http({
			method: 'post',
			url: 'http://www.heraldstudio.com/api/phylab',
			data: {
				'uuid':uuid
			}
		}).success( function(data){
			contents.phylab = data;
			$scope.content = data.content;
			$scope.loading = false;
		});
	}

});

app.controller('jwc_ctrl', function($scope, $http){

	if(contents.jwc){
		$scope.content = contents.jwc.content;
	}else{
		$scope.loading = true;
		get_jwc();
	}

	function get_jwc(){
		$http({
			method: 'post',
			url: 'http://www.heraldstudio.com/api/jwc',
			data: {
				'uuid':uuid
			}
		}).success( function(data){
			contents.jwc = data;
			$scope.content = data.content;
			$scope.loading = false;
		});
	}

});

app.controller('srtp_ctrl', function($scope, $http){
	if(contents.srtp){
		$scope.main_info = contents.srtp.main_info;
		$scope.content = contents.srtp.content;
	}else{
		$scope.loading = true;
		get_srtp();
	}

	function get_srtp(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/srtp',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			$scope.main_info = data.content.shift();
			$scope.content = data.content;
			$scope.loading = false;	

			contents.srtp = {};
			contents.srtp.main_info = $scope.main_info;
			contents.srtp.content = $scope.content;
		});
	}
});

app.controller('lecture_ctrl', function($scope, $http){
	if(contents.lecture){
		$scope.content = contents.lecture;
	}else{
		$scope.loading = true;
		get_lecture();
	}

	function get_lecture(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/lecture',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			$scope.content = data.content.detial;
			$scope.loading = false;
			contents.lecture = $scope.content;
		});
	}
});

app.controller('gpa_ctrl', function($scope, $http){
	if(contents.gpa){
		$scope.main_info = contents.gpa.main_info;
		$scope.content = contents.gpa.content;
	}else{
		$scope.loading = true;
		get_gpa();
	}


	function get_gpa(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/gpa',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			$scope.main_info = data.content.shift();
			var content={}, semester;

			for(var i in data.content){
				semester = data.content[i].semester;
				if( !content[semester])
					content[semester] = [];
				content[semester].push(data.content[i]);
			}

			$scope.content = content;
			$scope.loading = false;
			contents.gpa = {};
			contents.gpa.content = content;
			contents.gpa.main_info = content;
		});
	}
});


app.controller('card_ctrl', function($scope, $http){
	if(contents.card){
		$scope.content = contents.card;
	}else{
		$scope.loading = true;
		get_card();
	}

	function get_card(){
		$http({
			method:'post',
			url:'http://www.heraldstudio.com/api/card',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			$scope.content = data.content;
			$scope.loading = false;
			contents.card = data.content;
		});
	}
});



app.controller('schoolbus_ctrl', function($scope, $http){
	if(contents.schoolbus){
		$scope.content = contents.schoolbus;
	}else{
		$scope.loading = true;
		get_schoolbus();
	}

	function get_schoolbus(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/schoolbus',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			$scope.content = data.content;
			$scope.loading = false;
			contents.schoolbus = data.content;
		});
	}
});

app.controller('exam_ctrl', function($scope, $http){
	if(contents.exam){
		$scope.content = contents.exam;
	}else{
		$scope.loading = true;
		get_exam();
	}

	function get_exam(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/exam',
			data:{
				"uuid": uuid
			}
		}).success( function(data){  
			$scope.content = data;
			$scope.loading = false;
			contents.exam = data;
		});
	}
});

app.controller('library_ctrl', function($scope, $http, $mdToast){
	if(contents.library){
		$scope.content = contents.library;
	}else{
		$scope.loading = true;
		get_library();
	}

	function get_library(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/library',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			
			$scope.content = data.content;
			$scope.loading = false;
			contents.library = data.content;
		});
	}

})