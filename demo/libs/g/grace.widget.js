
	
	G.Extend('grace',{
		
		Widget:function(path,cons,inte,proto){
			
			
			
			var root=this;
			
			function Widget(){
				
				
				//{id}变量问题未解决
				cons.apply(this,arguments);
				
				
				
				
				for(var x in inte) {
					var f=G.extend['widget/interface'][x]
					if(f){
						f=f[0];
						if(f)f.call(this,path,inte[x],root);
					}
				}
				
				//执行初始化
				
				
			}
			
			proto.PATH=path;
			var extend=this.extend.widget;
			for(var x in extend) proto[x]=extend[x];
			
			for(var x in inte) {
				var f=G.extend['widget/interface'][x];
				if(f){
					f=f[1];
					if(f)f.call(this,path,inte[x],proto);
				}
			}
				
			var w=this.widget[path]=Compose(Widget,proto);
			
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
	
	
	G.Extend('widget/interface,page/interface',{
		
		dataset:[function(path,dataset,root){
			var DS=root.DS;
			dataset=clone(dataset);
			if(dataset.constructor==Array) dataset[0]=fixPath(dataset[0],this);
			DS.initData(path,dataset);
		},function(){
			
		}],
		
		util:[function(path,util,root){
			utils(util,this);
		},function(path,util,proto){
			
		}],
		
		event:[function(path,event,root){
			for(var x in event) bind(this,x);
		},function(path,event,proto){
			for(var x in event) proto['zzE_'+x]=event[x];
		}],
		
		subscribe:[function(path,subs,root){
			for(var x in subs) subscribe(this,x);
		},function(path,subs,proto){
			for(var x in subs) proto['zzS_'+x]=subs[x];
		}],
	})
	
	G.Extend('widget/interface/event,page/interface/event',{
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
		G.extend['widget/interface/event'][type](that,path,key);
		
	}
	


