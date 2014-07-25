define(['function/fixPath','function/JSONClone','oop/package/class/var/_behavior','function/fixPath','oop/package/var/packages','oop/package/var/mediator'], function(fixPath,JSONClone,_behavior,fixPath,packages,mediator) {
	
	
	_behavior['class'].Subscribe={
		Build:function(subs,cons){
			
		},
		Init:function(subs,that){
			
			var md=packages[that.PACKAGE].mediator;
			for(var x in subs){
				if(subs[x].constructor==String){
					subs[x]=that[subs[x]];
					md.subscribe(x,function(message){ subs[x](message);});
				}else md.subscribe(x,function(message){ subs[x].call(that,message);});
			}
		},
	}
	
	
	return _behavior;
});