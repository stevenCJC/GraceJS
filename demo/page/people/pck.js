G.Package(function (Class, $) {
	//load的callback需要等待所有js加载后才能执行
	Class('mainList', function () {
		var m = new Class.modal('people',{age:12,id:123,name:'steven'});
		m.modalShowOn('name',function(){});
		$('#sdf').tpl({id:'',url:''},m);
		$('#sdf').tpl('peoplelist',m);
	}, {
		//行为定义
		
	}, {
		//方法
		
	});
	
});
	
