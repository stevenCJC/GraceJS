define(['g','_/is','_/object'], function(g,_selector) {
	
	
	// 编写dom插件，从组件外部插入
	
	g.ui.wedgit=function(name,options){ //不需要render和构造函数，自动set $elem, 需要判断init时机
		
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