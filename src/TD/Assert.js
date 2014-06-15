define([],
function() {
	
	
	var defaultTips={
		ok:'',
		
	};
	
	function Assert(){
		
	}
	
	Assert.prototype={
		
		constructor:Assert,
		//大致等于,是Object对象就直接stringify进行字符串对比
		ok:function(ac,msg){
			msg=msg||defaultTips.ok;
			if(ac) ;
		},
		sa:function(ac,ex,msg){},
		//严格等于,是Object对象就比较每个属性绝对相等
		eq:function(ac,ex,msg){
			
		},
		//类型判断
		type:function(val,type,msg){
			
		},
		
		//调用外部测试模块
		call:function(name,until){
			
			switch(until.constructor){
				case Number:
				setTimeout()
				break;
				case Function:
				break;
			}
			
		},
		
		
	};
	
	
	
})