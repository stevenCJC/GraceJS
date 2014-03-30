define(['$','./var/_attrCache','./var/_propCache','./var/_initedCache','BL/Blink/event/var/handlers','blk/function/r_id','blk/function/_id','./var/fragementRE','./function/_insertFragments','BL/Blink/_/main'], function ($,_attrCache,_propCache,_initedCache,handlers,r_id,_id,fragementRE,_insertFragments) {

	$.extend({

		
		html: function(html,init) {
			if (this.length === 0)
				return this;
			if (html === undefined)
				return this[0].innerHTML.replace(/_id\=\"[\w\,]*?\"/ig,'');
			for (var i = 0,len=this.length; i <len ; i++) {
				$.clean(this[i], false, true);
				this[i].innerHTML = html;
				if(typeof init !== false){
					this.init(init);
				}
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
		


		
		append: function(element, init, insert, clone) {
			if(typeof clone=='undefined') clone=true;
			if (element && element.length != undefined && element.length === 0)
				return this;
			if ($.isArray(element) || $.isObject(element))
				element = $(element);
			var i,cloned;
			
			
			for (i = 0; i < this.length; i++) {
				
				if (element.length && typeof element != "string") {
					cloned = clone?$(element).clone(1):$(element);
					_insertFragments(cloned,this[i],insert);
					if(typeof init !== false){
						cloned.init(init);
					}
				} else {
					var obj =fragementRE.test(element)?$(element):undefined;
					if (obj == undefined || obj.length == 0) {
						obj = document.createTextNode(element);
					}
					if (obj.nodeName != undefined && obj.nodeName.toLowerCase() == "script" && (!obj.type || obj.type.toLowerCase() === 'text/javascript')) {
						window.eval(obj.innerHTML);
					} else if(obj instanceof $.fn.constructor) {
						_insertFragments(obj,this[i],insert);
						if(typeof init !== false){
							obj.init(init);
						}
					} else {
						insert ? this[i].insertBefore(obj, this[i].firstChild) : this[i].appendChild(obj);
						if(typeof init !== false){
							obj.init(init);
						}
						
					}
				}
			}
			return this;
		},
		
		appendTo:function(selector,init){
			var tmp=$(selector);
			tmp.append(this,init,false,false);
			return this;
		},
		
		prependTo:function(selector,init){
			var tmp=$(selector);
			tmp.append(this, init, true, false);
			return this;
		},
		
		prepend: function(element,init) {
			return this.append(element, init, true,true);
		},
		
		beforeTo: function(target, init, after) {
			if (this.length == 0)
				return this;
			var targets = $(target);
			if (!targets||!targets.parent().length)
				return this;
			for(var j=0,l=targets.length;j<l;j++){
				target = targets[j];
				for (var i = 0; i < this.length; i++)
				{
					after ? target.parentNode.insertBefore(this[i], target.nextSibling) : target.parentNode.insertBefore(this[i], target);
				}
			}
			if(typeof init !== false){
				this.init(init);
			}
			return this;
		},
		
	   afterTo: function(target,init) {
			this.beforeTo(target,init, true);
		},
		
		before: function(content, init) {
			var obj=$(content);
			if((!obj||!obj.length)&&typeof content == 'string')
				obj =$(document.createTextNode(content))
			obj.beforeTo(this,init);
			return this;
		},
		
	   after: function(content,init) {
			var obj=$(content);
			if((!obj||!obj.length)&&typeof content == 'string')
				obj =$(document.createTextNode(content))
			obj.beforeTo(this,init,true);
		},

		
		clone: function(deep) {
			deep = deep === false ? false : true;
			if (this.length == 0)
				return this;
			var elems = [],el,id,oid,els;
			for (var i = 0,len=this.length; i < len; i++) {
				el=$(this[i].cloneNode(deep));
				if(deep){
					if(el.attr('[_id]')){
						clone(el[0]);
					}
					el.find('[_id]').each(function(index, element) {
						clone(this);
					});
				}else {
					r_id(el[0]);
					el.find('[_id]').each(function(index, element) {
						r_id(this);
					});
				}
				elems.push(el[0]);
			}
			
			return $(elems);
			function clone(elems){
				oid=r_id(elems);
				id=_id(elems);
				if(_attrCache[oid])_attrCache[id]=$.clone(_attrCache[oid]);
				if(_propCache[oid])_propCache[id]=$.clone(_propCache[oid]);
				if(_initedCache[oid])_initedCache[id]=$.clone(_initedCache[oid]);
				if(handlers[oid])handlers[id]=$.clone(handlers[oid])
			}
		},

	});
	return $;
});