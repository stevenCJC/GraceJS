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
			'PLinit{id}':'action',
		},
		util:{
			pagingList:function(el,p){},
		},
		event:{
			'click body@#{id}':'clickThis',
		}
	},{
		loadPage:function(s,options){},
		init:function(){
			if(!this.$('#'+this.id).length) this.$('body').append('<button id="'+this.id+'">'+this.id+'</button>');
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


G.$(function(){
	
	var pl=G.newWidget('paginglist','DDDDDDDDDDDDD');
	var pl2=G.newWidget('paginglist','FFFFFFFFFFFF');
})