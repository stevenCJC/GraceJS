G.Extend('grace',{
	
	Engine:function(proto,extend){
		if(proto)for(var x in proto) Engine.prototype[x]=proto[x];
		if(extend)for(var x in extend) $$[x]=extend[x];
	},
	
})



$$=function(s){
	return new Engine(s);
};

function Engine(s){
	this.core=null;
	this.length=0;
	this.$(s);
}



G.Engine({
	z_freshCore:function(){
		var i=0;
		var core=this.core;
		while(core[i]){this[i]=core[i];i++;}
		this.length=core.length;
	},
})

















