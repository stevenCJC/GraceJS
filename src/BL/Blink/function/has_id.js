define([], function() {
		
	function has_id(element){
		if(!element)return;
		return parseInt(element.getAttribute('_id'));
	}
	return has_id;
});
	