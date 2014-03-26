
	
	 
	

	
	


	function _undelegate(elems,selector, event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			remove(elems[i], event, callback, selector);
		}
		return this;
	}

	
	
	
	
	
	
	 

	


			