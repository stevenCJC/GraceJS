//替换path里面的变量，如{id}
	function fixPath(path,obj){
		return path.replace(/(^\s*)|(\s*$)/g,'').replace(/\{.*?\}/ig,function(m){
			return obj[m.replace(/\{|\}/ig,'')];
		});
	}