define(['./core','_','function/fixPath','engine/$$','function/makeWidget','function/deepClone','oop/baseClass'], function(G,_,fixPath,$$,makeWidget,deepClone,baseClass) {

	G.Extend('widget/behavior,page/behavior',{

		//util行为扩展，以冒号区分两种util扩展
		util:[function(path,utils,root){
			var func={},util={};
			for(var x in utils){
				x=fixPath(x,this);//为了少用一个for循环
				if(x.indexOf(':')>-1) util[x]=utils[x];//如果有冒号，则表示为dom驱动初始化
				else func[x]=utils[x];//没有冒号表示添加prototype方法扩展
			}
			//调用util扩展方法
			G.Util(util,func);
		},function(path,util,proto){
			
		}],

		
		
	})


	return G;
});