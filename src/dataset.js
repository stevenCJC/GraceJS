
	//DataSet管理类，无依赖
	
	function DataSet(){
		//数据岛的数据树
		this.dataset={};
		//数据事件把柄
		this.handlers={};
	}
	
	DataSet.prototype={
		//path:	路径
		//ds:	数据
		//that:	数据源对象
		initData:function(path,ds){
			if(ds){
				ds=clone(ds);//深克隆
				var dso= getObjByPath(path,this.dataset,1);//获得对象，强制生成
				if(ds.constructor==Array) {
					//如果是数组，说明对象是可以初始化多个实例，影响也有所区别，所以需要解析路径，此处应该把路径的解析独立处理
					dso[ds[0]]=ds[1];
				}else if(ds.constructor==Object){
					//如果是对象，即只需初始化一个实例即可
					for(var x in ds)if(ds.hasOwnProperty(x)) dso[x]=ds[x];
				}
			}
		},
		getDS:function(path){
			//返回新的数据树节点实例
			return new DS(path,this.dataset);
		},
		//Dataset事件触发
		trigger:function(path,type,newData,oldData){
			
		},
	}
	
	
	
	