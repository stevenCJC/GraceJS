define(['$','./var/_initedCache','blk/dom/var/_utilCache','blk/function/_id','BL/Blink/_/main'], function ($,_initedCache,_utilCache,_id) {

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
				var elems=this,el;
				for(var i=0,len=s.length;i<len;i++){
					for(var k=0,l=elems.length;k<l;k++){
						el=this[k];
						ics=_initedCache[_id(el)] =_initedCache[_id(el)]||[];
						if(ics.indexOf(s[i])==-1){//过滤已初始化
							_utilCache[s[i]].call($(el),el);
							ics.push(s[i]);
							$(el).removeAttr('data-util');
						}
					}
				}
			}
			
		}
		return this;
	}
	$.fn.destroy=function(s){
		s=s.split(/\s|\,/g);
		for(var i=0,len=s.length;i<len;i++){
			if(this[s[i]+'_'])this[s[i]+'_']();
		}
		return this;
	}
	

	function del(){
		
	}
	
	
	return $;
});
