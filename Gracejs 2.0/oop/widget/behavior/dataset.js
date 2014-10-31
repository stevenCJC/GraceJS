define(['./core','_','function/fixPath','engine/$$','function/makeWidget','function/deepClone','oop/baseClass'], function(G,_,fixPath,$$,makeWidget,deepClone,baseClass) {
	
	
	
	

	//widget page 行为扩展
	//是否应该考虑吧初始化行为也提到这里来
	G.Extend('widget/behavior,page/behavior',{
		
		//数据岛行为扩展
		dataset:[function(path,dataset,root){
			var DS=root.DS;
			dataset=deepClone(dataset);
			if(dataset.constructor==Array) {
				dataset[0]=fixPath(dataset[0],this);
				DS.initData(path+'/'+dataset[0],dataset[1]);
			}else{
				DS.initData(path,dataset);
			}
		},function(){
			
		}],
		
		
		
	})
	
	return G;
});