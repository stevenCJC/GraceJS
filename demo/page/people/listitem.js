define([], function () {
	G.Use('common'); 
	G.Package('people', function (Class) {
		Class('listitem', function () {
			//构造函数
		}, {
			//行为定义
		});

	
		Class('classname'); //返回类

		var c = new Class('classname');

		Class({
			extend : 'animal'
		}, 'classname', function () {}, {}, {});

		$.new('classname', function (o) {}); //返回对象，实现异步加载模块


		G.Use('common,utils', function (init) {
			var nb = init('navbar');
		});

	});
});
