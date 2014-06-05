define(['model/Model'],function(Model) {

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
		this.baseUrl={
			'~':'http://127.0.0.1:8081/',
			'^':'http://127.0.0.1:8081/',
		};
		/*
			0 : 非debug状态
			1 ： url请求出错会自动跳转到debug请求debug数据
			2 ： 直接跳转到debug请求debug数据
		*/
		this.debug=1;
		
	}
	
	Models.prototype={
		constructor:Models,
		get:function(name){
			return this.models[name];
		},
		add:function(name,options){
			
			if(['get','add','remove'].indexOf(name)>-1) throw new Error('illegal Model Name .');
			options.url=options.url.replace(/\~/,this.baseUrl['~']);
			
			if(this.debug&&options.debug) options.debug=options.debug.replace(/\^/,this.baseUrl['^']);
			else delete options.debug;
			
			if(this.debug==2) delete options.url;
			
			this[name]=new Model(options,this.debug);
		},
		remove:function(name){
			
		},
	};
	
	return Models;
	
});