
	
	G.Extend('grace',{
		
		Widget:function(path,cons,inte,func){
			
			var DS=this.DS;
			var root=this;
			function Widget(){
				cons.apply(this,arguments);
				DS.initData(path,inte.dataset,this);
				for(var x in inte.event) bind(this,x);
				for(var x in inte.subscribe) subscribe(this,x);
			}
			
			func.PATH=path;
			var extend=this.extend.widget;
			for(var x in extend) func[x]=extend[x];
			for(var x in inte.event) func['zzE_'+x]=inte.event[x];
			for(var x in inte.subscribe) func['zzS_'+x]=inte.subscribe[x];
			
			var w=this.widget[path]=Compose(Widget,func);
			
		},
		
		newWidget:function(path,p){
			var w=new this.widget[path](p);
			return w;
		},
		
		
	});
	
	
	G.Extend('widget',{
		DS:function(path){
			return G.DS.getDS(path);
		},
		$:function(s){ return $$(s); },
		
		publish:function(channel,message){
			if(message)G.MD.publish(channel,message);
			else G.MD.publish(channel);
		},
		
	})
	
	
	function subscribe(that,path){
		var srcPath=path;
		path=path.replace(/(^\s*)|(\s*$)/g,'').replace(/\{.*?\}/ig,function(m){
			return that[m.replace(/\{|\}/ig,'')];
		});
		var key='zzS_'+srcPath;
		if(that[key].constructor==String) key=that[key];
		G.MD.subscribe(path,function(message){
			that[key](message);
		});
	}
	
	function bind(that,path){
		var srcPath=path;
		path=path.replace(/(^\s*)|(\s*$)/g,'').replace(/\{.*?\}/ig,function(m){
			return that[m.replace(/\{|\}/ig,'')];
		});
		var index=path.indexOf(' ');
		var type=path.substr(0,index);
		var dom=path.substr(index+1).split('@');
		var $el=$$(dom[0]);
		
		$el.on(type,dom[1],function(e){
			var key='zzE_'+srcPath;
			if(that[key].constructor==String)key=that[key];
			that[key]($$(this),e);
		});
		
	}
	


