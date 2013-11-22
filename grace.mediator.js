(function(G){
	
	
	function Mediator(){
		this.channels={};
	}
	
	Mediator.prototype={
		constructor:Mediator,
		publish:function(channel,message){
			var sbcr=this.channels[channel];
			var wdg;
			for(var i=0;i<sbcr.length;i++){
				wdg=G['_Widgets'][sbcr[i]];//找到被订阅对象
				wdg['_Subscr'][channel].apply(wdg,message);
			}
		},
		subscribe:function(subscriber,channel){
			var cn=this.channels[channel]||(this.channels[channel]=[]);
			cn.push(subscriber);
		},
	}
	
	
	G['_Mediator']=new Mediator();
	
	
	//唯一对外的方法
	G.publish=function(channel,message){
		G['_Mediator'].publish(channel,message);
	}
	
})(G)


