
	
	G.Extend('grace',{
		//应用初始化启动程序
		//before 	初始化前执行函数
		//end		初始化后执行函数
		App:function(before,end){
			var p,x;
			before&&before();
			for(x in this.pages){
				if(x.indexOf('/')==-1){//仅对一级page进行初始化启动
					p=this.page[x];
					if(p) new p();//无传入参数
				}
			}
			end&&end();
	
		},
		
		
		
	});
	