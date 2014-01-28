
	
	G.Extend('grace',{
		
		App:function(pages,before,end){
			var that=this;
			document.addEventListener('readystatechange',function(e){
				if(document.readyState=="complete"){
					var p;
					before&&before();
					for(var i=0;i<pages.length;i++){
						p=that.page[pages[i]];
						if(p) new p('DDDD');
					}
					end&&end();
				}
			});
			
		},
		
		
		
	});
	