
	
	G.Extend('grace',{
		
		App:function(before,end){
			var p;
			before&&before();
			for(var i=0,len=this.pages.length;i<len;i++){
				p=this.page[pages[i]];
				if(p) new p('DDDD');
			}
			end&&end();
	
		},
		
		
		
	});
	