define(['./listitem', './view', 'common'], function (item, view) {
	
	G.Use('common');
	G.Package('people', function (Class, $) {
		$.require('toLoad', function () {
			Class('listitem', function () {
				//构造函数
				comm(function () {
					var m = Class('modal');
					m.modalShowOn('name',function(){
						
					});
				});
			}, {
				//行为定义
			}, {
				//方法
			});
		});
	});

	G.Package('company', function (Class) {
		Class('classname', function () {
			//构造函数
			var p = new Class('people');

		}, {
			//行为定义
		});

		Class('classname', function () {
			//构造函数
		}, {
			//方法
		});

		Class('classname', {
			//行为定义
		});

		Class('classname', {
			//构造函数
		});

		Class('classname', {
			//方法
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
