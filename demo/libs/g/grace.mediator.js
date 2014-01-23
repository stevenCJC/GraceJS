
	function Mediator(){
		this.channels={};
	}
	
	Mediator.prototype={
		constructor:Mediator,
		publish:function(channel,message){
			var cn=getObjByPath(channel,this.channels,1);
			if(!cn.channels||!cn.channels.length)return;
			var sbcr=cn.channels;
			var wdg;
			for(var i=0;i<sbcr.length;i++){
				sbcr[i](message);
			}
		},
		subscribe:function(channel,callback){
			var cn=getObjByPath(channel,this.channels,1);
			cn=cn.channels||(cn.channels=[]);
			cn.push(callback);
		},
	}
