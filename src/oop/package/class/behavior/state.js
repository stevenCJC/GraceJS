define(['dataset/DS'], function(DS) {
	
	
	_behavior['view'].State={
		Build:function(state,cons){
			
		},
		Init:function(state,that){
			that._state=new DS(state);
		},
	}
	
	
	return _behavior;
});