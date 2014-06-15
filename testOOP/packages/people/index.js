
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

/*
	
	
	G.Package(['common'],function (Controller, View, Model, $) {
		Controller('name',function(){},{});
	});
	
	G.Package.View(['common'],function (Class, $) {
		Class('name',function(){},{});
	});
	
	
*/

G.Package.View(['common'],function (View, $) {
	//load的callback需要等待所有js加载后才能执行
	View('Partial:index',function index(id) {
		//$('a').chzn(' people ');
		this.id=id;
		//console.log(Class.Load);
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
		loadIndex:loadIndex,
		
	});
});
	
function loadIndex(){
}