

G.Util({
	
	//使用data-util进行初始化
	'util:chzn':function(el,p){},
	'util:chzn-multi':function(el,p){},
	
},{
	
	//为初始化后的组件提供操作方法
	chznSet:function(value){
		//这里使用底层库实现代码
		if(!this.inited){
			//$(this).chosen();
			this.inited=true;
		}
		$(this).val(value).change()//.trigger('list:update');
	},
	chznText:function(value){
		$(this).text(value+' ------------chznText')//.trigger('list:update');
	},
	chznUpdate:function(value){
		//这里使用底层库实现代码
		//$(this).val(value).change().trigger('list:update');
	},
	
	
	
})





