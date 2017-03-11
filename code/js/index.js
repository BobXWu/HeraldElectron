// const ipc = require('electron').ipcRenderer;
// const remote = require('electron').remote;
// const shell = require('electron').shell;

var app = angular.module('app',['ngMaterial', 'ui.router', 'ngAnimate']);
var uuid = localStorage.uuid;
var memory_cache = {};

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
			return 'content/' + $stateParams.name + '.html';
		}
	});
});

app.controller('main_ctrl', function($scope, $http, $location, $mdToast){

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

	$scope.$on('refresh_failed', function(){
		$mdToast.show(
			$mdToast.simple()
				.textContent("刷新失败")
				.position( "bottom" )
				.hideDelay(150000)
		);
	})

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
		if( memory_cache.pe ){
			$scope.pe = memory_cache.pe;
		}
		else{
			$scope.pe_loading = true;
			get_pe();
		}

	}

	function set_nic(){
		if( memory_cache.nic ){
			$scope.nic = memory_cache.nic;
		}
		else{
			$scope.nic_loading = true;
			get_nic();	
		}

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
			memory_cache.pe = data;
			localStorage.pe = JSON.stringify(data);
		}).error( function(data, status){
			if( memory_cache.pe ){
				console.log("error memory_cache");
				$scope.pe = memory_cache.pe;
			}
			else if( localStorage.pe ){
				console.log("error localStorage");
				var pe = JSON.parse( localStorage.pe );
				$scope.pe = pe;
				memory_cache.pe = pe;
			}

			$scope.pe_loading = false;
			$scope.$emit('refresh_failed');
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
			memory_cache.nic = data;
			localStorage.nic = JSON.stringify( data );
		}).error( function(data, status){
			if( memory_cache.nic ){
				console.log("error memory_cache");
				$scope.nic = memory_cache.nic.content;
			}
			else if( localStorage.nic ){
				console.log("error localStorage");
				var nic = JSON.parse( localStorage.nic );
				$scope.nic = nic.content;
				memory_cache.nic = nic;
			}

			$scope.nic_loading = false;
			$scope.$emit('refresh_failed');
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
		$scope.loading = true;
		get_huodong();
	});

	function set_huodong(){
		if( memory_cache.huodong ){
			console.log("memory_cache");
			$scope.content = memory_cache.huodong.content;
		}
		else if( localStorage.huodong ){
			console.log("localStorage");
			var huodong = JSON.parse( localStorage.huodong );
			$scope.content = huodong.content;
			memory_cache.huodong = huodong;
		}else{
			console.log("request");
			$scope.loading = true;
			get_huodong();
		}
	}

	function get_huodong(){
		$http({
			method:'get', 
			url: 'http://www.heraldstudio.com/herald/api/v1/huodong/get'
		}).success( function(data){
			
			for( var i in data.content ){
				if( if_limited(data.content[i].pic_url) ){
					data.content[i].pic_url = 'http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl='
												+ data.content[i].pic_url;
				}
			}
			$scope.content = data.content;
			
			$timeout(function () {
				$scope.loading = false;
			}, 500);

			memory_cache.huodong = data;
			localStorage.huodong = JSON.stringify( data );
		}).error( function(data, status){
			if( memory_cache.huodong ){
				console.log("error memory_cache");
				$scope.content = memory_cache.huodong.content;
			}
			else if( localStorage.huodong ){
				console.log("error localStorage");
				var huodong = JSON.parse( localStorage.huodong );
				$scope.content = huodong.content;
				memory_cache.huodong = huodong;
			}

			$timeout(function () {
					$scope.loading = false;
			}, 500);

			$scope.$emit('refresh_failed');
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
		$scope.loading = true;
		get_phylab();
	});


	function set_phylab(){
		if( memory_cache.phylab ){
			$scope.content = memory_cache.phylab.content;
		}
		else if( localStorage.phylab ){
			var phylab = JSON.parse( localStorage.phylab );
			$scope.content = phylab.content;
		}else{
			$scope.loading = true;	
			get_phylab();
		}
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
			localStorage.phylab = JSON.stringify( data );
		}).error( function(data, status){
			if( memory_cache.phylab ){
				console.log("error memory_cache");
				$scope.content = memory_cache.phylab.content;
			}
			else if( localStorage.phylab ){
				console.log("error localStorage");
				var phylab = JSON.parse( localStorage.phylab );
				$scope.content = phylab.content;
				memory_cache.phylab = phylab;
			}

			$scope.loading = false;
			$scope.$emit('refresh_failed');
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
		if( memory_cache.jwc ){
			$scope.content = memory_cache.jwc.content;
		}else{
			$scope.loading = true;	
			get_jwc();
		}
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
			localStorage.jwc = JSON.stringify(data);
		}).error( function(data, status){
			if( memory_cache.jwc ){
				console.log("error memory_cache");
				$scope.content = memory_cache.jwc.content;
			}
			else if( localStorage.jwc ){
				console.log("error localStorage");
				var jwc = JSON.parse( localStorage.jwc );
				$scope.content = jwc.content;
				memory_cache.jwc = jwc;
			}

			$scope.loading = false;
			$scope.$emit('refresh_failed');
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
		$scope.loading = true;
		get_srtp();
	});

	function set_srtp(){
		if( memory_cache.srtp ){
			$scope.srtp = memory_cache.srtp.content;
			$scope.srtp = memory_cache.srtp.main_info;
		}
		if(localStorage.srtp){
			var srtp = JSON.parse( localStorage.srtp );
			memory_cache.srtp = srtp;
			$scope.content = srtp.content;
			$scope.main_info = srtp.main_info;
		}else{
			$scope.loading = true;
			get_srtp();
		}
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
			
			// data.expires = new Date().getTime() + 86400000;
			memory_cache.srtp = data;
			localStorage.srtp = JSON.stringify(data);
		}).error(function(data, status){
			if( memory_cache.srtp ){
				console.log("error memory_cache");
				$scope.content = memory_cache.srtp.content;
			}
			else if( localStorage.srtp ){
				console.log("error localStorage");
				var srtp = JSON.parse( localStorage.srtp );
				$scope.content = srtp.content;
				memory_cache.srtp = srtp;
			}

			$scope.loading = false;
			$scope.$emit('refresh_failed');

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
		if( memory_cache.lecture ){
			$scope.content = memory_cache.lecture.content.detial;
		}
		else if( localStorage.lecture ){
			var lecture = JSON.parse( localStorage.lecture );
			$scope.content = lecture.content.detial;
			memory_cache.lecture = lecture;
		}else{
			$scope.loading = true;
			get_lecture();	
		}
	}

	function set_lecture_notice(){
		if( memory_cache.lecture_notice ){
			$scope.notice_content = memory_cache.lecture_notice.content.detial;
		}else{
			$scope.notice_loading = true;
			get_lecture_notice();
		}

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
			memory_cache.lecture = data;
			localStorage.lecture = JSON.stringify( data );
		}).error(function(data, status){
			if( memory_cache.lecture ){
				console.log("error memory_cache");
				$scope.content = memory_cache.lecture.content.detial;
			}
			else if( localStorage.lecture ){
				console.log("error localStorage");
				var lecture = JSON.parse( localStorage.lecture );
				$scope.content = lecture.content.detial;
				memory_cache.lecture = lecture;
			}
			$scope.loading = false;
			$scope.$emit('refresh_failed');
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
			memory_cache.lecture_notice = data;
			localStorage.lecture_notice = JSON.stringify( data );
		}).error(function(data, status){
			if( memory_cache.lecture_notice ){
				console.log("error memory_cache");
				$scope.content = memory_cache.lecture_notice.content;
			}
			else if( localStorage.lecture_notice ){
				console.log("error localStorage");
				var lecture_notice = JSON.parse( localStorage.lecture_notice );
				$scope.content = lecture_notice.content;
				memory_cache.lecture_notice = lecture_notice;
			}

			$scope.notice_loading = false;
			$scope.$emit('refresh_failed');
		});
	}
});

