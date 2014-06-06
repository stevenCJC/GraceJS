define(['model/Model','Config'],function(Model,Config) {

	/*
		解决问题： 
				1、解耦前后端字段对应问题
				2、方便转换字段名
				3、提供默认数据
				4、数据事件绑定
				5、便捷调用
	*/
	// 支持 ~/ 相对根目录，-/ 相对资源目录
	/*options={
		url:'~/',
		debug:'',
		data:{
			id:null,
			type:null,
			tpl:'emali',
		},
		dataConver:{
			id:'PID',
			type:'Type',
		},
		datatype:'json',
		type:'post',
		onSend:function(xhr){
			var data=xhr.data;
			var url=xhr.url;
			data.ID=data.id;
			data.Type=data.type;
		},
		
		//浅转换，子节点由NODE方法转换
		conver:{
			workexp:'WorkExp',
			counter:{
				name:'Counters',
				node:function(node,data){
					return node;
				},
			},
			value:{
				name:'Items',
				conver:{
					PID:'id',
					DisplayName:'Name',
				}
			}
		},
		
		default:{
			WorkExp:{},
			Counters:{
				CounterTask:0,
			},
		},
		
	}*/
	
	function Models(){
		
	}
	
	Models.prototype={
		constructor:Models,
		get:function(name){
			return this.models[name];
		},
		extend:function(name,options){
			if(arguments.length==2){
				
				if(['get','add','remove'].indexOf(name)>-1) throw new Error('illegal Model Name .');
				
				if(Config.path[options.url[0]])
					options.url=options.url.replace(options.url[0],Config.path[options.url[0]]);
				
				if(Config.debug&&options.debug&&Config.path[options.debug[0]]) options.debug=options.debug.replace(options.debug[0],Config.path[options.debug[0]]);
				else delete options.debug;
				
				if(Config.debug==2) delete options.url;
				
				if(!name) return new Model(options);
				
				this[name]=new Model(options);
				return this[name];
			}else if(arguments.length==1){
				if(arguments[0].constructor==Object) return new Model(options);
				else if(arguments[0].constructor==String) return this[name];
			}
		},
		remove:function(name){
			
		},
	};
	
	return Models;
	
});