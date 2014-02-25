define(['grace','jquery'],function(G,$){
	G.Widget('paginglist',
		function(id){
			this.PLObj={};//私有不公开的属性
			this.id=id;
			//this.init();
		},{
			dataset:['{id}',{
				Count:0,
			}],
			subscribe:{
				//订阅范围
				'PLinit{id}':'action',
				init:function(m){
					$('#'+this.id).html($('#'+this.id).html()+m);
				},
			},
			util:{
				'util:PL':function(el,p){alert('util:PL!!!!');},
			},
			event:{
				//'click body@#{id}':'clickThis',
			}
		},{
			loadPage:function(s,options){},
			init:function(){
				if(!this.$('#'+this.id).length)
					this.$('body').append('<br/><a  id="'+this.id+'" href="#PLinit'+this.id+':'+this.id+'/init:OK?????">'+this.id+'</a>');
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

});