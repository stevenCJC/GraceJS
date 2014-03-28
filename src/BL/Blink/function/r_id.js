define([], function() {
	function r_id(element) {
		if(!element)return;
		element.removeAttribute('_id');
	}
	return r_id;
});
	