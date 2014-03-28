define(['$','./var/_initedCache','blk/dom/var/_utilCache','blk/function/_id','blk/function/has_id','blk/function/shim_id','BL/Blink/_/main'], function ($,_initedCache,_utilCache,_id,has_id,shim_id) {

	//	
	//	[data-util="chzn"]	使用$().chzn()自动初始化；使用$().chzn_()或$().chznDestroy()反初始化
	//	
	//	初始化后更改属性 [data-destroy="chzn"]
	//	

	
	$.fn.init = function (s) {
		var util,ics;
		if(!s){
			this.each(function(){
				var me=$(this);
				if(util=me.data('util'))
					me.init(util);
				me.find('[data-util]').each(function(index, element) {
					if(util=$(this).data('util'))
						$(this).init(util);
				});
			});
		}else{
			if(typeof s=='string'){
				s=s.split(/\s|\,/g);
				for(var i=0,len=s.length;i<len;i++){
					ics=_initedCache[_id(this[0])] =_initedCache[_id(this[0])]||[];
					if(ics.indexOf(s[i])==-1){//过滤已初始化
						_utilCache[s[i]].call(this,this[0]);
						ics.push(s[i]);
						this.removeAttr('data-util');
					}
				}
			}
			
		}
		return this;
	}
	$.fn.destroy=function(s){
		var id,ics,index;
		if(s){
			id=has_id(this[0]);
			if(!id||!(ics=_initedCache[_id(this[0])])||!ics.length) return;
			if(typeof s=='string') s=s.split(/\s|\,/g);
			for(var i=0,len=s.length;i<len;i++){
				if((index=ics.indexOf(s[i]))!=-1){//过滤已反初始化
					_utilCache[s[i]+'_'].call(this,this[0]);
					ics.splice(index,1);
				}
			}
			if(ics.length==0){
				delete _initedCache[_id(this[0])];
				shim_id(this[0]);
			}
		}else{
			this.each(function(){
				var me=$(this),initeds;
				if(initeds=_initedCache[has_id(this)])
					me.destroy(initeds);
				me.find('[_id]').each(function(index, element) {
					if(initeds=_initedCache[has_id(this)])
						$(this).destroy(initeds);
				});
			});
		}
		return this;
	}
	

	function del(){
		
	}
	
	
	return $;
});
