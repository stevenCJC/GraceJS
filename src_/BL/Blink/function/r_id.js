define([], function() {
	function r_id(element) {
		if(!element)return;
		var id=parseInt(element.getAttribute('_id'))
		element.removeAttribute('_id');
		return id;
	}
	return r_id;
});
	