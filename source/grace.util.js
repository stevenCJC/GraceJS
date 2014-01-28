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



G.Engine({
	
	util:function(utils){
		var du=$$.dataUtils;
		if(utils&&utils.constructor==String){
			utils=utils.replace(/\s/ig,'').split(',');
			var u;
			var uts=du['util'];
			while(u=utils.pop()){
				var func=uts[u];
				this.find('[data-util="'+u+'"]').each(function(el){
					if(!el[0].inited&&func){
						func(el,el.data('set'));
						el[0].inited=true;
					}
				}).end();
			}
		
		}else if((typeof utils !='undefined')&&utils){
			
			for(var x in du){
				var t=du[x];
				this.find('[data-'+x+']').each(function(el){
					var u=el.data(x);
					if(!el[0].inited&&t[u]){
						t[u](el,el.data('set'));
						el[0].inited=true;
					}
				}).end();
			}
		}
		return this;
	},
	
},{
	
	dataUtils:{},
	
});





