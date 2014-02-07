
	
	G.Extend('grace',{
		
		Widget:function(path,cons,interface,init,proto){
			proto.TYPE='widget';
			this.widget[path]=makeWidget.call(this,path,cons,interface,init,proto);
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
		
		new:function(path,p){
			var w=this.widget[path];
			if(this.TYPE=='widget'&&w&&this.PATH.split('/')[0]==path.split('/')[0]||this.TYPE=='page'&&w)
				return new w(p);
		},
		
	})
	
	G.Extend('widget',{
		
		new:function(path,p){
			var w=this.widget[path];
			if(w&&this.PATH.split('/')[0]==path.split('/')[0])
				return new w(p);
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
		
		event:function(that,path,key){
			var index=path.indexOf(' ');
			var etype=path.substr(0,index);
			var dom=path.substr(index+1).split('@');
			$$(dom[0]).on(etype,dom[1],function(e){
				that[key]($$(this),e);
			});
		},
	})
	
	G.Extend('widget/init,page/init',{
		
		dom:function(that,target,callback){
			var t=$$(target);
			var set=t.data('set');
			if(set.constructor==String) set=G.DS.getDS(set);
			callback.call(that,t,set);
		},
		
	});
	
	
	
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
		G.extend[that.TYPE+'/interface/event'][type](that,path,key);
		
	}
	

	function runPageInit(that,x,callback){
		
		if(x.indexOf(':')>-1){
			var index=x.indexOf(':');
			var type=x.substr(0,index);
			var target=x.substr(index+1);
			var init=G.extend[that.TYPE+'/init'][type];
			if(init) init(that,target,callback);
			else G.extend[that.TYPE+'/init']['dom'](that,x,callback);
		}else{
			G.extend[that.TYPE+'/init']['dom'](that,x,callback);
		}
		
		
	}

	function makeWidget(path,cons,interface,init,proto){
		
		var root=this;
		
		function Widget(){
			
			cons.apply(this,arguments);
			
			for(var x in interface) {
				var f=G.extend[proto.TYPE+'/interface'][x]
				if(f){
					f=f[0];
					if(f)f.call(this,path,interface[x],root);
				}
			}
			
			//执行初始化
			if(proto.TYPE=='page') for(var x in init) runPageInit(this,fixPath(x,this),init[x]);
			
		}
		
		proto.PATH=path;
		var extend=this.extend[proto.TYPE];//需要跟page分开扩展
		for(var x in extend) proto[x]=extend[x];
		
		for(var x in interface) {
			var f=G.extend[proto.TYPE+'/interface'][x];
			if(f){
				f=f[1];
				if(f)f.call(this,path,interface[x],proto);
			}
		}
		return Compose(Widget,proto);
			
	}