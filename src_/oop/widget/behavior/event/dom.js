	
	G.Extend('widget/behavior/event,page/behavior/event',{
		//常规dom事件绑定实现方法
		//that	事件绑定相关对象
		//path	事件绑定指令
		//key	事件函数对应的prototype键
		dom:function(that,path,key){
			var index=path.indexOf(' ');
			var etype=path.substr(0,index);
			var dom=path.substr(index+1).split('@');//
			//如果dom事件有委托
			if(dom.length==2)
				$$(dom[0]).on(etype,dom[1],function(e){
					that[key]($$(this),e);
				});
			else if(dom.length==1)//如果dom事件没有委托
				$$(dom[0]).on(etype,function(e){
					that[key]($$(this),e);
				});
		},
	})
