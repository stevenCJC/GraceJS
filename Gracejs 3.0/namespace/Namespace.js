define(['g'], function(g) {
	
	
	/*
		var g = g.namespace('user');
		var $=g.View.$;   this.$
		var ajax=g.Model.ajax
		
		  
		
		g.set();
		g.get();
		
		
	*/
	
	function Namespace(){
		this.namespace={};
		this.currentSpace='global';
	}
	
	Namespace.prototype={
		constructor:Namespace,
		
		Class:function(){
			
			
		},
		Base:function(){
			
		},
		Widget:function(){
			
		},
		
		namespace:function(){},
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
});