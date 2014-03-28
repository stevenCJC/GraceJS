define(['BL/Blink/_/var/slice','./unique'], function(slice,unique) {
	
	function _shimNodes(nodes,obj){
		if(!nodes)
			return;
		var i=0;
		if(nodes.nodeType)
			if(obj.elems.indexOf(nodes)==-1) {
				obj.elems[obj.length++]=nodes;
				obj[obj.length-1]=nodes;
			}
		if(nodes.elems){
			obj.elems=nodes.elems;
			obj.length=nodes.length;
			while(i<obj.length){
				obj[i]=obj.elems[i];
			}
		}else if(nodes.length){
			for(var i=0,len=nodes.length;i<len;i++) 
				if(obj.elems.indexOf(nodes[i])==-1){
					obj.elems.push(nodes[i]);
					obj.length++;
					obj[obj.length-1]=nodes[i];
				}
		}else for(var x in nodes) 
			if(nodes[x]&&nodes[x].nodeType&&(obj.elems.indexOf(nodes[x])==-1)){
				obj.elems[obj.length++]=nodes[x];
				obj[obj.length-1]=nodes[x];
			}
	}
	return _shimNodes;
});