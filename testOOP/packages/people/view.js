G.Package(['common'],function (Class, $) {
	//load的callback需要等待所有js加载后才能执行
	Class(function view() {
		
	}, {
		//行为定义
		
	}, {
		//方法
		
	});
	
	Class(function cons_behav() {
		
	},{
		Event:{
			'click body@{id}':'alert',
		},
	});
	
	Class(function cons_proto() {
		
	},{
		sjdkf:function(){},
	});
	
	Class('behav_proto',{
		Event:{
			'click body@{id}':'alert',
		},
	},{
		sjdkf:function(){},
	});

	Class('behav',{
		Event:{
			'click body@{id}':'alert',
		},
	});
	Class(function view_func() {
		
	});
	Class({Partial:'behavvvvv',Extend:'cons_behav'},{
		Event:{
			'enter body@{id}':'alert',
		},
	});
	Class('Partial:behavvvvv',{
		Event:{
			'dblclick body@{id}':'alert',
		},
	});
	//new Class.behavvvvv();
	Class({Partial:'proto',Extend:'view_func'},{
		sjdkf:function(){},
	});
	Class('Partial:proto',{
		ssss:function(){alert('sssss')},
	});
	
});
	
