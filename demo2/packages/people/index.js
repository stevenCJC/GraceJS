G.Package(['common'],function (Class, $) {
	//load的callback需要等待所有js加载后才能执行
	Class(function index(id) {
		//$('a').chzn(' people ');
		this.id=id;
	}, {
		Event:{
			'click body@{id}':'alert',
		},
		//初始化后有效，未初始化不起作用
		Util:{
			'util:chzn':'chzn',
			chzn:'chzn',
		},
		//Dataset:{},
		//Subscribe:{
		//	'!alert':'alert',//监听全局，本包内也起作用
		//	'tips':'alert',//监听本包，全局不起作用
		//},
		//Init:{},
		//Load:{},
		//Destroy:{},
		
	}, {
		//方法
		alert:function(){
			alert(3);
		},
		chzn:function($el,args){
			$el.append(args[0]);
		},
	});
	
});
	
