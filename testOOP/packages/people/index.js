
/*
	G.Package([],function(Class,$){
		Class.View('',function(){
			
		},{
			Tpl:{
				index:'~/index.html',
			},
			Event:{
				loadIndex:'load',
			},
			Destroy:function(){},
		},{
			load:function(data){
				this.Tpl.index(function(tpl){
					tpl(data);
				});
			},
		});
		
		Class.Model('',{
			
			
			
		});
		
		Class('',function(){
			
		},{
			
		},{
			
		})
		
	});
*/



G.Package(['common'],function (Class, $) {
	//load的callback需要等待所有js加载后才能执行
	Class.View('Partial:index',function index(id) {
		//$('a').chzn(' people ');
		this.id=id;
		//console.log(Class.Load);
	});
	//console.log(Class.Load);
	Class.View('Partial:index',{
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
		
	}, {
		//方法
		chzn:function($el,args){
			$el.append(args[0]);
		},
	});
	Class.View('Partial:index',{
		Event:{
			'dblclick body@{id}':'alert',
		},
		//初始化后有效，未初始化不起作用
		Util:{
			'util:chzn':'chzn',
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
		loadIndex:function(){
			alert('loadIndex');
		},
		
	});
});
	
