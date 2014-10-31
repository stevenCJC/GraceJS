define([], function() {
		
	//深克隆函数
	function JSONClone(item) { 
		return JSON.parse(JSON.stringify(item));
	}
	return JSONClone;
});
