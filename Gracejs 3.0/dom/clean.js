define(['$','./var/_attrCache','./var/_propCache','./var/_initedCache','blk/function/r_id','blk/function/has_id','BL/event/function/makeEvent','BL/_/main'], function ($,_attrCache,_propCache,_initedCache,r_id,has_id,makeEvent) {

	function cleanUpNode(node, kill){
		//kill it before it lays eggs!
		if(kill && node.dispatchEvent){
			var e = makeEvent('destroy', {bubbles:false});
			node.dispatchEvent(e);
		}
		
		var id = has_id(node);
		
		if(id){
			if(handlers[id]){
				for(var key in handlers[id])
					node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
				delete handlers[id];
			}
			
			if(_attrCache[id]) delete _attrCache[id];
			if(_propCache[id]) delete _propCache[id];
			if(_initedCache[id]){
				$(node).distroy();
				delete _initedCache[id];
			}
			r_id(node);
		}
	}
	
	
	$.clean = function(node, itself, kill){
		if(!node) return;
		//cleanup children
		var elems = $('[_id]',node);
		if(elems.length > 0) 
			for(var i=0,len=elems.length;i<len;i++){
				cleanUpNode(elems[i], kill);
			}
		//cleanUp this node
		if(itself) cleanUpNode(node, kill);
	}
	return $;
});