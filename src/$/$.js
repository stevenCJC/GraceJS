define([], function() {
	var $=function(){
		if(arguments.length==1)
			return new Core(arguments[0]);
		else if(arguments.length==2)
			return new Core(arguments[0],arguments[1]);
		else if(arguments.length==3)
			return new Core(arguments[0],arguments[1],arguments[2]);
	}
	$.fn = Core.prototype = {
		constructor: Core,
		selector: _selector,
		oldElement: undefined
	};
	return $;
});