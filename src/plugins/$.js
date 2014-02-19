define(["./core",'engine/Engine','jquery','./engine'], function(G,Engine,$) {
G.Engine({
	
	$:function(s){
		this.core=$(s);
		this.z_freshCore();
		return this;
	},
	
	end:function(){
		this.core=this.core.end();
		this.z_freshCore();
		return this;
	},
		

	
	off:function(){return this;},
	
	each:function(func){
		this.core.each(function(){
			func(new Engine(this));
		});
		return this;
	},
	
	html:function(t,utils){
		this.core.html(t);
		utils&&this.util(utils);
		return this;
	},
	
	
	
},{
	
	extend:function(data){
		for(var x in data)
			(function(name,func){
				Engine.prototype[name]=func;
			})(x,data[x]);
	},
	
});




/*设定GraceJS内部使用方法*/
var enginePrototype=['find','val','text','remove','css','attr','addClass','data','on','append'];
var m
while(m=enginePrototype.pop()) (function(m){
	//绑定底层库方法
	Engine.prototype[m]=function(){
		//调用底层库方法，apply效率可能不够高
		var d=this.core[m].apply(this.core,arguments);
		if(typeof d=='undefined')return this;
		//如果返回底层库对象，则返回G.$对象
		if(this.core.constructor==d.constructor) return this;
		//否则返回数据
		else return d;
	};
})(m);
	
	
	
});	


	
	







