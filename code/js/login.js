const ipc = require('electron').ipcRenderer;

var login_app = angular.module("login_app", ["ngMaterial", "ngMessages"])

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

login_app.controller("login_ctrl", function($scope, $http, $window, $mdToast){
	
	$scope.input = {};

	//已经登录过
	if( localStorage.uuid ){
		console.log("已经登录过");
		$scope.has_loggedin = true;
		$scope.input.last_cardnum = localStorage.cardnum;
	}

	$scope.login_click = function(){
		//检查cardnum 和 password合法性
		$scope.loading = true;
		get_uuid($scope.input.cardnum, $scope.input.password);
	}
	
	$scope.confirm_login_click = function(){
		$scope.loading = true;
		ipc.send("createMainWindow");
	}

	$scope.change_user = function(){
		$scope.has_loggedin = false;
	}

	$scope.close_click = function(){
		ipc.send("closeLoginWindow");
	}

	$scope.key_down = function(e){
		if(!$scope.loading  && e.keyCode == 13){
			$scope.login_click();
		}
	}

	$scope.showSimpleToast = function(text) {
		$mdToast.show(
			$mdToast.simple()
				.textContent(text)
				.position( "top" )
				.hideDelay(1500)
		);
	};

	function get_uuid(user, password){
		$http({
			method: 'post',
			url: 'http://www.heraldstudio.com/uc/auth',
			data: {
				'user': user,
				'password': password,
				'appid': '34cc6df78cfa7cd457284e4fc377559e'
			},
			timeout: 3000
		}).success( function(data){

			if( localStorage.uuid && localStorage.uuid != data ){
				localStorage.clear();
			}
			
			localStorage.uuid = data;
			// $window.location.href = "index.html";
			ipc.send("createMainWindow");
		}).error(function(data,status) {
			var text;
			if( status == "401" ){
				text = "一卡通号或密码错误";
			}else if(status == "504" || status == '-1'){
				text = "连接失败，请检查网络后再试";
			}
			
			$scope.loading = false;
			$scope.showSimpleToast(text);
		});
	}
});

