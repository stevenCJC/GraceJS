

//抽象定义
G.Widget('paginglist',
	function(){
		this.PLObj={};//私有不公开的属性
	},{
		DataSet:{
			'LS:PLData':{},
			Count:0,
		},
		Subscribe:{
			PLinit:function(data){
				this.set(data.id,data.options);},
		},
		event:{
			'DS:change /PLData':function(){},
		}
	},{
		'#pl':function(s,options){
			this.PLObj[s]=new this['//base'](s,options);
			this.DS('Count',this.DS('Count')+1);
		},
	},{
		set:function(s,options){
			this.PLObj[s]=new this['//base'](s,options);
			this.DS('Count',this.DS('Count')+1);
			//this.DS('Count').set();
			//this.DS('Count').get();
			//this.DS('Count').remove();
			//this.DS('Count').push();
		},
		loadPage:function(s,options){
			if(this.PLObj[s])this.PLObj[s].loadPage(options);
			else this.publish('msg',{text:'木有这个OBJ哦！！',type:'fail'});
		},
	}
);

	