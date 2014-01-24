G.Extend('grace',{
	
	Engine:function(proto,extend){
		for(var x in proto) Engine.prototype[x]=proto[x];
		for(var x in extend) $$[x]=extend[x];
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
	
	
	
},{
	dataUtils:{},
})





