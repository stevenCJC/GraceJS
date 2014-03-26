define(['$'], function ($) {

	$.extend($.fn , {

		
		css: function(attribute, value, obj) {
			var toAct = obj != undefined ? obj : this.elems[0];
			if (this.length === 0)
				return this;
			if (value == undefined && typeof (attribute) === "string") {
				var styles = window.getComputedStyle(toAct);
				return  toAct.style[attribute] ? toAct.style[attribute]: window.getComputedStyle(toAct)[attribute] ;
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				if ($.isObject(attribute)) {
					for (var j in attribute) {
						this.elems[i].style[j] = attribute[j];
					}
				} else {
					this.elems[i].style[attribute] = value;
				}
			}
			return this;
		},
		
		hide: function() {
			if (this.length === 0)
				return this;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.css("display", null, this.elems[i]) != "none") {
					this.elems[i].setAttribute("jqmOld_display", this.css("display", null, this.elems[i]));
					this.elems[i].style.display = "none";
				}
			}
			return this;
		},
		
		show: function() {
			if (this.length === 0)
				return this;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.css("display", null, this.elems[i]) == "none") {
					this.elems[i].style.display = this.elems[i].getAttribute("jqmOld_display") ? this.elems[i].getAttribute("jqmOld_display") : 'block';
					this.elems[i].removeAttribute("jqmOld_display");
				}
			}
			return this;
		},
		
		toggle: function(show) {
			var show2 = show === true ? true : false;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (window.getComputedStyle(this.elems[i])['display'] !== "none" || (show !== undefined && show2 === false)) {
					this.elems[i].setAttribute("jqmOld_display", this.elems[i].style.display)
					this.elems[i].style.display = "none";
				} else {
					this.elems[i].style.display = this.elems[i].getAttribute("jqmOld_display") != undefined ? this.elems[i].getAttribute("jqmOld_display") : 'block';
					this.elems[i].removeAttribute("jqmOld_display");
				}
			}
			return this;
		},
		
		
		addClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this.elems[i];
				el.classList.add(name);
			}
			return this;
		},
		
		removeClass: function(name) {
			var el;
			for (var i = 0,len=this.length; i <len ; i++) {
				el = this.elems[i];
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
				el = this.elems[i];
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
				el = this.elems[i];
				el.classList.toggle(name);
			}
			return this;
		},
		
		hasClass: function(name, element) {
			if (this.length === 0)
				return false;
			if (!element)
				element = this.elems[0];
			return element.classList.contains(name);
		},

		
		offset: function() {
			if (this.length === 0)
				return this;
			if(this.elems[0]==window)
				return {
					left:0,
					top:0,
					right:0,
					bottom:0,
					width:window.innerWidth,
					height:window.innerHeight
				}
			else
				var obj = this.elems[0].getBoundingClientRect();
			return {
				left: obj.left + window.pageXOffset,
				top: obj.top + window.pageYOffset,
				right: obj.right + window.pageXOffset,
				bottom: obj.bottom + window.pageYOffset,
				width: obj.right-obj.left,
				height: obj.bottom-obj.top
			};
		},
		
		height:function(val){
			if (this.length === 0)
				return this;
			if(val!=undefined)
				return this.css("height",val);
			if(this.elems[0]==this.elems[0].window)
				return window.innerHeight;
			if(this.elems[0].nodeType==this.elems[0].DOCUMENT_NODE)
				return this.elems[0].documentElement['offsetheight'];
			else{
				var tmpVal=this.css("height").replace("px","");
				if(tmpVal)
					return tmpVal
				else
					return this.offset().height;
			}
		},
		
		width:function(val){
			if (this.length === 0)
				return this;
			 if(val!=undefined)
				return this.css("width",val);
			if(this.elems[0]==this.elems[0].window)
				return window.innerWidth;
			if(this.elems[0].nodeType==this.elems[0].DOCUMENT_NODE)
				return this.elems[0].documentElement['offsetwidth'];
			else{
				var tmpVal=this.css("width").replace("px","");
				if(tmpVal)
					return tmpVal
				else
				   return this.offset().width;
			}
		},
	});
	
	return $;
});
