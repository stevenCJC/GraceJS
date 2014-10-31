define(['./core','_','function/fixPath','engine/$$','function/makeWidget','function/deepClone','oop/baseClass'], function(G,_,fixPath,$$,makeWidget,deepClone,baseClass) {
	
	G.Extend('grace',{
		
		Widget:function(path,func,behavior,proto){
			proto.TYPE='widget';//设置生成插件类别
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
	
	
	
	return G;
});