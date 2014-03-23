define(['./core','_','function/fixPath','engine/$$','function/makeWidget','function/deepClone','oop/baseClass'], function(G,_,fixPath,$$,makeWidget,deepClone,baseClass) {

	G.Extend('widget/behavior,page/behavior',{

		//util行为扩展，以冒号区分两种util扩展
		util:[function(path,util,root){
			utils(util,this);
		},function(path,util,proto){
			
		}],

		
		
	})
	

	
	//初始化utils
	function utils(d,that){
		var func={},util={};
		for(var x in d){
			x=fixPath(x,that);//为了少用一个for循环
			if(x.indexOf(':')>-1) util[x]=d[x];//如果有冒号，则表示为dom驱动初始化
			else func[x]=d[x];//没有冒号表示添加prototype方法扩展
		}
		//调用util扩展方法
		G.Util(util,func);
	}

	return G;
});