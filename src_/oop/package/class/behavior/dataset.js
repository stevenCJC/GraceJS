define(['function/fixPath','function/JSONClone','oop/package/class/var/_behavior','function/fixPath','oop/package/var/packages'], function(fixPath,JSONClone,_behavior,fixPath,packages) {
	
	
	_behavior['class'].Dataset={
		Build:function(ds,cons){
			
		},
		Init:function(ds,that){
			var DS=packages[that.PACKAGE].dataset;
			var dataset=JSONClone(ds),k;
			for(var x in dataset){
				k=fixPath(x,that);
				DS.initData(k,dataset[x]);
			}
		},
	}
	
	
	return _behavior;
});