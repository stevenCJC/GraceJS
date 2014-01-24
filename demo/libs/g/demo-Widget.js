//抽象定义
G.Widget('paginglist',
	function(id){
		this.PLObj={};//私有不公开的属性
	},{
		//this.dataset.Count
		//挂在当前对象
		//Page初始化可用，widget初始化时
		dataset:{
			'LS:PLData':{},
			Count:0,
		},
		//调用方式：由中介调用采用call的方式   this.subs_PLinit();
		//挂在当前对象
		//Page初始化可用
		subscribe:{
			PLinit:function(data){ this.set(data.id,data.options);},
		},
		//this.util_pagingList();
		//即时注册，不能通过util初始化当前对象，可以初始化其他对象
		//Page初始化可用
		util:{
			pagingList:function(el,p){
				this.PLObj[el.id]=new PL(el.id);
			},
		},
		//即时注册，先挂在当前对象，再进行事件绑定，事件函数带有当前对象指针
		event:{
			'DS:change /PLData':function(){},
			'click body@#{id} .pl':function(el,e,ds){},
			'click body@#{id} .pl':function(el,e,ds){},
		}
	},{
		set:function(s,options){
			this.PLObj[s]=new this['//base'](s,options);
			this.DS('Count',this.DS('Count')+1);
		},
		loadPage:function(s,options){
			if(this.PLObj[s])this.PLObj[s].loadPage(options);
			else this.publish('msg',{text:'木有这个OBJ哦！！',type:'fail'});
		},
		init:function(){
			this.bind('click body@#'+id,function(el,e,ds){
				
			});
			
		},
	}
);
