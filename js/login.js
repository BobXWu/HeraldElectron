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

login_app.controller("login_ctrl", function($scope, $http, $location, ipCookie){

	$scope.login_click = function(){
		//检查cardnum 和 password合法性
		console.log("click");
		get_uuid($scope.cardnum, $scope.password);
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
				ipCookie("uuid", data, {"expires": 7});
				location.href = "index.html";
				
			}).error(function(data,status) {
				console.log(data);
				// console.log(header);
				// console.log(config);
				console.log(status);
				if(status == "401"){

				}
			});;
	}
});

