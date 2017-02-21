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
			uuid = data;
		});
}