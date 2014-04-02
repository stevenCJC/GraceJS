define(['./listitem', './view', 'Common','Utils'], function (item, view) {
	//显式申请包使用权限
	
	G.Package.Load()//可选择同步异步
	G.Package.Unload()
	
	G.Package('People',['Common','Utils'], function (Class, $) {
		
		//load的callback需要等待所有js加载后才能执行
		Class('mainList', function () {
			G.Package.Load('Modal', function () {//可选择同步异步
				var m = new Class.modal('people',{age:12,id:123,name:'steven'});
				m.modalShowOn('name',function(){});
				$('#sdf').tpl({id:'',url:''},m);
				$('#sdf').tpl('peoplelist',m);
			});
		}, {
			//行为定义
			
		}, {
			//方法
			
		});
		
	});

	G.Package('company', function (Class) {
		Class('classname', function () {
			//构造函数
			//var p = new Class('people');

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
		}, 'classname', function () {
			
		}, {
			
		}, {
			
		});

		$.new('classname', function (o) {
			
		}); //返回对象，实现异步加载模块


		G.Use('common,utils', function (init) {
			var nb = init('navbar');
		});

	});
});
