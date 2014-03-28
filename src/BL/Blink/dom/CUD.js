define(['$','./var/_attrCache','./var/_propCache','./var/_initedCache','BL/Blink/event/var/handlers','blk/function/r_id','blk/function/_id','./var/fragementRE','./function/_insertFragments','BL/Blink/_/main'], function ($,_attrCache,_propCache,_initedCache,handlers,r_id,_id,fragementRE,_insertFragments) {

	$.extend({

		
		html: function(html,cleanup) {
			if (this.length === 0)
				return this;
			if (html === undefined)
				return this[0].innerHTML.replace(/_id\=\"[\w\,]*?\"/ig,'');
			for (var i = 0,len=this.length; i <len ; i++) {
				if(cleanup!==false)
					$.clean(this[i], false, true);
				this[i].innerHTML = html;
			}
			return this;
		},

		text: function(text) {
			if (this.length === 0)
				return this;
			if (text === undefined)
				return this[0].textContent;
			for (var i = 0,len=this.length; i <len ; i++) {
				this[i].textContent = text;
			}
			return this;
		},
		

		
		remove: function(selector) {
			var elems = $(this).filter(selector);
			if (elems == undefined)
				return this;
			for (var i = 0,len=elems.length; i <len ; i++) {
				$.clean(elems[i], true, true);
				elems[i].parentNode.removeChild(elems[i]);
			}
			return this;
		},
		


		
		append: function(element, insert) {
			if (element && element.length != undefined && element.length === 0)
				return this;
			if ($.isArray(element) || $.isObject(element))
				element = $(element);
			var i;
			
			
			for (i = 0; i < this.length; i++) {
				if (element.length && typeof element != "string") {
					element = $(element);
					_insertFragments(element,this[i],insert);
				} else {
					var obj =fragementRE.test(element)?$(element):undefined;
					if (obj == undefined || obj.length == 0) {
						obj = document.createTextNode(element);
					}
					if (obj.nodeName != undefined && obj.nodeName.toLowerCase() == "script" && (!obj.type || obj.type.toLowerCase() === 'text/javascript')) {
						window.eval(obj.innerHTML);
					} else if(obj instanceof $.fn.constructor) {
						_insertFragments(obj,this[i],insert);
					}
					else {
						insert != undefined ? this[i].insertBefore(obj, this[i].firstChild) : this[i].appendChild(obj);
					}
				}
			}
			return this;
		},
		
		appendTo:function(selector,insert){
			var tmp=$(selector);
			tmp.append(this);
			return this;
		},
		
		prependTo:function(selector){
			var tmp=$(selector);
			tmp.append(this,true);
			return this;
		},
		
		prepend: function(element) {
			return this.append(element, 1);
		},
		
		before: function(target, after) {
			if (this.length == 0)
				return this;
			target = $(target).eq(0);
			if (!target)
				return this;
			for (var i = 0; i < this.length; i++)
			{
				after ? target.parentNode.insertBefore(this[i], target.nextSibling) : target.parentNode.insertBefore(this[i], target);
			}
			return this;
		},
		
	   after: function(target) {
			this.insertBefore(target, true);
		},
		

		
		clone: function(deep) {
			deep = deep === false ? false : true;
			if (this.length == 0)
				return this;
			var elems = [],el,id,oid;
			for (var i = 0,len=this.length; i < len; i++) {
				el=this[i].cloneNode(deep);
				oid=r_id(el);
				if(deep){
					id=_id(el);
					_attrCache[id]=$.clone(_attrCache[oid]);
					_propCache[id]=$.clone(_propCache[oid]);
					_initedCache[id]=$.clone(_initedCache[oid]);
					handlers[id]=$.clone(handlers[oid]);
				}
				elems.push(el);
			}
			
			return $(elems);
		},

	});
	return $;
});