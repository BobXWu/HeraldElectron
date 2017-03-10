const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
// const shell = require('electron').shell;

var app = angular.module('app',['ngMaterial', 'ui.router', 'ngAnimate']);
var uuid = localStorage.uuid;

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
	.state('main', {
		url: '/:name',
		templateUrl: function($stateParams){
			// if ($stateParams.name==""){
				// return "content/home.html";
			// }
			// else{
				console.log("$stateParams.name: "+$stateParams.name);
				return 'content/' + $stateParams.name + '.html';
			
		}
	});
});

app.controller('main_ctrl', function($scope, $http, $location){

	$location.path("home");
	$scope.active_name = "home";
	$scope.items = [
		{
			"name_en": "home",
			"name_zh": "主页"
		},
		{
			"name_en": "huodong",
			"name_zh": "活动"
		},{
			"name_en": "gpa",
			"name_zh": "绩点"
		},{
			"name_en": "srtp",
			"name_zh": "SRTP"
		},{
			"name_en": "lecture",
			"name_zh": "人文讲座"
		},{
			"name_en": "card",
			"name_zh": "一卡通余额"
		},{
			"name_en": "library",
			"name_zh": "图书馆"
		},{
			"name_en": "jwc",
			"name_zh": "教务处"
		},{
			"name_en": "schoolbus",
			"name_zh": "校车"
		},{
			"name_en": "phylab",
			"name_zh": "物理实验课程"
		},{
			"name_en": "exam",
			"name_zh": "考试安排"
		}
	];

	if( !localStorage.cardnum ){
		get_personal_info();
	}

	$scope.change_item = function(index){
		$scope.active_name = $scope.items[index].name_en;
	}

	$scope.close_click = function(){
		console.log("close main window");
		ipc.send('closeMainWindow');
	}

	$scope.mini_click = function(){
		ipc.send('miniMainWindow');
	}

	$scope.max_click = function(){
		ipc.send('maxMainWindow');
	}

	$scope.refresh_click = function(){
		console.log("refresh_click");
		$scope.$broadcast('refresh');
	}

	function get_personal_info(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/user',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			localStorage.cardnum = data.content.cardnum;
		});
	}
});

app.controller('home_ctrl', function($scope, $http){

	set_pe();
	set_nic();

	$scope.$on("refresh", function(){
		console.log("refresh");
		$scope.pe_loading = true;
		$scope.nic_loading = true;
		get_pe();
		get_nic();
	});

	function set_pe(){
		if(localStorage.pe){
			var pe = JSON.parse( localStorage.pe );
			if( new Date().getTime() < pe.expires){
				$scope.pe = pe;
				console.log("没过期");
				return 0;
			}
		}
		console.log("过期");
		$scope.pe_loading = true;
		get_pe();
	}

	function set_nic(){
		if(localStorage.nic){
			var nic = JSON.parse( localStorage.nic );
			if( new Date().getTime() < nic.expires){
				$scope.nic = nic.content;
				console.log("没过期");
				return 0;
			}
		}
		console.log("过期");
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
			$scope.pe = data;
			$scope.pe_loading = false;
			data.expires = new Date().getTime() + 3600000;
			localStorage.pe = JSON.stringify(data);
			console.log( data );
		}).error( function(data, status){
			console.log(status);
			if( status == "401" ){
				// showDialog("您似乎已经修改过密码，请重新登录");
			}
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
			$scope.nic = data.content;
			$scope.nic_loading = false;
			data.expires = new Date().getTime() + 3600000;
			localStorage.nic = JSON.stringify(data);
		}).error( function(data, status){
			console.log(status);
			if( status == "401"){
				// showDialog("您似乎已经修改过密码，请重新登录");
			}
		});
	}

	// function showDialog(text){
	// 	$mdDialog.show(
	// 		$mdDialog.alert()
	// 		.parent(angular.element(document.querySelector('body')))
	// 		.clickOutsideToClose(false)
	// 		.textContent(text)
	// 		.ok('确定')
	// 	).then(function(){
	// 		ipc.send("backToLoginWindow");
	// 	});
	// }
});

