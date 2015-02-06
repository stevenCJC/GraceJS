define(['dom/core','./var/fragementRE','./function/_insertFragments','_/is'], function (g,fragementRE,_insertFragments) {

	g.ui.extend({

		
		html: function(html) {
			if (this.length === 0)
				return this;
			if (html === undefined)
				return this[0].innerHTML;
			for (var i = 0,len=this.length; i <len ; i++) {
				g.clean(this[i], false, true);
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
			var elems = g.q(this).filter(selector);
			if (elems == undefined)
				return this;
			for (var i = 0,len=elems.length; i <len ; i++) {
				g.clean(elems[i], true, true);
				elems[i].parentNode.removeChild(elems[i]);
			}
			return this;
		},
		
		pop:function(selector){
			var elems = g.q(this).filter(selector);
			for (var i = 0,len=elems.length; i <len ; i++) {
				elems[i].parentNode.removeChild(elems[i]);
			}
			return elems;
		},

		
		append: function(element, insert, clone) {
			if(typeof clone=='undefined') clone=true;
			if (element && element.length != undefined && element.length === 0)
				return this;
			if (g.is.array(element) || g.is.object(element))
				element = g.q(element);
			var i,cloned;
			for (i = 0; i < this.length; i++) {
				
				if (element.length && typeof element != "string") {
					cloned = clone?g.q(element).clone(1):g.q(element);
					_insertFragments(cloned,this[i],insert);
				} else {
					var obj =fragementRE.test(element)?g.q(element):undefined;
					if (obj == undefined || obj.length == 0) {
						obj = document.createTextNode(element);
					}
					if (obj.nodeName != undefined && obj.nodeName.toLowerCase() == "script" && (!obj.type || obj.type.toLowerCase() === 'text/javascript')) {
						window.eval(obj.innerHTML);
					} else if(obj instanceof g.ui.fn.constructor) {
						_insertFragments(obj,this[i],insert);
					} else {//非节点插入
						insert ? this[i].insertBefore(obj, this[i].firstChild) : this[i].appendChild(obj);
					}
				}
			}
			return this;
		},
		
		appendTo:function(selector){
			g.q(selector).append(this,false,false);
			return this;
		},
		
		prependTo:function(selector){
			g.q(selector).append(this, true, false);
			return this;
		},
		
		prepend: function(element) {
			return this.append(element, true,true);
		},
		
		beforeTo: function(target, after) {
			if (this.length == 0)
				return this;
			var targets = g.q(target);
			if (!targets||!targets.parent().length)
				return this;
			for(var j=0,l=targets.length;j<l;j++){
				target = targets[j];
				for (var i = 0; i < this.length; i++)
				{
					after ? target.parentNode.insertBefore(this[i], target.nextSibling) : target.parentNode.insertBefore(this[i], target);
				}
			}
			return this;
		},
		
	   afterTo: function(target) {
			this.beforeTo(target, true);
		},
		
		before: function(content) {
			var obj=g.q(content);
			if((!obj||!obj.length)&&typeof content == 'string')
				obj =g.q(document.createTextNode(content))
			obj.beforeTo(this);
			return this;
		},
		
	   after: function(content) {
			var obj=g.q(content);
			if((!obj||!obj.length)&&typeof content == 'string')
				obj =g.q(document.createTextNode(content))
			obj.beforeTo(this,true);
		},

		
		clone: function(deep) {
			deep = deep === false ? false : true;
			if (this.length == 0)
				return this;
			var elems = [],el,id,oid,els;
			for (var i = 0,len=this.length; i < len; i++) {
				el=g.q(this[i].cloneNode(deep));
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
			
			return g.q(elems);
			function clone(elems){
				//if(handlers[oid])handlers[id]=$.clone(handlers[oid])
			}
		},

	});
	return g;
});