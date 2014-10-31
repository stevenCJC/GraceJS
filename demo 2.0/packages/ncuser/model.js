/*

	G.fetch('userList',{url:'',data:{},success:function(data){},error:function(e){}});
	var list=G.fetch('userList',{url:'',data:{}});
	
	
*/
require(['grace'],function(grace){
	
	
	grace.Model('userList',{
		db:{},
		sql:function(data){
			return 'select * from userlist where id='+data.id;
		},
		dto:function(data){
			return {
				id:		data.PID,
				name:	data.DisplayName,
			};
		},
		
	});
	
	
	grace.Model('userChatting',{
		localStorage:'userChatting',
		datatype:'json',//默认json，自动检测
	});
	
	
	grace.Model('userList',{
		url:'~/',
		debug:'',
		cache:localStorage,
		data:{//default
			id:null,
			type:null,
			tpl:'emali',
		},
		datatype:'json',//默认json，自动检测
		type:'post',
		// by default function(data){return data;}
		dto:function(data){
			// data.Msg=data.return;
			// return data;
			return {
				id:		data.PID,
				name:	data.DisplayName,
			};
		},
		error:function(e){
			return '这是错误';
		},
		//有default参数就只会生成相应字段的dto
		default:{
			WorkExp:{},
			Counters:{
				CounterTask:0,
			},
		},
	});
});