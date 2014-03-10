define(['./core','_','function/fixPath','engine/$$','function/makeWidget','function/deepClone','oop/baseClass'], function(G,_,fixPath,$$,makeWidget,deepClone,baseClass) {
	
	G.Extend('grace',{
		
		Widget:function(path,func,behavior,proto){
			proto.TYPE='widget';//设置生成插件类别
			//需要存储各成分结构，提供复用
			/*
				1、行为只有覆盖，不提供向上指针
				2、原型方法可提供向上原型指针
				
				复用分为两种模式：
					1、重构---生成兄弟关系的新类；
						a.覆盖base的构造函数，
						b.可选择继承行为，覆盖行为，
						c.覆盖原有原型方法，提供base向上原型指针
						d.执行新的构造函数进行构造
					2、继承---生成父子关系的新类；
						a.执行父级构造函数进行初始构造，生成base向上对象指针；
						b.选择继承行为，覆盖行为，
						c.原型覆盖
						d.执行新的构造函数进行构造
				
			*/
			//继承，在这里实现各成分拷贝
			
			if(baseClass.path){
				//获取base类
				var base=this.widget[baseClass.path];
				//获取base构件
				var chips=this.chips[baseClass.path];
				var options;
				//获得继承的行为种类
				if(baseClass.options=='*') options=Object.keys(G.extend['widget/behavior']);
				else options=baseClass.options
				var tmp={};
				//根据继承行为种类进行拷贝构件
				for(var i=0,len=options.length;i<len;i++)
					tmp[options[i]]=_.extend({},chips.behavior[options[i]],behavior[options[i]]);
				behavior=_.extend({},behavior,tmp);
				
				//需要区别是否原生类，如果是原生类，需要继承prototype，如果不是原生类，只需要继承proto
				
				proto=_.extend({},chips.proto,func.prototype,proto);
				
			}
			
			this.chips[path]={
				path:path,
				func:func,
				behavior:behavior,
				proto:proto,
			};
			
			this.widget[path]=makeWidget.call(this,path,func,behavior,proto);
			//原型已就绪    向上指针：this.base=baseClass.prototype;
			
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
			dataset=deepClone(dataset);
			if(dataset.constructor==Array) {
				dataset[0]=fixPath(dataset[0],this);
				DS.initData(path+'/'+dataset[0],dataset[1]);
			}else{
				DS.initData(path,dataset);
			}
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
	
	return G;
});