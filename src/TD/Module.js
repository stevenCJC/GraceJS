define(['TD/var/assert'], function(assert) {
	
	
	
	function Module(){
		this.modules={};
	}
	
	
	Module.prototype={
		
		constructor:Module,
		
		text:function(moduleName,callback){
			callback(assert, _);
		},
		
		sub:function(moduleName,callback){
			
		},
		
		pub:function(moduleName,data){
			
		},
		
	};
	
	
	
	
	
})