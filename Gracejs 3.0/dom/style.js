define(['$','BL/_/main'], function ($) {

	$.extend({

		
		css: function(attribute, value, obj) {
			var toAct = obj != undefined ? obj : this[0];
			if (this.length === 0)
				return this;
			if (value == undefined && typeof (attribute) === "string") {
				var styles = window.getComputedStyle(toAct);
				return  toAct.style[attribute] ? toAct.style[attribute]: window.getComputedStyle(toAct)[attribute] ;
			}
			for (var i = 0,len=this.length; i <len ; i++) {
				if ($.isObject(attribute)) {
					for (var j in attribute) {
						this[i].style[j] = attribute[j];
					}
				} else {
					this[i].style[attribute] = value;
				}
			}
			return this;
		},
		
		hide: function() {
			if (this.length === 0)
				return this;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.css("display", null, this[i]) != "none") {
					this[i].setAttribute("jqmOld_display", this.css("display", null, this[i]));
					this[i].style.display = "none";
				}
			}
			return this;
		},
		
		show: function() {
			if (this.length === 0)
				return this;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.css("display", null, this[i]) == "none") {
					this[i].style.display = this[i].getAttribute("jqmOld_display") ? this[i].getAttribute("jqmOld_display") : 'block';
					this[i].removeAttribute("jqmOld_display");
				}
			}
			return this;
		},
		
		toggle: function(show) {
			var show2 = show === true ? true : false;
			for (var i = 0,len=this.length; i <len ; i++) {
				if (window.getComputedStyle(this[i])['display'] !== "none" || (show !== undefined && show2 === false)) {
					this[i].setAttribute("jqmOld_display", this[i].style.display)
					this[i].style.display = "none";
				} else {
					this[i].style.display = this[i].getAttribute("jqmOld_display") != undefined ? this[i].getAttribute("jqmOld_display") : 'block';
					this[i].removeAttribute("jqmOld_display");
				}
			}
			return this;
		},
		
		
		offset: function() {
			if (this.length === 0)
				return this;
			if(this[0]==window)
				return {
					left:0,
					top:0,
					right:0,
					bottom:0,
					width:window.innerWidth,
					height:window.innerHeight
				}
			else
				var obj = this[0].getBoundingClientRect();
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
			if(this[0]==this[0].window)
				return window.innerHeight;
			if(this[0].nodeType==this[0].DOCUMENT_NODE)
				return this[0].documentElement['offsetheight'];
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
			if(this[0]==this[0].window)
				return window.innerWidth;
			if(this[0].nodeType==this[0].DOCUMENT_NODE)
				return this[0].documentElement['offsetwidth'];
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
