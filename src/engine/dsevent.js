define(["dataset/DSEvent"], function(DSEvent) {
	/*ExcludeStart*/
	if(window.dsevent) return window.dsevent;
	else {
	/*ExcludeEnd*/
		var dsevent=new DSEvent();
		/*ExcludeStart*/
		window.dsevent=dsevent
		return dsevent;
	}
	/*ExcludeEnd*/
});

