define([], function() {
	//根据路径返回对象
	//path		数据路径
	//obj		基础对象
	//create	是否进行创建路径，如果否，返回null
	//需考虑末尾/的情况
	function delObjByPath(path,obj){
		if(typeof(obj)!='object'&&typeof(obj)!='array') throw new Error('The second arguments need to be an Object or an Array');
		path=path.replace(/(^\s*)|(\s*$)/g,'');
		path=path.split('/');
		var p=path.pop();
		var x,tail;
		//转到路径
		while(x=path.shift()){
			if(typeof(obj)=='object'||typeof(obj)=='array') obj=obj[x];
			else if(!obj) return;
			else return;
		}
		
		var t=obj[p];
		delete obj[p];
		
		return t;
	}
	
return delObjByPath;
});