define(['BL/Blink/_/var/slice','./unique'], function(slice,unique) {
	
	function _shimNodes(nodes,obj){
		if(!nodes)
			return;
		var i=0;
		if(nodes.nodeType)
				obj[obj.length++]=nodes;
		else if(nodes.length){
			for(var i=0,len=nodes.length;i<len;i++) {
				obj[obj.length++]=nodes[i];
			}
		}
	}
	return _shimNodes;
});