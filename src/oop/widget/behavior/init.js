define(['./core','_','function/fixPath','engine/$$','function/makeWidget','function/deepClone','oop/baseClass'], function(G,_,fixPath,$$,makeWidget,deepClone,baseClass) {

	G.Extend('widget/behavior,page/behavior',{

		init:[function(path,init,root){
			for(var x in init) {
				if(init[x].constructor==String){
					runPageInit(this,fixPath(x,this),this[init[x]]);
				}else
					runPageInit(this,fixPath(x,this),init[x]);
			}
		},function(path,init,root){
		}],
		
	});




	
	//插件构造函数执行后就跑初始化程序
	function runPageInit(that,x,callback){
		
		if(x.indexOf(':')>-1){
			var index=x.indexOf(':');
			var type=x.substr(0,index);//获得key解析类型
			var target=x.substr(index+1);//获得key解析对象
			var init=G.extend[that.TYPE+'/behavior/init'][type];//从扩展获得处理方式
			if(init) init(that,target,callback);//如果存在就执行
			else G.extend[that.TYPE+'/behavior/init']['dom'](that,x,callback);//否则默认当做dom方式处理
		}else{
			G.extend[that.TYPE+'/behavior/init']['dom'](that,x,callback);//按照dom方式处理
		}
		
		
	}
	
	return G;
});