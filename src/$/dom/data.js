
	$.fn = Core.prototype = {



		
		attr: function(attr, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;            
			if (value === undefined && !$.isObject(attr)) {
				id=has_id(this.elems[0]);
				return (id&&_attrCache[id][attr])?_attrCache[id][attr]:this.elems[0].getAttribute(attr);
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				id=has_id(this.elems[i]);
				el=this.elems[i];
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
				el=this.elems[i];
				id=has_id(el);
				for(var j=0,lem=attrs.length;j<lem;j++){
					at=attrs[j];
					el.removeAttribute(at);
					if(id&&_attrCache[id][at])
						delete _attrCache[id][at];
				}
			}
			return this;
		},

		
		prop: function(prop, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;          
			if (value === undefined && !$.isObject(prop)) {
				
				var res;id=has_id(this.elems[0]);
				var val = (id&&_propCache[id][prop])?(id&&_propCache[id][prop]):!(res=this.elems[0][prop])&&prop in this.elems[0]?this.elems[0][prop]:res;
				return val;
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				
				el=this.elems[i];
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
				}
				else{
					el[prop]= value;
				}
			}
			return this;
		},
		
		removeProp: function(prop) {
			var p=prop.split(/\s+|\,/g),el,pr;
			for (var i = 0,len=this.length; i <len ; i++) {
				el=this.elems[i];
				for (var j = 0,lem=p.length; j <lem ; j++) {
					pr=p[j];
					if(el[pr])
						delete el[pr];
					if(el.jqmCacheId&&_propCache[el.jqmCacheId][pr]){
							delete _propCache[el.jqmCacheId][pr];
					}
				}
			}
			return this;
		},


	
		
		parseForm: function() {
			if (this.length == 0)
				return "";
			var params = {},elems,elem,type,tmp;
			for (var i = 0,len=this.length; i <len ; i++) {
				if(elems= this.elems[i].elements){
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
				return this.elems[0].value;
			for (var i = 0,len=this.length; i <len ; i++) {
				this.elems[i].value = value;
			}
			return this;
		},
		
		
		data: function(key, value) {
			return this.attr('data-' + key, value);
		},


		_id:function(make){
			if(make)return _id(this.elems[0]);
			return has_id(this.elems[0]);
		},
		


	};
