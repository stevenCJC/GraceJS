define([], function() {
	//根据路径返回对象
	//path		数据路径
	//obj		基础对象
	//create	是否进行创建路径，如果否，返回null
	//需考虑末尾/的情况
	function getObjByPath(path,obj){
		path=path||'';
		path=path.replace(/(^\s*)|(\s*$)/g,'');
		if(!path) return obj;
		var tmp;
		if(path.indexOf('/')>-1){
			path=path.split('/');
			var x;
			while(x=path.shift()){
				if(typeof obj[x]=='array'||typeof obj[x]=='object'){
					obj=obj[x];
					if(path.length>0&&typeof obj!='object'&&typeof obj[x]!='array') 
						return;
				}else return;
			}
			return obj;
		}else return obj[path];
	}
	
return getObjByPath;
});