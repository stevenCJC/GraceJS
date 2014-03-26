define([], function() {
		
	function _id(element) {
		var id=element.getAttribute('_id');
		if(id) return id;
		else{
			id=__id++;
			element.setAttribute('_id',id);
			return id;
		}
	}
	return _id;
});
	