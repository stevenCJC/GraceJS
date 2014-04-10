define(['oop/package/var/currentPackage'], function(currentPackage) {
	
	
	function Class(options,cons,behavior,func){
		
		currentPackage.classes[options]=cons;
		for(var x in func) cons.prototype[x]=func[x];
		
	}
	
	
	
	return Class;
});

