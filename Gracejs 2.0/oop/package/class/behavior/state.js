define(['dataset/DS'], function(DS) {
	
	
	_behavior['view'].State={
		Build:function(state,cons){
			
		},
		Init:function(state,that){
			that.State=new DS(state);
		},
	}
	
	
	return _behavior;
});