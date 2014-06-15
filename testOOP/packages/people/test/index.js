
/*
	
	root ///////////////////////////////////////////////////////////////////////
	 > 可控制展开收缩，如有不通过的模块默认展开
	root>searchbar ///////////////////////////////////////////////////////////////////////
	 > 
	root>searchbar>initPanel ///////////////////////////////////////////////////////////////////////
	 > 
	
*/

G.Package.Test([],function (Test, $) {
	//load的callback需要等待所有js加载后才能执行
	Test('index',function (assert) {
		/**/
		
	});
	//console.log(Class.Load);
	View('Partial:index',{
		Init:{
			
		},
		Tpl:{
			
		},
		
		Event:{
			'click body@{id}':'alert',
			loadIndex:'loadIndex',
		},
		//初始化后有效，未初始化不起作用
		Util:{
			chzn:'chzn',
		},
		
		State:{
			open:1,
		},
		Destroy:{
			
		}
		
	}, {
		//方法
		chzn:function($el,args){
			$el.append(args[0]);
		},
	});
	View('Partial:index',{
		Event:{
			'dblclick body@{id}':'alert',
		},
		//初始化后有效，未初始化不起作用
		Util:{
			'util:chzn':'chzn',
		},
		
	}, {
		//方法
		alert:function(){
			
			alert(3);
		},
		loadIndex:function(){
			alert('loadIndex');
		},
		
	});
});
	
