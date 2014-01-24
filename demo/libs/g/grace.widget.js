
	
	G.Extend('grace',{
		
		Widget:function(path,cons,inte,func){
			
			
			
			var DS=this.DS;
			var root=this;
			
			function Widget(){
				
				utils(inte.util,this);
				
				cons.apply(this,arguments);
				
				var dataset=clone(inte.dataset);
				
				if(dataset.constructor==Array) dataset[0]=fixPath(dataset[0],this);
				
				DS.initData(path,dataset);
				
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
	
	
	G.Extend('widget,page',{
		DS:function(path){
			return G.DS.getDS(path);
		},
		$:function(s){ return $$(s); },
		
		publish:function(channel,message){
			if(message)G.MD.publish(channel,message);
			else G.MD.publish(channel);
		},
		
	})
	
	G.Extend('widget/event,page/event',{
		LS:function(path){
			
		},
		
		event:function(that,path,key){
			var index=path.indexOf(' ');
			var etype=path.substr(0,index);
			var dom=path.substr(index+1).split('@');
			$$(dom[0]).on(etype,dom[1],function(e){
				that[key]($$(this),e);
			});
		},
	})
	
	
	function utils(d,that){
		var func={},util={};
		for(var x in d){
			x=fixPath(x,that);//为了少用一个for循环
			if(x.indexOf(':')>-1) util[x]=d[x];
			else func[x]=d[x];
		}
		G.Util(util,func);
	}
	
	
	function subscribe(that,path){
		var srcPath=path;
		
		path=fixPath(path,that);
		
		var key='zzS_'+srcPath;
		if(that[key].constructor==String) key=that[key];
		G.MD.subscribe(path,function(message){
			that[key](message);
		});
	}
	
	function bind(that,path){
		var key='zzE_'+path;
		if(that[key].constructor==String)key=that[key];
		
		path=fixPath(path,that);
		
		var index=path.indexOf(' ');
		var index2=path.indexOf(':');
		
		if(index>0&&(index2>0&&index<index2||index2==-1)){//冒号在后面或者没有冒号，一定有空格
			var type="event";
		}else if(index2>0&&(index>0&&index2<index||index==-1)){//冒号在前面或者没有空格，一定有冒号
			var type=path.substr(0,index2);
			var path=path.substr(index2+1);
		}
		G.extend['widget/event'][type](that,path,key);
		
	}
	


