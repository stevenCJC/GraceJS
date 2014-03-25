function _selectorAll(selector, what){
		try{
			return what.querySelectorAll(selector);
		} catch(e){
			return [];
		}
	};
