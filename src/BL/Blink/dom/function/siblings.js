define([], function () {
function siblings(nodes, element) {
		var elems = [];
		if (nodes == undefined)
			return elems;
		
		for (; nodes; nodes = nodes.nextSibling) {
			if (nodes.nodeType == 1 && nodes !== element) {
				elems.push(nodes);
			}
		}
		return elems;
	}

return siblings;
});