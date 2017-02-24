const ipc = require('electron').ipcRenderer;

var login_app = angular.module("login_app", ["ngMaterial", "ipCookie"])

login_app.config(function($httpProvider){  

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

login_app.controller("login_ctrl", function($scope, $http, $window){

	// if( localStorage.uuid ){
	// 	ipc.send("createMainWindow");
	// }

	$scope.login_click = function(){
		//检查cardnum 和 password合法性
		console.log("click");
		get_uuid($scope.cardnum, $scope.password);
	}
	
	$scope.close_click = function(){
		ipc.send("closeLoginWindow");
	}

	function get_uuid(user, password){
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
			if( localStorage.uuid ){
				localStorage.clear();
			}

			localStorage.uuid = data;
			// $window.location.href = "index.html";
			ipc.send("createMainWindow");
			
		}).error(function(data,status) {
			console.log(data);
			console.log(status);
			if(status == "401"){

			}
		});
	}
});

