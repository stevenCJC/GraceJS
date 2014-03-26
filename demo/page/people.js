//使用requirejs进行依赖管理
G.Use('common'); //声明获取包权限，包的类定义都已ready，实现包依赖控制和访问权控制，用到时加载，通过Class引用，如果找不到相应的就进行加载

G.Package('people',function(Class,$){
	
	Class('classname',function(){
		//构造函数
	},{
		//行为定义
	},{
		//方法
	});
	
});

G.Package('people',function(Class){
	Class('classname',function(){
		//构造函数
	},{
		//行为定义
	});
	
	Class('classname',function(){
		//构造函数
	},{
		//方法
	});
	
	Class('classname',{
		//行为定义
	});	
	
	Class('classname',{
		//构造函数
	});		
	
	Class('classname',{
		//方法
	});
	
	Class('classname');//返回类
	
	var c=new Class('classname');
	
	Class({extend:'animal'},'classname',function(){
		
	},{
		
	},{
		
	});
	
	
	
	
	
	
	$.new('classname',function(o){
		
	});//返回类
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});