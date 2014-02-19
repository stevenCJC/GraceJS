define(['./core','./compose'], function(G,Compose) {
	
	G.Extend('grace',{
		
		Widget:function(path,cons,behavior,proto){
			proto.TYPE='widget';//设置生成插件类别
			this.widget[path]=makeWidget.call(this,path,cons,behavior,proto);
		},
		
	});
	
	//widge page内置方法扩展
	G.Extend('widget,page',{
		
		DS:function(path){
			//返回一个DS对象
			return G.DS.getDS(path);
		},
		//类JQ操作对象
		$:function(s){ return $$(s); },
		//向中介发布信息
		publish:function(channel,message){
			if(message)G.MD.publish(channel,message);
			else G.MD.publish(channel);
		},
		
		//初始化一个widget插件，如果是widget调用，限制只能调用同根widget，如果是page调用，则不设限制
		new:function(path,p){
			var w=this.widget[path];
			if(this.TYPE=='widget'&&w&&this.PATH.split('/')[0]==path.split('/')[0]||this.TYPE!='widget'&&w)
				return new w(p);
		},
		
	})
	
	

	//widget page 行为扩展
	//是否应该考虑吧初始化行为也提到这里来
	G.Extend('widget/behavior,page/behavior',{
		
		//数据岛行为扩展
		dataset:[function(path,dataset,root){
			var DS=root.DS;
			dataset=clone(dataset);
			if(dataset.constructor==Array) dataset[0]=fixPath(dataset[0],this);
			DS.initData(path,dataset);
		},function(){
			
		}],
		//util行为扩展，以冒号区分两种util扩展
		util:[function(path,util,root){
			utils(util,this);
		},function(path,util,proto){
			
		}],
		//事件绑定扩展
		//考虑做成独立的内部事件绑定机制，不依赖jquery的事件绑定机制
		event:[function(path,event,root){
			for(var x in event) bind(this,x);
		},function(path,event,proto){
			for(var x in event) proto['zzE_'+x]=event[x];
		}],
		//注册订阅
		subscribe:[function(path,subs,root){
			for(var x in subs) subscribe(this,x);
		},function(path,subs,proto){
			for(var x in subs) proto['zzS_'+x]=subs[x];
		}],
		//初始化扩展
		init:[function(path,init,root){
			for(var x in init) {
				if(init[x].constructor==String){
					runPageInit(this,fixPath(x,this),this[init[x]]);
				}else
					runPageInit(this,fixPath(x,this),init[x]);
			}
		},function(path,init,root){
		}],
		
		
		
		
	})
	
	G.Extend('widget/behavior/event,page/behavior/event',{
		//常规dom事件绑定实现方法
		//that	事件绑定相关对象
		//path	事件绑定指令
		//key	事件函数对应的prototype键
		event:function(that,path,key){
			var index=path.indexOf(' ');
			var etype=path.substr(0,index);
			var dom=path.substr(index+1).split('@');//
			//如果dom事件有委托
			if(dom.length==2)
				$$(dom[0]).on(etype,dom[1],function(e){
					that[key]($$(this),e);
				});
			else if(dom.length==1)//如果dom事件没有委托
				$$(dom[0]).on(etype,function(e){
					that[key]($$(this),e);
				});
		},
	})

	G.Extend('widget/behavior/init,page/behavior/init',{
		
		dom:function(that,target,callback){
			var t=$$(target);
			var set=t.data('set');
			if(set.constructor==String) set=G.DS.getDS(set);
			callback.call(that,t,set);
		},
		
	});
	
	//初始化utils
	function utils(d,that){
		var func={},util={};
		for(var x in d){
			x=fixPath(x,that);//为了少用一个for循环
			if(x.indexOf(':')>-1) util[x]=d[x];//如果有冒号，则表示为dom驱动初始化
			else func[x]=d[x];//没有冒号表示添加prototype方法扩展
		}
		//调用util扩展方法
		G.Util(util,func);
	}
	
	//初始化订阅功能
	function subscribe(that,path){
		var key='zzS_'+path;//对象中对应的执行方法的prototype键
		path=fixPath(path,that);
		if(that[key].constructor==String) key=that[key];
		G.MD.subscribe(path,function(message){
			that[key](message);
		});
	}
	
	//事件函数绑定执行
	function bind(that,path){
		var key='zzE_'+path;
		if(that[key].constructor==String)key=that[key];
		
		path=fixPath(path,that);
		
		var index=path.indexOf(' ');
		var index2=path.indexOf(':');
		
		if(index>0&&(index2>0&&index<index2||index2==-1)){//冒号在后面或者没有冒号，一定有空格，默认为常规dom事件处理方式
			var type="event";
		}else if(index2>0&&(index>0&&index2<index||index==-1)){//冒号在前面或者没有空格，一定有冒号，分析为其他事件处理方式
			var type=path.substr(0,index2);//也可能是dom方式
			var path=path.substr(index2+1);
		}
		G.extend[that.TYPE+'/behavior/event'][type](that,path,key);
		
	}
	
	//插件构造函数执行后就跑初始化程序
	function runPageInit(that,x,callback){
		
		if(x.indexOf(':')>-1){
			var index=x.indexOf(':');
			var type=x.substr(0,index);//获得key解析类型
			var target=x.substr(index+1);//获得key解析对象
			var init=G.extend[that.TYPE+'/behavior/init'][type];//从扩展获得处理方式
			if(init) init(that,target,callback);//如果存在就执行
			else G.extend[that.TYPE+'/behavior/init']['dom'](that,x,callback);//否则默认当做dom方式处理
		}else{
			G.extend[that.TYPE+'/behavior/init']['dom'](that,x,callback);//按照dom方式处理
		}
		
		
	}
	
	//新组装一个插件
	function makeWidget(path,cons,behavior,proto){
		
		var root=this;
		
		function Widget(){
			
			cons.apply(this,arguments);
			
			for(var x in behavior) if(x!='init'){//循环各种行为的处理
				var f=G.extend[proto.TYPE+'/behavior'][x]
				if(f){
					f=f[0];//返回初始化执行函数
					if(f)f.call(this,path,behavior[x],root);
				}
			}
			//执行初始化
			var init=behavior.init;
			if(proto.TYPE=='page') G.extend[proto.TYPE+'/behavior']['init'][0].call(this,path,behavior['init'],root);
		}
		
		proto.PATH=path;
		var extend=this.extend[proto.TYPE];//需要跟page分开扩展
		//对widget 和page的内部方法扩展
		for(var x in extend) proto[x]=extend[x];
		
		for(var x in behavior) {
			var f=G.extend[proto.TYPE+'/behavior'][x];
			if(f){
				f=f[1];//返回初始化前执行函数 ，应该调整一下
				if(f)f.call(this,path,behavior[x],proto);
			}
		}
		//返回组装类
		return Compose(Widget,proto);
			
	}
});