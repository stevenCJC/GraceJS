define([], function() {
	
	var Config={
		/*
			0 : 非debug状态
			1 ： url请求出错会自动跳转到debug请求debug数据
			2 ： 直接跳转到debug请求debug数据
		*/
		debug:1,
		path:{
			'~':'http://127.0.0.1:8081/testOOP/packages',
		},
	};
	
	return Config;
});


