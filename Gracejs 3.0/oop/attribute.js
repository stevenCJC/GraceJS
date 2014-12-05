define(['g','_/is'], function (g) {

	var attribute = {
		
		_attrInit:function(configs){
			if(this._attrsInited) return ;
			this.attrs={};
			for(var x in this.Attrs) this.attrs[x] = this.Attrs[x];
			for(var x in configs) {
				this.attrs[x] = configs[x];
			}
			this._attrsInited=true;
		},
		get:function(key){
			var attr=this.attrs[key];
			if(attr&&attr.getter) {
				attr.value=attr.getter.call(this,key);
				return attr.value;
			}else return attr;
		},
		set:function(map,value,silent){
			if(arguments.length==2){
				setValue(map,value,this,silent);
			}else{
				if(g.is.object(map)){
					for (var x in map) setValue(x,map[x],this,silent);
				}
			}
		},
		
		change:function(key){
			setValue(key,this.attrs[key],this);
		},
	};
	
	function setValue(key,newValue,instance,silent){
		var old;
		if(instance.attrs[key]&&instance.attrs[key].setter){
			old=instance.attrs[key].value;
			instance.attrs[key].setter.call(instance,newValue,old,key);
			instance.attrs[key].value=newValue;
		}else{
			old=instance.attrs[key];
			instance.attrs[key]=newValue;
		}
		!silent&&instance.trigger('change:'+key,{
			type:'change:'+key,
			target:key,
			newValue:newValue,
			oldValue:old,
			instance:instance,
		})
	}
	
	
	return attribute;

});
