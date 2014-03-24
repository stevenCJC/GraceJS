define(["jquery"],
function($) {
	
	
	return {
		set:function(handle,callback,timing){
			if(arguments.length==2){
				timing=200;
			}
			var t=setInterval(function(){
				if(handle()){
					callback();
					clearInterval(t);
					t=null;
				}
			},timing);
		},
		
	}
	
})