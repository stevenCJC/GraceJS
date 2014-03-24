define(['./core','_','function/fixPath','engine/$$','function/makeWidget','function/deepClone','oop/baseClass'], function(G,_,fixPath,$$,makeWidget,deepClone,baseClass) {

	


	G.Extend('widget/behavior,page/behavior',{

		//事件绑定扩展
		//考虑做成独立的内部事件绑定机制，不依赖jquery的事件绑定机制
		event:[function(path,event,root){
			for(var x in event) bind(this,x);
		},function(path,event,proto){
			for(var x in event) proto['zzE_'+x]=event[x];
		}],
		
		
		
	})



	
	//事件函数绑定执行
	function bind(that,path){
		var key='zzE_'+path;
		if(that[key].constructor==String)key=that[key];
		
		path=fixPath(path,that);
		
		var index=path.indexOf(' ');
		var index2=path.indexOf(':');
		
		if(index>0&&(index2>0&&index<index2||index2==-1)){//冒号在后面或者没有冒号，一定有空格，默认为常规dom事件处理方式
			var type="dom";
		}else if(index2>0&&(index>0&&index2<index||index==-1)){//冒号在前面或者没有空格，一定有冒号，分析为其他事件处理方式
			var type=path.substr(0,index2);//也可能是dom方式
			var path=path.substr(index2+1);
		}
		G.extend[that.TYPE+'/behavior/event'][type](that,path,key);
		
	}

	
	return G;
});