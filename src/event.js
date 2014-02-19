define([], function() {
function EventManager(type){
	var h=this.handles={};
	this.events=type=type.split(',');
	type.forEach(function(it){
		h[it]={};
	})
};

EventManager.prototype={
	
	constructor:EventManager,
	bind:function(delegat,target,type,handle){
		var index;
		if(index=type.indexOf('.')){
			var namespace=type.substr(0,index);
			type=type.substr(index+1);
		}
		
	},
	unbind:function(delegat,target,type){},
	trigger:function(delegat,target,type){},
	
};




});
