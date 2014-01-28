
	
	G.Extend('grace',{
		
		Page:function(path,cons,interface,init,proto){
			
			proto.TYPE='page';
			var p=this.page[path]=makeWidget.call(this,path,cons,interface,init,proto);
			//if(path.indexOf('/')==-1) 
			//	new p('DDDD');
		},
		
		
		
	});
	
	G.Extend('page',{
		init:function(path,p){
			var w=this.page[path];
			if(this.TYPE=='page'&&w&&this.PATH.split('/')[0]==path.split('/')[0])
				return new w(p);
		},
		
	})