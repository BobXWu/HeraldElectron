// set cookie
function setCookie(key,value,days){
	var exp=new Date();
	exp.setTime(exp.getTime()+days*24*3600*1000);
	document.cookie=key+"="+escape(value)+";expires="+exp.toUTCString();
}

// get cookie
function getCookie(key){
	var pairs=document.cookie.split("; ");
	var n=pairs.length;
	for(var i=0;i<n;i++){
		var tuple=pairs[i].split("=");
		if(tuple[0]==key){
			return unescape(tuple[1]);
		}
	}
	return null;
}

// delete cookie
function delCookie(key){
	var value=getCookie(key);
	if(value!=null){
		var exp=new Date();
		exp.setTime(exp.getTime()-1);
		document.cookie=key+"="+escape(value)+";expires="+exp.toUTCString();
	}
}

// delete all the cookies
function clearCookie(){
	var pairs=document.cookie.split("; ");
	var n=pairs.length;
	for(var i=0;i<n;i++){
		var tuple=pairs[i].split("=");
		delCookie(tuple[0]);
	}
}