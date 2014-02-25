define(["engine/Engine"], function(Engine) {
	
	/*ExcludeStart*/
	if(window.$$) return window.$$;
	else {
	/*ExcludeEnd*/
		var $$=function(s){
			return new Engine(s);
		}
		$$.fn=Engine.prototype;
		/*ExcludeStart*/
		window.$$=$$;
		return $$;
	}
	/*ExcludeEnd*/
});