//活动
app.controller('huodong_ctrl', function($scope, $http, $timeout){
	
	set_huodong();
	$scope.$on("refresh", function(){
		console.log("huodong  refresh");
		$scope.loading = true;
		get_huodong();
	});

	function set_huodong(){
		if( localStorage.huodong ){
			var huodong = JSON.parse( localStorage.huodong );
			if( new Date().getTime() < huodong.expires){
				$scope.content = huodong.content;
				console.log( $scope.content );
				console.log("没过期");
				return 0;
			}
		}

		console.log("过期");
		$scope.loading = true;
		get_huodong();
	}

	function get_huodong(){
		$http({
			method:'get', 
			url: 'http://www.heraldstudio.com/herald/api/v1/huodong/get'
		}).success( function(data){
			$scope.content = data.content;

			for( var i in data.content ){
				if( if_limited(data.content[i].pic_url) ){
					data.content[i].pic_url = 'http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl='
												+ data.content[i].pic_url;
				}
			}

			$timeout(function () {
				$scope.loading = false;
				}, 100);
			
			data.expires = new Date().getTime() + 3600000;
			localStorage.huodong = JSON.stringify( data );
		});
	}

	function if_limited(url){
		return url.match('http://mmbiz.qpic.cn');
	}

	$scope.open_url = function(url){
		// require('electron').openExternal(url);
		remote.getGlobal('sharedObject').page_url = url;
		ipc.send('createPageWindow');
	}
	

});

app.controller('phylab_ctrl', function($scope, $http){
	
	set_phylab();

	$scope.$on("refresh", function(){
		console.log("phylab  refresh");
		$scope.loading = true;
		get_phylab();
	});

	function set_phylab(){
		if(localStorage.phylab){
			var phylab = JSON.parse( localStorage.phylab );
			if( new Date().getTime() < phylab.expires){
				$scope.content = phylab.content;
				console.log("没过期");
				return 0;
			}
		}

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
			$scope.content = data.content;
			$scope.loading = false;
			data.expires = new Date().getTime() + 86400000;
			localStorage.phylab = JSON.stringify( data );
		});
	}

});

app.controller('jwc_ctrl', function($scope, $http){

	set_jwc();

	$scope.$on("refresh", function(){
		console.log("jwc  refresh");
		$scope.loading = true;
		get_jwc();
	});

	function set_jwc(){
		if(localStorage.jwc){
			var jwc = JSON.parse( localStorage.jwc );
			if( new Date().getTime() < jwc.expires){
				$scope.content = jwc.content;
				console.log("没过期");
				return 0;
			}
		}

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
			
			$scope.content = data.content;
			$scope.loading = false;
			data.expires = new Date().getTime() + 3600000;
			localStorage.jwc = JSON.stringify(data);
		});
	}

	$scope.open_url = function(url){
		remote.getGlobal('sharedObject').page_url = url;
		ipc.send('createPageWindow');
	}

});

app.controller('srtp_ctrl', function($scope, $http){
	
	set_srtp();

	$scope.$on("refresh", function(){
		console.log("srtp  refresh");
		$scope.loading = true;
		get_srtp();
	});

	function set_srtp(){
		if(localStorage.srtp){
			var srtp = JSON.parse( localStorage.srtp );
			if( new Date().getTime() < srtp.expires){
				$scope.content = srtp.content;
				$scope.main_info = srtp.main_info;
				console.log("没过期");
				return 0;
			}
		}

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
			data.main_info = data.content.shift();
			$scope.main_info = data.main_info;
			$scope.content = data.content;
			$scope.loading = false;
			
			data.expires = new Date().getTime() + 86400000;
			localStorage.srtp = JSON.stringify(data);
		});
	}
});

app.controller('lecture_ctrl', function($scope, $http){
	
	set_lecture();
	set_lecture_notice();

	$scope.$on("refresh", function(){
		console.log("lecture  refresh");
		$scope.loading = true;
		$scope.notice_loading = true;
		get_lecture();
		get_lecture_notice();
	});

	function set_lecture(){
		if( localStorage.lecture ){
			var lecture = JSON.parse( localStorage.lecture );
			if( new Date().getTime() < lecture.expires){
				$scope.content = lecture.content.detial;
				console.log("没过期");
				return 0;
			}
		}

		$scope.loading = true;
		get_lecture();
	}

	function set_lecture_notice(){
		if( localStorage.lecture_notice ){
			var lecture_notice = JSON.parse( localStorage.lecture_notice );
			if( new Date().getTime() < lecture_notice.expires){
				$scope.notice_content = lecture_notice.content;
				console.log("没过期");
				return 0;
			}
		}

		$scope.notice_loading = true;
		get_lecture_notice();
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
			data.expires = new Date().getTime() + 360000;
			localStorage.lecture = JSON.stringify( data );
		});
	}

	function get_lecture_notice(){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/wechat2/lecture',
			data:{
				"uuid": uuid
			}
		}).success( function(data){
			$scope.notice_content = data.content;
			$scope.notice_loading = false;
			data.expires = new Date().getTime() + 360000;
			localStorage.lecture_notice = JSON.stringify( data );
		});
	}
});

