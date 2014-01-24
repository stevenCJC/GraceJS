
	
	G.Extend('grace',{
		
		Page:function(path,cons,inte,init,func){
			
			utils(inte.util);
			
			var DS=this.DS;
			var root=this;
			
			function Widget(){
				cons.apply(this,arguments);
				DS.initData(path,inte.dataset,this);
				for(var x in inte.event) bind(this,x);
				for(var x in inte.subscribe) subscribe(this,x);
				for(var x in init) runPageInit(this,x,init[x]);
			}
			
			
			func.PATH=path;
			var extend=this.extend.page;
			for(var x in extend) func[x]=extend[x];
			for(var x in inte.event) func['zzE_'+x]=inte.event[x];
			for(var x in inte.subscribe) func['zzS_'+x]=inte.subscribe[x];
			
			var w=this.widget[path]=Compose(Widget,func);
			
			
		},
		
	});
	
	
	
	G.Extend('page',{
		DS:function(path){
			return G.DS.getDS(path);
		},
		$:function(s){return new Engine(s);},
		
		publish:function(channel,message){
			if(message)G.MD.publish(channel,message);
			else G.MD.publish(channel);
		},
	});
	
	
	function runPageInit(that,x,callback){
		
		
		
		
		
		
	}
	
	


