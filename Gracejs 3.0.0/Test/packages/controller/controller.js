Controller('pkgName',['pkgDeps1,pkgDeps2'],function(C,G){


		C('ControllerName',function init(){
			
			var sView=this.View('pkg.SthClass',options);
			var sCtrl=this.Ctrl('pkg.SthClass');
			
			//绑定model事件
			var model=this.Model('pkg.SthClass');
			
			// trigger 控制对外暴露的动作
			
			model.bind('load',function(data){
				sView.trigger('loadList',data);
			});
			
			model.bind('/*/ActivityCode',function(n,o){
				sView.trigger('ActivityCodeChange',n);
			});
			
			sView.
			//绑定属性
			sView.bind('pagingIndex',function(index){
				model.trigger('fetch',{pageIndex:index});
			});
			
			sView.bind('SidebarStatus',function(index){
				// this // 反映出 sView的所有的状态数据
				C.publish('SidebarClosed',this.listData);
			});
			
			
			model.fetch({AID:123321});
			
			
			
			this.Load('pkgName',function(pkg){
				
			});
			this.publish('');
			
		},{
			
			
		},{
			
			
		});
	
	
	
});

