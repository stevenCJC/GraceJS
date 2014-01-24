G.Extend('grace',{
	
	Util:function(domUtils,funcUtils){
		$$.extend(funcUtils);
		
		var du=$$.dataUtils;
		for(var x in domUtils){
			if(x.indexOf(':')>-1){
				var xx=x.split(':');
				du[xx[0]]=du[xx[0]]||{};
				du[xx[0]][xx[1]]=domUtils[x];
			}else{
				du['util']=du['util']||{};
				du['util'][x]=domUtils[x];
			}
			
		}
		
		
	},
	
});









