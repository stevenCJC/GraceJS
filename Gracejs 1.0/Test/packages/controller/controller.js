require(['Grace','pkgDeps1','pkgDeps2','utils/chzn'],function(G){
	G('pkgName','pkgDeps1,pkgDeps2',function(pkg,_){
	
	
	
		pkg.Controller('CtrlName',function init(){
			
			var v1=this.View('viewName',options);
			//异步
			this.Model('noteList',{AID:12222},function(data){
				//do someThing async
			});
			//同步
			var listData=this.Model('noteList',{AID:12222});
			
			this.publish('noteListDownloaded',listData);
			
			new this.View.Navbar();
			new pkg.C.CtrlName1();
			
			
			
		},{
			
			
		},{
			
			
		});
		
		
		
		
		
		
		
		
		
		
		

	});
	
	
});

