define(['oop/package/class/var/_behavior','$'], function(_behavior,$) {

	


	_behavior.Util={
		Build:function(utils,cons){
			
		},
		Init:function(utils,that){
			var u={};
			for(var x in utils) {
				if(utils[x].constructor==String){
					utils[x]=that[utils[x]];
					u[x]=function(){ utils[x](this,arguments);};
				}else u[x]=function(){ utils[x].call(that,this,arguments);};
			}
			$.extend(u);
		}
	};



	
	return _behavior;
});