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
		var tail=path.pop();
		var x;
		//转到路径
		while(x=path.shift()){
			if(force)
				obj=obj[x]=obj[x]||{};
			else if(!obj[x]&&path.length) return false;
		}
		////如果是扩展模式，kvp为path指向的扩展元素，无需直接赋值
		if(tail){
			obj[tail]=kvp;
			return kvp;
		}else{
			if(typeof obj=='array')
				for(var y in kvp) obj.push(kvp[y]);
			else if(typeof obj=='object')
				for(var y in kvp) obj[y]=kvp[y];
			return obj;
		}
		
	}
	
return setObjByPath;
});