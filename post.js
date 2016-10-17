var uuid;
getUUID('213141166','wuxiaobao69');

function test(){
	getSrtpPost();
	getTermPost();
}

function getUUID(user,password){
	$.post('http://www.heraldstudio.com/uc/auth', {
		'user': user,
		'password': password,
		'appid': '34cc6df78cfa7cd457284e4fc377559e'
		}, 
		function(data, textStatus, xhr) {
			if(xhr.status==200){
				uuid=data;
				console.log(uuid);
			}
	});

}


//退出登录
function logout(){
	$.post('http://www.heraldstudio.com/uc/deauth', {
		uuid:uuid
	}, 
		function(data, textStatus, xhr) {
			if(xhr.status=200){

			}else{

			}
	});
}

//获取Srtp学分
function getSrtpPost(){
	$.post('http://www.heraldstudio.com/uc/srtp', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		if(xhr.status==200){
			data['content'];
		}
	});
}

//获取学期列表
function getTermPost(){
	$.post('http://www.heraldstudio.com/uc/term', {
		param1: 'value1'
	}, function(data, textStatus, xhr) {
		if(xhr.status == 200){

		}
	});
}

//课程查询
function getCoursePost(){
	$.post('http://www.heraldstudio.com/uc/sidebar', {
		uuid: uuid}, 
	function(data, textStatus, xhr) {
		if(xhr.status == 200){

		}
	});
}

//课程表查询
function getCurriculumPost(){
	$.post('http://www.heraldstudio.com/uc/curriculum', {
		uuid: uuid}, 
	function(data, textStatus, xhr) {
		if(xhr.status==200){
			console.log(data);
		}	
	});
}

//查询GPA
function getGPAPost(){
	$.post('http://www.heraldstudio.com/uc/gpa', {
		uuid: uuid
	}, 
		function(data, textStatus, xhr) {
		if(xhr.status==200){
			console.log(data);
		}
	});
}

//查询跑操
function getPePost(){
	$.post('http://www.heraldstudio.com/uc/pe', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		if(xhr.status==200){
			console.log(data);
		}
	});
}

//人文讲座查询
function getLecturePost(){
	$.post('http://www.heraldstudio.com/uc/lecture', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		if(xhr.status==200){
			console.log('人文讲座/n'+data);
		}
	});
}

//人文讲座预告
function getLectureNoticePost(){
	$.post('http://www.heraldstudio.com/wechat2/lecturenotice', {}, 
		function(data, textStatus, xhr) {
			if(xhr.status==200){
				console.log('人文讲座预告/n'+data);
			}
	});
}

//查询一卡通余额
function getCardPost(){
	$.post('http://www.heraldstudio.com/uc/card', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		if(xhr.status==200){
			console.log('一卡通余额/n'+data);
		}
	});
}

//校园网用户状态查询
function getNicPost(){
	$.post('http://www.heraldstudio.com/uc/nic', {
		uuid: uuid
	}, function(data, textStatus, xhr) {
		if(xhr.status==200){
			console.log('校园网/n'+data);
		}
	});
}

//图书馆借阅图书查询
function getLibraryPost(){
	$.post('http://www.heraldstudio.com/uc/library', {
		uuid: 'uuid'
	}, function(data, textStatus, xhr) {
		if(xhr.status==200){
			console.log('图书馆借阅查询/n'+data);
		}
	});
}

//图书馆续借
function renewBookPost(barcode){
	$.post('http://www.heraldstudio.com/uc/renew', {
		barcode: barcode
	}, function(data, textStatus, xhr) {
		if(xhr.status==200){

		}
	});
}

//考试安排
function getExamPost(){
	$.post('http://www.heraldstudio.com/uc/exam', {
		'uuid': uuid
	}, function(data, textStatus, xhr) {
		if(xhr.status==200){

		}
	});
}