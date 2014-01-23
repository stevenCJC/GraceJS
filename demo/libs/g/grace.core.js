/*


	$			定义
	util		定义
	widget		定义
	page		定义
	page init	执行


*/

	function Grace(){
		this.widget={};
		this.extend={widget:{},page:{}};
		this.DS=new DataSet();
		this.MD=new Mediator();
	}
	
	Grace.prototype={
		
		Widget:function(path,cons,inte,func){
			
			
			
			var DS=this.DS;
			var root=this;
			function Widget(){
				cons.apply(this,arguments);
				DS.initData(path,inte.dataset,this);
				for(var x in inte.event) bind(this,x);
				for(var x in inte.subscribe) subscribe(this,x);
			}
			
			
			
			
			
			func.PATH=path;
			var extend=this.extend.widget;
			for(var x in extend) func[x]=extend[x];
			for(var x in inte.event) func['zzE_'+x]=inte.event[x];
			for(var x in inte.subscribe) func['zzS_'+x]=inte.subscribe[x];
			
			var w=this.widget[path]=Compose(Widget,func);
			
			
			
			
		},
		
		newWidget:function(path,p){
			var w=new this.widget[path](p);
			return w;
		},
		
		
		Page:function(){},
		Util:function(domUtils,funcUtils){
			G.$.extend(funcUtils);
		},
		
		Extend:function(target,ex){
			var extend=this.extend[target];
			if(!extend)throw new Error('You can not extend the target '+target);
			for(var x in ex){
				extend[x]=ex[x];
			}
		},
		
	}
	
	G=new Grace();
	
	G.Extend('widget',{
		DS:function(path){
			return G.DS.getDS(path);
		},
		$:function(s){return new $Engine(s);},
		
		publish:function(channel,message){
			if(message)G.MD.publish(channel,message);
			else G.MD.publish(channel);
		},
		
	})
	
	
	function subscribe(that,path){
		var srcPath=path;
		path=path.replace(/(^\s*)|(\s*$)/g,'').replace(/\{.*?\}/ig,function(m){
			return that[m.replace(/\{|\}/ig,'')];
		});
		var key='zzS_'+srcPath;
		if(that[key].constructor==String) key=that[key];
		G.MD.subscribe(path,function(message){
			that[key](message);
		});
	}
	
	function bind(that,path){
		var srcPath=path;
		path=path.replace(/(^\s*)|(\s*$)/g,'').replace(/\{.*?\}/ig,function(m){
			return that[m.replace(/\{|\}/ig,'')];
		});
		var index=path.indexOf(' ');
		var type=path.substr(0,index);
		var dom=path.substr(index+1).split('@');
		var $el=G.$(dom[0]);
		
		$el.on(type,dom[1],function(e){
			var key='zzE_'+srcPath;
			if(that[key].constructor==String)key=that[key];
			that[key](G.$(this),e);
		});
		
	}
	


