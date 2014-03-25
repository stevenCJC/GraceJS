
	function cleanUpNode(node, kill){
		//kill it before it lays eggs!
		if(kill && node.dispatchEvent){
			var e = $.Event('destroy', {bubbles:false});
			node.dispatchEvent(e);
		}
		var id = _id(node);
		if(id && handlers[id]){
			for(var key in handlers[id])
				node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
			delete handlers[id];
		}
	}
	
	$.cleanUpContent = function(node, itself, kill){
		if(!node) return;
		//cleanup children
		var elems = $('[_id]',node).elems;
		if(elems.length > 0) 
			for(var i=0,len=elems.length;i<len;i++){
				cleanUpNode(elems[i], kill);
			}
		//cleanUp this node
		if(itself) cleanUpNode(node, kill);
	}
	