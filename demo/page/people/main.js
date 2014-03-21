G.Package('common'); //声明获取包权限，包的类定义都已ready，实现包依赖控制和访问权控制
G.Page('people/struct',function(){
	//可访问包级私有订阅域和数据域
	//不可直接继承类，但可启动初始化而不返回对象指针，通过订阅域和数据域实现运作？
	//可直接初始化和继承？
},{
	
},{
	init:function(){
		
	},
})