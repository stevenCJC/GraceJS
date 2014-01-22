(function(G){
	
	function Widgets(){
		this.widgets={};
		this.current;
	}
	
	
	Widgets.prototype={
		constructor:Widgets,
		load:function(namespace,callback){
			this.current=namespace;
			callback&&callback();
			var that=this;
			return {
				init:function(){
					that.init();
				}
			};
		},
		init:function(namespace,callback){
			this.current=namespace||this.current;
			this.widgets[this.current]=G['_Assembler'](this.current);//组装
			this.widgets[this.current]['_Init']();//执行初始化
			callback&&callback.apply(this.widgets[this.current]);
			return this.widgets[this.current];
		},
		get:function(namespace){
			return this.widgets[this.current];
		},
		
	};
	
	G['_Widgets']=new Widgets();
	G.Widgets={};
	G.Widgets.Load=function(namespace,callback){
		return G['_Widgets'].load(namespace,callback);
	}
	G.Widgets.Init=function(namespace,callback){
		G['_Widgets'].init(namespace,callback);
	}
	G.Widgets.get=function(namespace){
		return G['_Widgets'].get(namespace);
	}
	
	
	
	//加载+启动,目前只做启动，相应documentReady事件
	document.addEventListener('DOMContentLoaded',function(){
		
		
		
	});
	
	
	
	
})(window.G||G)