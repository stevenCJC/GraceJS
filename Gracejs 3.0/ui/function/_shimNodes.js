define(['./unique'], function(unique) {
	
	function _shimNodes(nodes,obj){
		if(!nodes)
			return;
		var i=0;
		if(nodes.nodeType)
			return obj[obj.length++]=nodes;
		for(var i=0,len=nodes.length;i<len;i++) {
			obj[obj.length++]=nodes[i];
		}
	}
	return _shimNodes;
});