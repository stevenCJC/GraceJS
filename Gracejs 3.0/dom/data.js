define(['$','./var/_attrCache','./var/_propCache','blk/function/_id','blk/function/has_id','blk/function/shim_id','BL/_/main'], function ($,_attrCache,_propCache,_id,has_id,shim_id) {

	$.extend({
		attr: function(attr, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;            
			if (value === undefined && !$.isObject(attr)) {
				id=has_id(this[0]);
				return (id&&_attrCache[id]&&_attrCache[id][attr])?_attrCache[id][attr]:this[0].getAttribute(attr);
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				id=has_id(this[i]);
				el=this[i];
				if ($.isObject(attr)) {
					for (var key in attr) {
						$(el).attr(key,attr[key]);
					}
				}
				else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
				{
					
					if(!id)
						id=_id(el);
					
					if(!_attrCache[id])
						_attrCache[id]={}
					_attrCache[id][attr]=value;
				}
				else if (value == null && value !== undefined)
				{
					el.removeAttribute(attr);
					if(id) _attrCache[id][attr];
						delete _attrCache[id][attr];
					shim_id(el);
				}
				else{
					el.setAttribute(attr, value);
				}
			}
			return this;
		},
		
		removeAttr: function(attr) {
			var attrs=attr.split(/\s+|\,/g),el,at,id;
			for (var i = 0,len=this.length; i <len ; i++) {
				el=this[i];
				id=has_id(el);
				if(!id) continue;
				for(var j=0,lem=attrs.length;j<lem;j++){
					at=attrs[j];
					el.removeAttribute(at);
					if(id&&_attrCache[id]&&_attrCache[id][at])
						delete _attrCache[id][at];
				}
				shim_id(el);
			}
			return this;
		},

		
		prop: function(prop, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;          
			if (value === undefined && !$.isObject(prop)) {
				
				var res;id=has_id(this[0]);
				var val = (id&&_propCache[id][prop])?(id&&_propCache[id][prop]):!(res=this[0][prop])&&prop in this[0]?this[0][prop]:res;
				return val;
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				
				el=this[i];
				id=has_id(el);
				
				if ($.isObject(prop)) {
					for (var key in prop) {
						$(el).prop(key,prop[key]);
					}
				}
				else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
				{
					
					if(!id)
						id=_id(el);
					
					if(!_propCache[id])
						_propCache[id]={}
					_propCache[id][prop]=value;
				}
				else if (value == null && value !== undefined)
				{
					$(el).removeProp(prop);
					if(id) _propCache[id][prop];
						delete _propCache[id][prop];
					shim_id(el);
				}
				else{
					el[prop]= value;
				}
			}
			return this;
		},
		
		removeProp: function(prop) {
			var p=prop.split(/\s+|\,/g),el,pr,id;
			for (var i = 0,len=this.length; i <len ; i++) {
				el=this[i];
				id=has_id(el);
				if(!id) continue;
				for (var j = 0,lem=p.length; j <lem ; j++) {
					pr=p[j];
					if(el[pr])
						delete el[pr];
					if(id&&_propCache[id]&&_propCache[id][pr]){
							delete _propCache[id][pr];
					}
				}
				shim_id(el);
			}
			return this;
		},


	
		
		parseForm: function() {
			if (this.length == 0)
				return "";
			var params = {},elems,elem,type,tmp;
			for (var i = 0,len=this.length; i <len ; i++) {
				if(elems= this[i].elements){
					for(var j=0,lem=elems.length;j<lem;j++){
						elem=elems[j];
						type = elem.getAttribute("type");
						if (elem.nodeName.toLowerCase() != "fieldset" && !elem.disabled && type != "submit" 
						&& type != "reset" && type != "button" && ((type != "radio" && type != "checkbox") || elem.checked))
						{

							if(elem.getAttribute("name")){
								if(elem.type=="select-multiple"){
									tmp=params[elem.getAttribute("name")]=[];
									for(var j=0;j<elem.options.length;j++){
										if(elem.options[j].selected)
											tmp.push(elem.options[j].value);
									}
								}
								else
									params[elem.getAttribute("name")]=elem.value;
							}
						}
					}
				}
			}
			return params;
		},

		val: function(value) {
			if (this.length === 0)
				return (value === undefined) ? undefined : this;
			if (value == undefined)
				return this[0].value;
			for (var i = 0,len=this.length; i <len ; i++) {
				this[i].value = value;
			}
			return this;
		},
		
		
		data: function(key, value) {
			return this.attr('data-' + key, value);
		},
		

		_id:function(make){
			if(make)return _id(this[0]);
			return has_id(this[0]);
		},
		
		clean:function(){
			$.clean(this);
		},


	});
	return $;
});
