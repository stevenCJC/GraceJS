define(['g','./Class','./Events','./aspect','./attribute'],function(g,Class,Events,aspect,attribute){

	var base=Class(function Base(constructor, properties){
		  
		this.constructor(config);
	
		// Automatically register `this._onChangeAttr` method as
		// a `change:attr` event handler.
		parseEventsFromInstance(this, this.attrs);
		
	},{
		__type__:'BASE',
	  Implements: [Events, aspect, attribute],
	
	  destroy: function() {
		
		this.off();
	
		for (var p in this) {
		  if (this.hasOwnProperty(p)) {
			delete this[p];
		  }
		}
	
		// Destroy should be called only once, generate a fake destroy after called
		// https://github.com/aralejs/widget/issues/50
		this.destroy = function() {};
	  }
	});
	
	
	function parseEventsFromInstance(host, attrs) {
	  for (var attr in attrs) {
		if (attrs.hasOwnProperty(attr)) {
		  var m = '_onChange' + ucfirst(attr);
		  if (host[m]) {
			host.on('change:' + attr, host[m]);
		  }
		}
	  }
	}
	
	function ucfirst(str) {
	  return str.charAt(0).toUpperCase() + str.substring(1);
	}
	
	g.Base=base;
	
	return base;
});