define([], function() {

	
	var undefined, document = window.document, 
	emptyArray = [], 
	slice = emptyArray.slice, 
	handlers = {},
	_jsonPID = 1,
	fragementRE=/^\s*<(\w+)[^>]*>/,
	_attrCache={},
	_propCache={};
	__id = 1;
	
	function _id(element) {
		var id=element.getAttribute('_id');
		if(id) return id;
		else{
			id=__id++;
			element.setAttribute('_id',id);
			return id;
		}
	}
	function has_id(element){
		return element.getAttribute('_id');
	}
	
	function _insertFragments(jqm,container,insert){
		var frag=document.createDocumentFragment();
		if(insert){
			for(var j=jqm.length-1;j>=0;j--)
			{
				frag.insertBefore(jqm[j],frag.firstChild);
			}
			container.insertBefore(frag,container.firstChild);
		
		}
		else {
		
			for(var j=0;j<jqm.length;j++)
				frag.appendChild(jqm[j]);
			container.appendChild(frag);
		}
		frag=null;
	}
			
	  
   
	
	function unique(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr.indexOf(arr[i]) != i) {
				arr.splice(i, 1);
				i--;
			}
		}
		return arr;
	}

	
	function siblings(nodes, element) {
		var elems = [];
		if (nodes == undefined)
			return elems;
		
		for (; nodes; nodes = nodes.nextSibling) {
			if (nodes.nodeType == 1 && nodes !== element) {
				elems.push(nodes);
			}
		}
		return elems;
	}

	
	var $jqm = function(toSelect, what) {
		this.length = 0;
		this.elems=[];
		if (!toSelect) {
			return this;
		} else if (toSelect instanceof $jqm && what == undefined) {
			return toSelect;
		} else if ($.isFunction(toSelect)) {
		//////////////
			return $(document).ready(toSelect);
		} else if ($.isArray(toSelect) && toSelect.length != undefined) { //Passing in an array or object
			this.elems=this.elems.concat(toSelect);
			this.length=toSelect.length;
			return this;
		} else if ($.isObject(toSelect) && $.isObject(what)) { //var tmp=$("span");  $("p").find(tmp);
			if (toSelect.length == undefined) {
				if (toSelect.parentNode == what)
					this.elems[this.length++] = toSelect;
			} else {
				for (var i = 0; i < toSelect.length; i++)
					if (toSelect.elems[i].parentNode == what)
						this.elems[this.length++] = toSelect.elems[i];
			}
			return this;
		} else if ($.isObject(toSelect) && what == undefined) { //Single object
			this.elems[this.length++] = toSelect;
			return this;
		} else if (what !== undefined) {
			if (what instanceof $jqm) {
				return what.find(toSelect);
			}
		
		} else {
			what = document;
		}
		
		return this.selector(toSelect, what);
		
	};

	
	var $ = function(selector, what) {
		return new $jqm(selector, what);
	};

	
	function _selectorAll(selector, what){
		try{
			return what.querySelectorAll(selector);
		} catch(e){
			return [];
		}
	};
	function _selector(selector, what) {
		

		selector=selector.trim();
		
		if (selector[0] === "#" && selector.indexOf(".")==-1 && selector.indexOf(" ")===-1 && selector.indexOf(">")===-1){
			if (what == document)
				_shimNodes(what.getElementById(selector.replace("#", "")),this);
			else
				_shimNodes(_selectorAll(selector, what),this);
		} else if (selector[0] === "<" && selector[selector.length - 1] === ">")  //html
		{
			var tmp = document.createElement("div");
			tmp.innerHTML = selector.trim();
			_shimNodes(tmp.childNodes,this);
		} else {
			_shimNodes((_selectorAll(selector, what)),this);
		}
		return this;
	}
	
	function _shimNodes(nodes,obj){
		if(!nodes)
			return;
		if(nodes.nodeType)
			return obj.elems[obj.length++]=nodes;
		if(nodes.elems){
			obj.elems=nodes.elems;
			obj.length=nodes.length;
		}else if(nodes.length){
			nodes.constructor==Array&&(obj.elems=obj.elems.concat(nodes));
			obj.elems=slice.call(nodes);
			//for(var i=0,len=nodes.length;i<len;i++) obj.elems.push(nodes[i]);
			obj.length=nodes.length;
		}else for(var x in nodes) nodes[x]&&nodes[x].nodeType&&(obj.elems[obj.length++]=nodes[x]);
	}
	
	
	$.is$ = function(obj){return obj instanceof $jqm;}
	
	
	$.each = function(elements, callback) {
		var i, key;
		if ($.isArray(elements))
			for(var i=0,len=elements.length;i<len;i++)
				if (callback(i, elements[i]) === false) return elements;
		else if ($.isObject(elements))
			for (key in elements) {
				if (!elements.hasOwnProperty(key))
					continue;
				if (callback(key, elements[key]) === false)
					return elements;
			}
		return elements;
	};

	
	$.extend = function(target) {
		if (target == undefined)
			target = this;
		if (arguments.length === 1) { 
			for (var key in target)
				this[key] = target[key];
			return this;
		} else {
			var a= slice.call(arguments, 1);
			for(var i=0,len=a.length;i<len;i++)
				for (var key in a[i])
					target[key] = a[i][key];
		}
		return target;
	};

	
	$.isArray = function(obj) {
		return obj instanceof Array && obj['push'] != undefined; //ios 3.1.3 doesn't have Array.isArray
	};

	
	$.isFunction = function(obj) {
		return typeof obj === "function" && !(obj instanceof RegExp);
	};
	
	$.isObject = function(obj) {
		return typeof obj === "object";
	};

	$.fn = $jqm.prototype = {
		constructor: $jqm,
		selector: _selector,
		oldElement: undefined,
		
		setupOld: function(params) {
			if (params == undefined)
				return $();
			params.oldElement = this;
			return params;
		},
		
		//如果callback返回数据，则返回[数据]，否则默认返回this
		each: function(callback) {
			var el=this.elems,tmp,returns=[];
			for(var i=0,len=el.length;i<len;i++){
				tmp=callback.call(el[i], i, el);
				if(tmp)returns.push(tmp);
			}
			if(returns.length)return returns;
			return this;
		},
		
		
		ready: function(callback) {
			if (document.readyState === "complete" || document.readyState === "loaded"||document.readyState==="interactive") 
				callback();
			else
				document.addEventListener("DOMContentLoaded", callback, false);
			return this;
		},
		
		find: function(sel) {
			if (this.length === 0)
				return this;
			var elems = [];
			var tmpElems;
			for (var i = 0,len=this.length; i <len ; i++) {
				tmpElems = $(sel, this.elems[i]).elems;
				for (var j = 0; j < tmpElems.length; j++) {
					elems.push(tmpElems[j]);
				}
			}
			return $(unique(elems));
		},
		
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
					} else if(obj instanceof $jqm) {
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
		
		parent: function(selector,recursive) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				var tmp=this.elems[i];
				while(tmp.parentNode&&tmp.parentNode!=document){
					elems.push(tmp.parentNode);
					if(tmp.parentNode)
						tmp=tmp.parentNode;
					if(!recursive)
						break;
				}
			}
			return this.setupOld($(unique(elems)).filter(selector));
		},
		
		parents: function(selector) {
			return this.parent(selector,true);
		},
		
		children: function(selector) {
			
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				elems = elems.concat(siblings(this.elems[i].firstChild));
			}
			return this.setupOld($((elems)).filter(selector));
		
		},
		
		siblings: function(selector) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this.elems[i].parentNode)
					elems = elems.concat(siblings(this.elems[i].parentNode.firstChild, this.elems[i]));
			}
			return this.setupOld($(elems).filter(selector));
		},
		
		closest: function(selector, context) {
			if (this.length == 0)
				return this;
			var elems = [], 
			cur = this.elems[0];
			
			var start = $(selector, context);
			if (start.length == 0)
				return $();
			while (cur && start.elems.indexOf(cur) == -1) {
				cur = cur !== context && cur !== document && cur.parentNode;
			}
			return $(cur);
		
		},
	   
		filter: function(selector) {
			if (this.length == 0)
				return this;
			
			if (selector == undefined)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				var val = this.elems[i];
				if (val.parentNode && $(selector, val.parentNode).elems.indexOf(val) >= 0)
					elems.push(val);
			}
			return this.setupOld($(unique(elems)));
		},
		
		not: function(selector) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				var val = this.elems[i];
				if (val.parentNode && $(selector, val.parentNode).elems.indexOf(val) == -1)
					elems.push(val);
			}
			return this.setupOld($(unique(elems)));
		},
		
		data: function(key, value) {
			return this.attr('data-' + key, value);
		},
		
		end: function() {
			return this.oldElement != undefined ? this.oldElement : $();
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

	   
		eq:function(ind){
			var index;
			index = index == undefined ? 0 : ind;
			if (index < 0)
				index += this.length;
			return $((this.elems[index]) ? this.elems[index] : undefined);
		},
		
		index:function(elem){
			return elem?this.elems.indexOf($(elem)[0]):this.parent().children().elems.indexOf(this.elems[0]);
		},
		
		_id:function(make){
			if(make)return _id(this.elems[0]);
			return has_id(this.elems[0]);
		},
		
		is:function(selector){
			return !!selector&&this.filter(selector).length>0;
		}

	};


	
	if (typeof String.prototype.trim !== 'function') {
		
		String.prototype.trim = function() {
			this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, '');
			return this
		};
	}
	
	
	

	
	

	
   
	
	
	function findHandlers(element, event, fn, selector) {
		event = parse(event);
		if (event.ns)
			var matcher = matcherFor(event.ns);
		return (handlers[has_id(element)] || []).filter(function(handler) {
			return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || handler.fn == fn || (typeof handler.fn === 'function' && typeof fn === 'function' && "" + handler.fn === "" + fn)) && (!selector || handler.sel == selector);
		});
	}
	
	function parse(event) {
		var parts = ('' + event).split('.');
		return {
			e: parts[0],
			ns: parts.slice(1).sort().join(' ')
		};
	}
	
	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}

	
	function eachEvent(events, fn, iterator) {
		if ($.isObject(events))
			$.each(events, iterator);
		else{
			var e=events.split(/\s|\,/);
			for(var i=0,len=e.length;i<len;i++){
				iterator(e[i], fn);
			};
		}
	}

	
	function add(element, events, fn, selector, getDelegate) {
		var id = _id(element), 
		set = (handlers[id] || (handlers[id] = []));
		eachEvent(events, fn, function(event, fn) {
			var delegate = getDelegate && getDelegate(fn, event), 
			callback = delegate || fn;
			var proxyfn = function(event) {
				var result = callback.apply(element, [event].concat(event.data));
				if (result === false)
					event.preventDefault();
				return result;
			};
			var handler = $.extend(parse(event), {
				fn: fn,
				proxy: proxyfn,
				sel: selector,
				del: delegate,
				i: set.length
			});
			set.push(handler);
			element.addEventListener(handler.e, proxyfn, false);
		});
		//element=null;
	}

	
	function remove(element, events, fn, selector) {
		
		var id = _id(element);
		eachEvent(events || '', fn, function(event, fn) {
			var hdl=findHandlers(element, event, fn, selector)
			for(var i=0,len=hdl.length;i<len;i++){
				delete hdl[i][id][hdl[i].i];
				element.removeEventListener(handler.e, handler.proxy, false);
			};
		});
	}
	
	$.event = {
		add: add,
		remove: remove
	}

	
   
	
	
	
	 
	
	var returnTrue = function() {
		return true
	}, 
	returnFalse = function() {
		return false
	}, 
	eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};
	
	function createProxy(event) {
		var proxy = $.extend({
			originalEvent: event
		}, event);
		$.each(eventMethods, function(name, predicate) {
			proxy[name] = function() {
				this[predicate] = returnTrue;					
				if (name == "stopImmediatePropagation" || name == "stopPropagation"){
					event.cancelBubble = true;
					if(!event[name])
						return;
				}
				return event[name].apply(event, arguments);
			};
			proxy[predicate] = returnFalse;
		})
		return proxy;
	}
	
	function _bind(elems,event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			add(elems[i], event, callback);
		}
	};
	
	function _unbind(elems,event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			remove(elems[i], event, callback);
		}
	};

	
	function _delegate(elems,selector, event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			var element = elems[i];
			add(element, event, callback, selector, function(fn) {
				return function(e) {
					var evt, match,tmp;
					match = $(e.target).closest(selector, element).elems[0];
					if (match) {
						evt = $.extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});
						return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
					}
				}
			});
		}
	};

	function _undelegate(elems,selector, event, callback) {
		for (var i = 0,len=elems.length; i <len ; i++) {
			remove(elems[i], event, callback, selector);
		}
		return this;
	}

	
	$.fn.on = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _bind(this.elems,event, selector) : _delegate(this.elems,selector, event, callback);
	};
   
	$.fn.off = function(event, selector, callback) {
		return selector === undefined || $.isFunction(selector) ? _unbind(this.elems,event, selector) : _undelegate(this.elems,selector, event, callback);
	};

	$.fn.one = function(event, callback) {
		return this.each(function(i, element) {
			add(this, event, callback, null, function(fn, type) {
				return function() {
					var result = fn.apply(element, arguments);
					remove(element, type, fn);
					return result;
				}
			});
		});
	};
	
	$.fn.trigger = function(event, data, props) {
		if (typeof event == 'string')
			event = $.Event(event, props);
		event.data = data;
		for (var i = 0,len=this.length; i <len ; i++) {
			this.elems[i].dispatchEvent(event)
		}
		return this;
	};

	
	
	$.Event = function(type, props) {
		var event = document.createEvent('Events'), 
		bubbles = true;
		if (props)
			for (var name in props)
				(name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
		event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
		return event;
	};
	
	
	
	 
	function cleanUpNode(node, kill){
		//kill it before it lays eggs!
		if(kill && node.dispatchEvent){
			var e = $.Event('destroy', {bubbles:false});
			node.dispatchEvent(e);
		}
		var id = _id(node);
		if(id && handlers[id]){
			for(var key in handlers[id])
				node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
			delete handlers[id];
		}
	}
	
	$.cleanUpContent = function(node, itself, kill){
		if(!node) return;
		//cleanup children
		var elems = $('[_id]',node).elems;
		if(elems.length > 0) 
			for(var i=0,len=elems.length;i<len;i++){
				cleanUpNode(elems[i], kill);
			}
		//cleanUp this node
		if(itself) cleanUpNode(node, kill);
	}
	

	

	
	var eventtrigger=["click","keydown","keyup","keypress","submit","load","resize","change","select","error"];
	for(var i=0,len=eventtrigger.length;i<len;i++)
		(function(i){
			$.fn[eventtrigger[i]]=function(cb){
				return cb?_bind(this.elems,eventtrigger[i],cb):this.trigger(eventtrigger[i]);
			}
		})(i)
			
		
			
			
			
			
	return $;
});