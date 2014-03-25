
	$.extend($.fn , {

		
		html: function(html,cleanup) {
			if (this.length === 0)
				return this;
			if (html === undefined)
				return this.elems[0].innerHTML;

			for (var i = 0,len=this.length; i <len ; i++) {
				if(cleanup!==false)
					$.cleanUpContent(this.elems[i], false, true);
				this.elems[i].innerHTML = html;
			}
			return this;
		},

		text: function(text) {
			if (this.length === 0)
				return this;
			if (text === undefined)
				return this.elems[0].textContent;
			for (var i = 0,len=this.length; i <len ; i++) {
				this.elems[i].textContent = text;
			}
			return this;
		},
		

		
		remove: function(selector) {
			var elems = $(this).filter(selector).elems;
			if (elems == undefined)
				return this;
			for (var i = 0,len=elems.length; i <len ; i++) {
				$.cleanUpContent(elems[i], true, true);
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
					_insertFragments(element,this.elems[i],insert);
				} else {
					var obj =fragementRE.test(element)?$(element):undefined;
					if (obj == undefined || obj.length == 0) {
						obj = document.createTextNode(element);
					}
					if (obj.nodeName != undefined && obj.nodeName.toLowerCase() == "script" && (!obj.type || obj.type.toLowerCase() === 'text/javascript')) {
						window.eval(obj.innerHTML);
					} else if(obj instanceof Core) {
						_insertFragments(obj,this.elems[i],insert);
					}
					else {
						insert != undefined ? this.elems[i].insertBefore(obj, this.elems[i].firstChild) : this.elems[i].appendChild(obj);
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
				after ? target.parentNode.insertBefore(this.elems[i], target.nextSibling) : target.parentNode.insertBefore(this.elems[i], target);
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
			var elems = [];
			for (var i = 0,len=this.length; i < len; i++) {
				elems.push(this.elems[i].cloneNode(deep));
			}
			
			return $(elems);
		},

	});
