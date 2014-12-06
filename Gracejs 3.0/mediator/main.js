define(['g','./Mediator'], function(g,Mediator) {
	
	var _mediator=new Mediator();
	
	g.sub=function(c,cb){
		_mediator.subscribe(c,cb);
	};
	g.pub=function(c,data){
		_mediator.publish(c,data);
	};
	
	
});


