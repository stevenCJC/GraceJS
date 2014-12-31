define(['g','_/is','mediator/main'], function (g) {
	
	
	
	var mediator={
		__blacklist__:['_mediatorInit'],
		_mediatorInit:function(){
			
			if(this.Subscribe){
				
				for(var x in this.Subscribe) this.sub(x,this.Subscribe[x]);
				
			}
			
			
		},
		
		pub:g.pub,
		
		sub:g.sub,
		
	};
	
	
	
	return mediator;
});