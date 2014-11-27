define(['./remove'], function (remove) {
	function _unbind(elems,event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			remove(elems[i], event, callback);
		}
	};
	return _unbind;
});