
	function _shimNodes(nodes,obj){
		if(!nodes)
			return;
		if(nodes.nodeType)
			return obj.elems[obj.length++]=nodes;
		if(nodes.elems){
			obj.elems=nodes.elems;
			obj.length=nodes.length;
		}else if(nodes.length){
			nodes.constructor==Array&&(obj.elems=obj.elems.concat(nodes));
			obj.elems=slice.call(nodes);
			//for(var i=0,len=nodes.length;i<len;i++) obj.elems.push(nodes[i]);
			obj.length=nodes.length;
		}else for(var x in nodes) nodes[x]&&nodes[x].nodeType&&(obj.elems[obj.length++]=nodes[x]);
	}