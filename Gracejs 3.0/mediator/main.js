define(['g','./Mediator_ns'], function(g,Mediator_ns) {
	
	var _mediator=new Mediator_ns();
	
	g.pub=function(c,data,context){
		_mediator.publish(c,data,context);
	};
	
	g.sub=function(c,cb,context){
		_mediator.subscribe(c,cb,context);
	};
	g.unsub=function(c){
		_mediator.unsubscribe(c);
	};
	g.once=function(c){
		_mediator.once(c);
	};
	
});


