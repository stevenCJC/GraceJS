define(['BL/Blink/var/__id'], function(__id) {
		
	function _id(element) {
		if(!element)return;
		var id=parseInt(element.getAttribute('_id'));
		if(id) return id;
		else{
			id=__id++;
			element.setAttribute('_id',id);
			return id;
		}
	}
	return _id;
});
	