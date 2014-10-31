define(["BL/main"], function ($) {
	
	function View(options){
		
		
	}
	
	View.prototype={
		constructor:View,
		
		trigger:function(action,data){},
		
		bind:function(state,callback){},
		unbind:function(state){},
		
		// get state , can't set state ;
		state:function(){
			if(arguments.length==2){
				throw new Error("can't set state.");
			}
			
		},
		
		
		
		destroy:function(){
			
		},
		
		
	}
	
	
});