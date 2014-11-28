define(['ui/ui','_/is','./clean'], function (g) {

	
	
	
	
	/*
	
	
		所有数据都随 widget 和 namespace 存储，不允许绑定到元素
		
		与元素相关的数据，需要存储相关联的元素，通过检测该元素的父节点来确定是否已被删除
		
		
	*/
	
	
	


	g.ui.extend({
		
		attr: function(attr, value) {
			var el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;     
				       
			if (g.is.object(attr)) {
				for(var x in attr) this.attr(x,attr[x]);
			}else if (arguments.length==1) {
				return this[0].getAttribute(attr);
			}else if(arguments.length==2){
				
				value=g.is.object(value)?JSON.stringify(value):value;
				
				for (var i = 0,len=this.length; i <len ; i++) {
					el=this[i];
					if(value!= undefined) {
						el.setAttribute(attr, value);
					} else {
						el.removeAttribute(attr);
					}
				}
			}
			return this;
		},
		
		removeAttr: function(attr) {
			var attrs=attr.split(/\s+|\,/g),el;
			for (var i = 0,len=this.length; i <len ; i++) {
				for(var j=0,lem=attrs.length;j<lem;j++){
					this[i].removeAttribute(attrs[j]);
				}
			}
			return this;
		},

		
		prop: function(prop, value) {
			var id,el;
			if (this.length === 0)
				return (value === undefined) ? undefined : this;    
				      
			if (g.is.object(prop)) {
				for(var x in prop) this.prop(x,prop[x]);
			}else if (arguments.length==1) {
				if(this.length)
					return this[0][prop];
				else return undefined;
			}else if(arguments.length==2){
				value=g.is.object(value)?JSON.stringify(value):value;
				
				for (var i = 0,len=this.length; i <len ; i++) {
					el=this[i];
					if(value!= undefined) {
						el[prop]= value;
					} else {
						delete el[prop];
					}
				}
			}
			return this;
		},
		
		removeProp: function(prop) {
			var props=prop.split(/\s+|\,/g),el;
			for (var i = 0,len=this.length; i <len ; i++) {
				for(var j=0,lem=props.length;j<lem;j++){
					delete this[i][props[j]];
				}
			}
			return this;
		},


		
		
		addClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this[i];
				el.classList.add(name);
			}
			return this;
		},
		
		removeClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this[i];
				if (name == undefined) {
					el.className = '';
					continue;
				}
				
				el.classList.remove(name);
			}
			return this;
		},
		
		replaceClass: function(name, newName) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this[i];
				if (!newName) {
					el.className = name;
					continue;
				}
					el.classList.add(newName);
					el.classList.remove(name);
			}
			return this;
		},
		
		toggleClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (name == undefined) {
					return this;
				}
				el = this[i];
				el.classList.toggle(name);
			}
			return this;
		},
		
		hasClass: function(name, element) {
			if (this.length === 0)
				return false;
			if (!element)
				element = this[0];
			return element.classList.contains(name);
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
		

	});
	return $;
});
