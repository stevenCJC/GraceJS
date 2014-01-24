
	
	G.Extend('grace',{
		
		Page:function(path,cons,inte,init,func){
			
			
			var DS=this.DS;
			var root=this;
			
			function Page(){
				
				utils(inte.util,this);
				
				cons.apply(this,arguments);
				
				//避免影响源数据，需要深克隆一个副本
				var dataset=clone(inte.dataset);
				
				if(dataset.constructor==Array) dataset[0]=fixPath(dataset[0],this);
				
				DS.initData(path,dataset);
				
				for(var x in inte.event) bind(this,x);
				
				for(var x in inte.subscribe) subscribe(this,x);
				
				for(var x in init) runPageInit(this,fixPath(x,this),init[x]);
				
			}
			
			
			
			//  page存储初始化的对象，不存储类
			
			func.PATH=path;
			var extend=this.extend.page;
			for(var x in extend) func[x]=extend[x];
			for(var x in inte.event) func['zzE_'+x]=inte.event[x];
			for(var x in inte.subscribe) func['zzS_'+x]=inte.subscribe[x];
			
			var w=this.page[path]=Compose(Page,func);
			
			
		},
		
		newPage:function(path,p){
			var w=new this.page[path](p);
			return w;
		},
		
	});
	
	
	

	//定义扩展Page对象init的处理方式
	G.Extend('page/init',{
		
		dom:function(that,target,callback){
			var t=$$(target);
			var set=t.data('set');
			if(set.constructor==String) set=G.DS.getDS(set);
			callback.call(that,t,set);
		},
		
	});
	
	function runPageInit(that,x,callback){
		
		if(x.indexOf(':')>-1){
			var index=x.indexOf(':');
			var type=x.substr(0,index);
			var target=x.substr(index+1);
			var init=G.extend['page/init'][type];
			if(init) init(that,target,callback);
			else G.extend['page/init']['dom'](that,x,callback);
		}else{
			G.extend['page/init']['dom'](that,x,callback);
		}
		
		
	}
	
	


