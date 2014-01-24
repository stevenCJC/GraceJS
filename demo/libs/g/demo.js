//抽象定义
G.Widget('paginglist',
	function(id){
		this.PLObj={};//私有不公开的属性
		this.id=id;
		this.init();
	},{
		dataset:['{id}',{
			Count:0,
		}],
		subscribe:{
			//订阅范围
			'PLinit{id}':'action',
		},
		util:{
			'util:PL':function(el,p){alert('util:PL!!!!');},
		},
		event:{
			'click body@#{id}':'clickThis',
		}
	},{
		loadPage:function(s,options){},
		init:function(){
			if(!this.$('#'+this.id).length)
				this.$('body').append('<button id="'+this.id+'">'+this.id+'</button>');
		},
		clickThis:function(el,e,ds){
			this.publish('PLinit'+this.id,this.id);
		},
		action:function(m){
			var d=this.DS('paginglist/'+this.id);
			var c=parseInt(d.get('Count'));
			d.set('Count',c+1);
			this.$('#'+m).chznText(c+1);
		}
	}
);
G.Page('header',
	function(id){
		this.PLObj={};//私有不公开的属性
		this.id=id;
		//this.init();
	},{
		dataset:['{id}',{
			Count:0,
		}],
		subscribe:{
			'PLinit{id}':'action',
		},
		util:{
			'util:PL':function(el,p){},
		},
		event:{
			'click body@#{id}':'clickThis',
		}
	},{
		'#{id}':function(el,ds){
			if(!el.length) this.$('body').append('<button id="'+this.id+'">'+this.id+'</button>');
		},
	},{
		loadPage:function(s,options){},
		init:function(){
			
		},
		clickThis:function(el,e,ds){
			this.publish('PLinit'+this.id,this.id);
		},
		action:function(m){
			var d=this.DS('header/'+this.id);
			var c=parseInt(d.get('Count'));
			d.set('Count',c+1);
			this.$('#'+m).chznText(c+1);
		}
	}
);

$(function(){
	
	var pl=G.newWidget('paginglist','DDDDDDDDDDDDD');
	var pl2=G.newPage('header','HHHHHHHHHHHHH');
})