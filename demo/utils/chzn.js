
//为初始化后的组件提供操作方法

G.Util({
	
	//自动初始化
	//不提供$$内部环境，仅提供两个参数
	
	'chzn':function(el,d){
		el.html('行了吗？');
	},
	
	'chzn-multi':function(el,d){
		
	},
	
},{
	
	
	chznSet:function(value){
		
		return this.each(function(el){
			if(!this.inited){
				//$(this).chosen();
				this.inited=true;
			}
			$(this).val(value).change()//.trigger('list:update');
		})
	},
	
	
	chznText:function(value){
		this.html(value+' --------<div data-util="chzn"></div>----chznText')//.trigger('list:update');
	},
	
	
	chznUpdate:function(value){
		//$(this).val(value).change().trigger('list:update');
	},
	
	
	
})





