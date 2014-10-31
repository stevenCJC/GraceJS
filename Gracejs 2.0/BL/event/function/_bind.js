define(['./add'], function (add) {
	function _bind(elems,event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			add(elems[i], event, callback);
		}
	};
	return _bind;
});