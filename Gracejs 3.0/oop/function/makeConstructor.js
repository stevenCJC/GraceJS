define(['g'],
function (g) {

	function makeConstructor(name, obj) {
		window._tmp_obj_ = obj;
		window.eval('window._tmp_constructor_=(function(obj){' +
			'return function ' + name + '(){\n obj.apply(this,arguments);}' +
			'})(window._tmp_obj_)');
		var constructor = window._tmp_constructor_;
		delete window._tmp_constructor_;
		delete window._tmp_constructor_;
		delete window._tmp_obj_;
		return constructor;
	}
	
	return makeConstructor;
	
});
