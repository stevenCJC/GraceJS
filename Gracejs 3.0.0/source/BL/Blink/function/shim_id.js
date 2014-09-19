define(['BL/Blink/dom/var/_attrCache','BL/Blink/dom/var/_propCache','BL/Blink/dom/var/_initedCache','BL/Blink/event/var/handlers'], function(_attrCache,_propCache,_initedCache,handlers) {
	function shim_id(element) {
		if(!element)return;
		var id=parseInt(element.getAttribute('_id'));
		var keys=Object.keys;
		if((id)&&
			(!_attrCache[id]||!keys(_attrCache[id]).length)&&
			(!_propCache[id]||!keys(_propCache[id]).length)&&
			(!_initedCache[id]||!_initedCache[id].length)&&
			(!handlers[id]||!handlers[id].length)) 
				element.removeAttribute('_id');
	}
	return shim_id;
});