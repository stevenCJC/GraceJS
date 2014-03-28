define(['$','./var/_initedCache','blk/dom/var/_utilCache','blk/function/_id','blk/function/has_id','blk/function/shim_id','BL/Blink/_/main'], function ($,_initedCache,_utilCache,_id,has_id,shim_id) {

	//	
	//	[data-util="chzn"]	使用$().chzn()自动初始化；使用$().chzn_()或$().chznDestroy()反初始化
	//	
	//	初始化后更改属性 [data-destroy="chzn"]
	//	

	
	$.fn.init = function (s) {
		var util,ics;
		var elems=this.find('[data-util]')
		if(this.attr('[data-util]')) this.add(elems);
		if(!s){
			this.each(function(){
				var me=$(this);
				if(s=me.data('util')){
					if(typeof s=='string') s=s.split(/\s|\,/g);
					ics=_initedCache[_id(this)] =_initedCache[_id(this)]||[];
					for(var i=0,len=s.length;i<len;i++){
						if(ics.indexOf(s[i])==-1){//过滤已初始化
							_utilCache[s[i]].call($(this),this);
							ics.push(s[i]);
						}
					}
				}
				this.removeAttribute('data-util');
			});
		}else{
			if(typeof s=='string') s=s.split(/\s|\,/g);
			this.each(function(){
				ics=_initedCache[_id(this)] =_initedCache[_id(this)]||[];
				for(var i=0,len=s.length;i<len;i++){
					if(ics.indexOf(s[i])==-1){//过滤已初始化
						_utilCache[s[i]].call($(this),this);
						ics.push(s[i]);
					}
				}
				this.removeAttribute('data-util');
			});
			
		}
		return this;
	}
	$.fn.destroy=function(s){
		var id,ics,index;
		var elems=this.find('[_id]')
		if(this.attr('[_id]')) this.add(elems);
		if(s){
			if(typeof s=='string') s=s.split(/\s|\,/g);
			for(var k=0,l=this.length;k<l;k++){
				id=has_id(this[k]);
				if(!id||!(ics=_initedCache[id])||!ics.length) return;
				for(var i=0,len=s.length;i<len;i++){
					if((index=ics.indexOf(s[i]))!=-1){//过滤已反初始化
						_utilCache[s[i]+'_'].call($(this[k]),this[k]);
						ics.splice(index,1);
					}
				}
				if(ics.length==0){
					delete _initedCache[id];
					shim_id(this[k]);
				}
			}
		}else{
			for(var k=0,l=this.length;k<l;k++){
				id=has_id(this[k]);
				if(!id||!(ics=_initedCache[id])||!ics.length) return;
				for(var i=0,len=ics.length;i<len;i++){
					_utilCache[ics[i]+'_'].call($(this[k]),this[k]);
				}
				delete _initedCache[id];
				shim_id(this[k]);
			}
			
		}
		return this;
	}
	

	
	
	return $;
});