app.controller('gpa_ctrl', function($scope, $http){
	
	set_gpa();

	$scope.$on("refresh", function(){
		$scope.loading = true;
		get_gpa();
	});

	function set_gpa(){
		if( memory_cache.gpa ){
			$scope.content = memory_cache.gpa.content;
		}
		if( localStorage.gpa ){
			var gpa = JSON.parse( localStorage.gpa );
			$scope.content = gpa.content;
			memory_cache.gpa = gpa;
		}else{
			$scope.loading = true;
			get_gpa();	
		}
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
					"main_info": $scope.main_info
			};

			memory_cache.gpa = tmp;
			localStorage.gpa = JSON.stringify( tmp );
		}).error(function(data, status){
			if( memory_cache.gpa ){
				console.log("error memory_cache");
				$scope.content = memory_cache.gpa.content;
			}
			else if( localStorage.gpa ){
				console.log("error localStorage");
				var gpa = JSON.parse( localStorage.gpa );
				$scope.content = gpa.content;
				memory_cache.gpa = gpa;
			}

			$scope.loading = false;
			$scope.$emit('refresh_failed');
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
		if( memory_cache.card ){
			$scope.content = memory_cache.card.content;
		}
		else{
			$scope.loading = true;
			get_card();	
		}

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
			memory_cache.card = data;
			localStorage.card = JSON.stringify( data );
		}).error(function(data, status){
			if( memory_cache.card ){
				console.log("error memory_cache");
				$scope.content = memory_cache.card.content;
			}
			else if( localStorage.card ){
				console.log("error localStorage");
				var card = JSON.parse( localStorage.card );
				$scope.content = card.content;
				memory_cache.card = card;
			}

			$scope.loading = false;
			$scope.$emit('refresh_failed');
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
		if( memory_cache.schoolbus ){
			$scope.content = memory_cache.schoolbus.content;
		}
		else if( localStorage.schoolbus ){
			var schoolbus = JSON.parse( localStorage.schoolbus );
			memory_cache.schoolbus = schoolbus;
			$scope.content = schoolbus.content;
		}else{
			$scope.loading = true;
			get_schoolbus();	
		}


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
			memory_cache.schoolbus = data;
			localStorage.schoolbus = JSON.stringify( data );
		}).error(function(data, status){
			if( memory_cache.schoolbus ){
				console.log("error memory_cache");
				$scope.content = memory_cache.schoolbus.content;
			}
			else if( localStorage.schoolbus ){
				console.log("error localStorage");
				var schoolbus = JSON.parse( localStorage.schoolbus );
				$scope.content = schoolbus.content;
				memory_cache.schoolbus = schoolbus;
			}

			$scope.loading = false;
			$scope.$emit('refresh_failed');
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
		if( memory_cache.exam ){
			$scope.content = memory_cache.exam.content;
		}
		else if( localStorage.exam ){
			var exam = JSON.parse( localStorage.exam );
			$scope.content = exam.content;
		}
		else{
			$scope.loading = true;
			get_exam();
		}
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
			memory_cache.exam = data;
			localStorage.exam = JSON.stringify( data );
		}).error( function(data, status){
			if( memory_cache.exam ){
				console.log("error memory_cache");
				$scope.content = memory_cache.exam.content;
			}
			else if( localStorage.exam ){
				console.log("error localStorage");
				var exam = JSON.parse( localStorage.exam );
				$scope.content = exam.content;
				memory_cache.exam = exam;
			}

			$scope.loading = false;
			$scope.$emit('refresh_failed');
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
		if( memory_cache.library ){
			$scope.content = memory_cache.library.content
		}
		else if( localStorage.library ){
			var library = JSON.parse( localStorage.library );
			memory_cache.library = library;
			$scope.content = library.content;
		}
		else{
			$scope.loading = true;
			get_library();
		}

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
		}).error( function(data, status){
			if( memory_cache.library ){
				console.log("error memory_cache");
				$scope.content = memory_cache.library.content;
			}
			else if( localStorage.library ){
				console.log("error localStorage");
				var library = JSON.parse( localStorage.library );
				$scope.content = library.content;
				memory_cache.library = library;
			}

			$scope.loading = false;
			$scope.$emit('refresh_failed');
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