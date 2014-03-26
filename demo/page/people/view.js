define([], function () {
	G.Use('common'); //声明获取包权限，包的类定义都已ready，实现包依赖控制和访问权控制，用到时加载，通过Class引用，如果找不到相应的就进行加载

	G.Package('people', function (Class, $) {

		Class('view', function () {
			//构造函数
		}, {
			//行为定义
		}, {
			//方法
		});

	});

	
});
