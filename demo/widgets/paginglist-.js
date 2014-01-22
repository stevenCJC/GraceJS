

//抽象定义
G.Widget('paginglist',
	function(){
		this.PLObj={};//私有不公开的属性
	},
	
	
	{
		//定义对外接口
		//只有DS反映控件的数据状态
		//只有方法订阅的方式进行方法交互
		//实现了插件直接访问的隔离
		//不支持数据访问接口定义
		
		DataSet:{
			'LS:PLData':{},
			Count:0,
		},
		Subscribe:{
			PLinit:function(data){
				this.set(data.id,data.options);
			},
			PLload:function(data){
				this.loadPage(data.id,data.options);
			},
			PLsetTpl:function(data){
				if(this.PLObj[data.id])this.PLObj[data.id].setTpl(data.url);
				else this.publish('msg',{text:'木有这个OBJ哦！！',type:'fail'});
			},
			PLdestroy:function(s){
				this[s].destroy();
			},
			
		},
		event:{
			
			'DS:change /PLData':function(){
				
			},
		}
	},
	{
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

G.Widget('paginglist/base',
	function(id,options){
		var $el=s||"[data-paginglist]";
		this.options={
			pagingSize:null,
			api:null,
			requestData:{},
			tplUrl:null,
			onRequest:function($this,requestForm){},
			onPageChange:function($this,currentPage,originalEvent){},
			onDataReady:function($this,json,requestData){return json;},
			onRendered:function($this){},
			onError:function($this,e){},
			listData:null,
			loadPage:-1,
		};
		this.id=id;
		
		this['/'].PLObj[id]=this;
		
		
	},{
		subscribe:{
			'click #{id}@.paging a':function(el,e,data){
				
			},
			'DS:change paginglist/PLData/Count':function(n){
				if(n>100) this.publish('msg',{text:'太多对象了吧！'})
			},
			'DS:change paginglist/PLData/{id}/value/':function(data){//返回一个 list item ， id为动态实时数据
				
			}
		}
	},{
		
		pagination:function(){
			var that=this;
			$(this.$el).find('.PL-pagination').each(function(index, element) {
				$(this).bootstrapPaginator({
					currentPage: 	that.options.requestData.currentPage+1,
					totalPages: 	that.options.requestData.pageCount,
					numberOfPages:	that.options.pagingSize,
					onPageClicked: 	function(e,originalEvent,type,currentPage){
						that.options.requestData.forNoCache=Math.random();
						that.options.requestData.currentPage=currentPage-1;
						that.options.onPageChange($(that.$el),that.options.requestData.currentPage);
						that.loadPage(that.options.requestData.currentPage);
					},
					itemTexts: function (type, page, current) {
						switch (type) {
						case "first":
							return "First";
						case "prev":
							return "&lt;&lt;";
						case "next":
							return "&gt;&gt;";
						case "last":
							return "Last (<b>"+that.options.requestData.pageCount+"</b>)";
						case "page":
							return page;
						}
					},
				});
			});
		},
		loadPage:function(index){
			if(!isNaN(index)||isNaN(index)&&!index){
				var that=this;
				if(!isNaN(index))this.options.requestData.currentPage=index;
				this.options.onRequest($(this.$el),this.options.requestData);
				
				try{
				$.post(this.options.api,this.options.requestData,function(json){
					//msg.success('数据请求用时：'+((new Date()).getTime()-t)/1000+'s');
					try{
					json=JSON.parse(json);
					if(json.return===false) 
						throw new Error(json.message);
					}catch(e){
						tips.hide();
						that.options.onError($(that.$el),e);
						return;
					}
					this.DS[''];
					json=(function(){
						var j=that.options.onDataReady($(that.$el),json,that.options.requestData);
						if(typeof j=='undefined') return json;
						else return j;
					})();
					that.options.listData=null;
					that.options.listData=json;
					that.options.requestData.pageCount=json.pageCount;
					that.pagination();
					that.list();
					//msg.success('总用时：'+((new Date()).getTime()-t)/1000+'s');
				})
				}catch(e){
					tips.hide();
					return;
				}
			}else if(index.constructor==Object){
				this.options.requestData.currentPage=0;
				var json=index;
				var that=this;
				//可能出错 this that
				json=(function(){
					var j=that.options.onDataReady($(that.$el),json,that.options.requestData);
					if(typeof j=='undefined') return json;
					else return j;
				})();
				this.options.listData=json;
				this.options.requestData.pageCount=json.pageCount;
				this.pagination();
				this.list();
			}
		},
		list:function(){
			var listData=this.options.listData;
			var that=this;
			
			//var t=(new Date()).getTime();
			
			$(this.$el).find(".PL-list")[0].innerHTML='';
			
			/*var c=$(this.$el).find(".PL-list").find('*');
			c.each(function(index, element) {
				$(this).off();
				$(this).removeData();
				$(this).removeAttr();
				$(this).remove();
			});*/
			
			
			if(!this.template){
				try{
					$.get(this.options.tplUrl,function(tpl){
						that.template=_.template(tpl);
						
						var h=that.template(listData);
						$(that.$el).find(".PL-list").html(h);
						
						that.options.onRendered($(that.$el),listData);
						
					});
				}catch(e){
					tips.hide();
					that.options.onError($(that.$el),e);
				}
			}else{
				try{
					
					$(this.$el).find(".PL-list").html(this.template(listData));
					
					
				}catch(e){
					tips.hide();
					that.options.onError($(that.$el),e);
					return;
				}
				this.options.onRendered($(that.$el),listData);
			}
			
			
			
			//msg.success('列表生成及初始化用时：'+((new Date()).getTime()-t)/1000+'s');
			
			
			
		},
		
		breakList:function(index){
			
		},
		
		setTpl:function(tplUrl,notLoadPage){
			this.options.tplUrl=tplUrl;
			this.template=null;
			if(!notLoadPage) this.list();
		},
		getListData:function(){
			return this.options.listData;
		},
		
		
	});
	