G.Package(['common'],function (Class, $) {
	//load的callback需要等待所有js加载后才能执行
	Class('proto_extend', {
		a:function(){},
		b:function(){},
	});
	Class({Name:'proto_extended',Extend:'proto_extend'},{
		
		A:function(){},
		B:function(){},
		
	});
});

