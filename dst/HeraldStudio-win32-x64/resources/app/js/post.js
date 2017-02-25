var uuid;
getUUID('213141166','');

//测试函数
function test(){
	//getSrtpPost();//checked
	//getTermPost();//checked
	// getCoursePost();//checked
	// getCurriculumPost();//checked
	// getPePost();//checked
	// getLecturePost();//checked
	// getCardPost(); //checked
	// getNicPost();//checked
	// getLibraryPost();
	// getExamPost();//checked
	// getTicePost();//checked
	//getLectureNoticePost();//checked
	//logoutPost();//checked
	//connectSeuWlanPost('213142654','15l9JK');//checked
	getJwcInfoPost();
}

function getUUID(user,password){
	$.post('http://www.heraldstudio.com/uc/auth', {
		'user': user,
		'password': password,
		'appid': '34cc6df78cfa7cd457284e4fc377559e'
	}, function(data, textStatus, xhr) {
				uuid=data;
				console.log(uuid);
	})
	.error(function(data, textStatus, xhr) {
	
	});

}

//检查uuid是否合法
//检查uuid是否合法
function checkUUIDPost(){
	$.post('http://www.heraldstudio.com/uc/check',{
		'uuid':uuid,
		'appid': '34cc6df78cfa7cd457284e4fc377559e'
	},function(data,textStatus,xhr){
		console.log(data);
	});
}


//退出登录
function logoutPost(){
	$.post('http://www.heraldstudio.com/uc/deauth', {
		'uuid':uuid
	}, function(data, textStatus, xhr) {
		console.log(data);
		if(data=='OK'){
				
		}
	})
	.error(function(data,textStatus,xhr) {
	
	});
}

//获取Srtp学分
function getSrtpPost(){
	$.post('http://www.heraldstudio.com/api/srtp', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		console.log( 'srtp'+data );
		dealSrtpReturn(data);
	})
	.error(function(data, textStatus, xhr) {
		
	});
}

//获取学期列表
function getTermPost(){
	$.post('http://www.heraldstudio.com/api/term', {
		'uuid': uuid
	}, function(data, textStatus, xhr) {
		console.log('学期列表/n'+data);
		
	})
	.error(function(data, textStatus, xhr) {
	
	});
}

//课程查询
function getCoursePost(){
	$.post('http://www.heraldstudio.com/api/sidebar', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		console.log('课程查询/n/r'+data);
		
	})
	.error(function(data, textStatus, xhr) {
	
	});
}

//课程表查询
function getCurriculumPost(){
	$.post('http://www.heraldstudio.com/api/curriculum', {
		uuid: uuid}, 
	function(data, textStatus, xhr) {
		console.log('课程表查询'+data);
		dealCurriculumReturn(data);
	})
	.error(function(data, textStatus, xhr) {
		
	});
}

//查询GPA
function getGPAPost(){
	$.post('http://www.heraldstudio.com/api/gpa', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		console.log('GPA'+data);
		dealGPAReturn(data);
	})
	.error(function(data, textStatus, xhr) {
		
	});
}

//查询跑操
function getPePost(){
	$.post('http://www.heraldstudio.com/api/pe', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		console.log('跑操/n'+data);
		dealPeReturn(data);
	})
	.error(function(data, textStatus, xhr) {
	
	});
}


//人文讲座查询
function getLecturePost(){
	$.post('http://www.heraldstudio.com/api/lecture', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		console.log('人文讲座/n'+data);
		dealLectureReturn(data);
	})
	.error(function(data, textStatus, xhr) {
	
	});
}

//人文讲座预告
function getLectureNoticePost(){
	$.post('http://www.heraldstudio.com/wechat2/lecture', {

	}, function(data, textStatus, xhr) {
		console.log('人文讲座预告/n'+data);
		dealLectureNoticeReturn(data);
	})
	.error(function(data, textStatus, xhr) {

	});
}

//查询一卡通余额
function getCardPost(){
	$.post('http://www.heraldstudio.com/api/card', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		console.log('一卡通余额/n'+data);
		dealCardReturn();
	})
	.error(function(data, textStatus, xhr) {
		
	});
}

//校园网用户状态查询
function getNicPost(){
	$.post('http://www.heraldstudio.com/api/nic', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		console.log('校园网/n'+data);
		dealNicReturn();
	})
	.error(function(data, textStatus, xhr) {
		
	});
}

//图书馆借阅图书查询
function getLibraryPost(){
	$.post('http://www.heraldstudio.com/api/library', {
		uuid: 'uuid'
	}, function(data, textStatus, xhr) {
		console.log('图书馆借阅查询/n'+data);
		dealLibraryReturn(data);
		
	})
	.error(function(data, textStatus, xhr) {
		
	});
}

//图书馆续借
function renewBookPost(barcode){
	$.post('http://www.heraldstudio.com/api/renew', {
		barcode: barcode
	}, function(data, textStatus, xhr) {

	})
	.error(function(data, textStatus, xhr) {
	
	});
}

//教务处信息
function getJwcInfoPost(){
	$.post('http://www.heraldstudio.com/ap/jwc', {
		'uuid': uuid
	}, function(data, textStatus, xhr) {
		console.log('教务处信息/n/r'+data);
		dealJwcInfoReturn(data);
	})
	.error(function(data, textStatus, xhr){
		console.log('获取教务处信息失败');
	});
}

//考试安排
function getExamPost(){
	$.post('http://www.heraldstudio.com/api/exam', {
		'uuid': uuid
	}, function(data, textStatus, xhr) {
		console.log('考试安排'+data);
		dealExamReturn(data);
	})
	.error(function(data, textStatus, xhr) {
	
	});
}

//体侧信息
function getTicePost(){
	$.post('http://www.heraldstudio.com/api/tice', {
		'uuid': uuid
	}, function(data, textStatus, xhr) {
		console.log('体侧/n'+data);
		dealTiceReturn(data);
	})
	.error(function(data, textStatus, xhr) {
	
	});
}

//获取个人信息
function getUserInfoPost(){
	$.post('http://www.heraldstudio.com/api/user', {

	}, function(data, textStatus, xhr) {
		console.log("个人信息"+data);	
	})
	.error(function() {
	});
}

//seu-wlan自动登录
function connectSeuWlanPost(username,password){

	$.post('http://w.seu.edu.cn/index.php/index/login', {
		'username': username,
		'password': base64encode(password),
		'enablemacauth': '0'
	}, function(data, textStatus, xhr) {
		console.log(data);

	})
	.error(function(data, textStatus, xhr) {
		
	});
}

//seu-wlan退出登录
function disconnectSeuWlanPost(){
	$.post('http://w.seu.edu.cn/index.php/index/logout', {

	}, function(data, textStatus, xhr) {
		console.log(data);
	})
	.error(function(data, textStatus, xhr) {
		
	});
}