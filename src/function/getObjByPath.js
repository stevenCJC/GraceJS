define([], function() {
	//根据路径返回对象
	//path		数据路径
	//obj		基础对象
	//create	是否进行创建路径，如果否，返回null
	function getObjByPath(path,obj,create){
		path=path.replace(/(^\s*)|(\s*$)/g,'');
		var tmp;
		if(path.indexOf('/')>-1){
			path=path.split('/');
			var x;
			while(x=path.shift()){
				if(typeof obj[x]!='undefined'){
					obj=obj[x];
					if(path.length>0&&typeof obj!='object') 
						throw new Error('The '+x+' related to the node of Object is not an Object type');
				}else if(create){//如果子路径元素不存在，并且需要创建
					if(path.length){//路径中遇到undefined
						obj=obj[x]={};//创建路径
					}else {//终端
						obj[x]={};//创建路径
						return obj[x];
					}
				//如果子路径不存在，并且不需要创建
				}else return;
			}
			return obj;
		}else if(typeof obj[path]!='undefined'){
				return obj[path];
			}else if(create){
				obj[path]={};
				return obj[path];
			}else return;
	}
	
return getObjByPath;
});