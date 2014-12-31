define(['g','oop/Event'], function(g,Event) {
	
	
	function Mediator_ns(){
		this.channels=new Event();
	}
	Mediator_ns.prototype={
		constructor:Mediator_ns,
		  
		subscribe:function(channels,cb,context){
			this.channels.on(channels,cb,context);
		},
		
		unsubscribe:function(channels){
			this.channels.off(channels);
		},
		once:function(channels,cb,context){
			this.channels.once(channels,cb,context);
		},
		publish:function(channels,data,context){
			this.channels.trigger(channels,data,context);
		},
		
		
		
	}
	
	
	
	return Mediator_ns;
	
});
	