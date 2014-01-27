
	
	G.Extend('grace',{
		
		Page:function(path,cons,interface,init,proto){
			
			var p=this.page[path]=makeWidget.call(this,path,cons,interface,init,proto);
			
			if(path.indexOf('/')==-1) 
				new p();
			
		},
		
		newPage:function(path,p){
			var w=new this.page[path](p);
			return w;
		},
		
	});
	