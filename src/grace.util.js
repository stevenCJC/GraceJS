G.Extend('grace',{
	//domUtils	对dom操作自动处理扩展
	//funcUtils	为engine添加prototype函数扩展
	Util:function(domUtils,funcUtils){
		//调用$$自身扩展方法
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
	//调用util自动初始化方法进行初始化
	//utils	初始化方法，逗号隔开
	util:function(utils){
		var du=$$.dataUtils;
		//如果utils参数存在
		if(utils&&utils.constructor==String){
			utils=utils.replace(/\s/ig,'').split(',');
			var u,x;
			var uts=du['util'];
			while(u=utils.pop()){
				var func=uts[u];
				this.find('[data-util="'+u+'"]').each(function(el){
					if(!el[0].inited&&func){//如果未进行过初始化
						func(el,el.data('set'));
						el[0].inited=true;//初始化后会给元素设置属性 inited 为 true
					}
				}).end();
			}
		}else{//如果没有utils参数，则初始化所有
			for(x in du){
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
	//属性扩展
	dataUtils:{},
	
});





