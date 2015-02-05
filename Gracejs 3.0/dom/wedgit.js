define(['g','_/is','_/object'], function(g,_selector) {
	
	
		
	// extend(name,classFunction)	//开发插件的时候比较有用的扩展方式,直接支持对子方法的调用模式
	// extend(name,{				//基于name的命名空间下，对子方法的调用模式，使用第三方插件、定义接口的时候比较有用
	// 	main:function(){},
	//	name1:function(){},
	//	name2:function(){},
	//});
	// extend(obj)					//基本扩展方式
	g.ui.wedgit=function(name,wedgit){
		
		g.ui.fn[name]=function(action, options){
			if(action&&action.constructor==String&&obj[action]){
				
				obj[action].apply(this,arguments.slice(1));
					
			}else{
				var wdg,p;
				this.each(function(){
					wdg=new obj(this,action);
					p=g.q(this).closest('[_]').attr('_');
					//////////////////////////////////// 插入相应组件对象的使用组件数组里面
				});
				obj[name].apply(this,arguments);
				
			}
		};
		
	};
	
	
});