define([], function() {
	//根据路径返回对象
	//path		数据路径
	//obj		基础对象
	//create	是否进行创建路径，如果否，返回null
	//需考虑末尾/的情况
	function setObjByPath(path,obj,kvp,force){
		if(typeof(obj)!='object'&&typeof(obj)!='array') throw new Error('The second arguments need to be an Object or an Array');
		path=path.replace(/(^\s*)|(\s*$)/g,'');
		path=path.split('/');
		var x,tail;
		//转到路径
		while(x=path.shift()){
			if(force)
				obj=obj[x]=obj[x]||{};
			else if(!obj[x]&&path.length) return false;
		}
		//判断父元素
		if(typeof obj=='array')
			obj.push(kvp);
		else if(typeof obj=='object')
			for(var x in kvp) obj[x]=kvp[x];
		return obj;
	}
	
return setObjByPath;
});