app.controller('gpa_ctrl', function($scope, $http){
	
	set_gpa();

	$scope.$on("refresh", function(){
		console.log("gpa  refresh");
		$scope.loading = true;
		get_gpa();
	});

	function set_gpa(){
		if( localStorage.gpa ){
			var gpa = JSON.parse( localStorage.gpa );
			if( new Date().getTime() < gpa.expires){
				$scope.content = gpa.content;
				console.log("没过期");
				return 0;
			}
		}

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
			var tmp ={
					"content": content,
					"main_info": $scope.main_info,
					"expires": new Date().getTime() + 86400000
			};

			localStorage.gpa = JSON.stringify( tmp );
		});
	}
});


app.controller('card_ctrl', function($scope, $http){

	set_card();

	$scope.$on("refresh", function(){
		console.log("card  refresh");
		$scope.loading = true;
		get_card();
	});

	function set_card(){
		if( localStorage.card ){
			var card = JSON.parse( localStorage.card );
			if( new Date().getTime() < card.expires){
				$scope.content = card.content;
				console.log("没过期");
				return 0;
			}
		}

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
			data.expires = new Date().getTime() + 3600000;
			localStorage.card = JSON.stringify( data );
		});
	}
});



app.controller('schoolbus_ctrl', function($scope, $http){
	
	set_schoolbus();

	$scope.$on("refresh", function(){
		console.log("schoolbus  refresh");
		$scope.loading = true;
		get_schoolbus();
	});

	function set_schoolbus(){
		if( localStorage.schoolbus ){
			var schoolbus = JSON.parse( localStorage.schoolbus );
			if( new Date().getTime() < schoolbus.expires){
				$scope.content = schoolbus.content;
				console.log("没过期");
				return 0;
			}
		}

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
			data.expires = new Date().getTime() + 2592000000;
			localStorage.schoolbus = JSON.stringify( data );
		});
	}
});

app.controller('exam_ctrl', function($scope, $http){
	
	set_exam();
	$scope.$on("refresh", function(){
		console.log("exam  refresh");
		$scope.loading = true;
		get_exam();
	});

	function set_exam(){
		if( localStorage.exam ){
			var exam = JSON.parse( localStorage.exam );
			if( new Date().getTime() < exam.expires){
				$scope.content = exam.content;
				console.log("没过期");
				return 0;
			}
		}

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
			$scope.content = data.content;
			$scope.loading = false;
			data.expires = new Date().getTime() + 2592000000;
			localStorage.exam = JSON.stringify( data );
		});
	}
});

app.controller('library_ctrl', function($scope, $http){
	
	$scope.input = {};
	set_library();

	$scope.$on("refresh", function(){
		console.log("library  refresh");
		$scope.loading = true;
		get_library();
	});

	function set_library(){
		if( localStorage.library ){
			var library = JSON.parse( localStorage.library );
			if( new Date().getTime() < library.expires){
				$scope.content = library.content;
				console.log("没过期");
				return 0;
			}
		}

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
			data.expires = new Date().getTime() + 3600000;
			localStorage.library = JSON.stringify( data );
		});
	}

	$scope.search_click = function(){
		$scope.search_loading = true;
		var keyword = $scope.input.keyword;
		if(keyword == "")
			return;
		get_search_book(keyword);
	}

	function get_search_book(keyword){
		$http({
			method:'post', 
			url:'http://www.heraldstudio.com/api/search',
			data:{
				"uuid": uuid,
				"book": keyword
			}
		}).success( function(data){
			$scope.search_content = data.content;
			$scope.search_loading = false;
		});
	}

	$scope.key_down = function(e){
		if(e.keyCode == 13){
			$scope.search_click();
		}
	}
})