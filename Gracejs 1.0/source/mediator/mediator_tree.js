define(['function/getObjByPath','function/setObjByPath'], function(getObjByPath,setObjByPath) {
	function Mediator(){
		this.channels={};
	}
	
	Mediator.prototype={ 
		constructor:Mediator,
		publish:function(channel,message){
			//根据路径获取对象
			var cn=getObjByPath(channel,this.channels);
			if(!cn||!cn.channels||!cn.channels.length) return;
			var sbcr=cn.channels;
			var wdg;
			for(var i=0;i<sbcr.length;i++){
				sbcr[i](message);
			}
		},
		subscribe:function(channel,callback){
			//根据路径生成对象树
			var cn=getObjByPath(channel,this.channels);
			if(cn){
				cn=cn.channels||(cn.channels=[]);
				//将方法加入到监听数组
				cn.push(callback);
			}else setObjByPath(channel,this.channels,{channels:[callback]},1);
		},
	}
	return Mediator;
});