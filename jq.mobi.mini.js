/*
	简化细节：
		class	使用原有class操作功能
		$		删除类数组的操作方式
		
		
	
*/




if (!window.jq || typeof (jq) !== "function") {
    
    var jq = (function(window) {
        var undefined, document = window.document, 
        emptyArray = [], 
        slice = emptyArray.slice, 
        classCache = {}, 
        eventHandlers = [], 
        _eventID = 1, 
        jsonPHandlers = [], 
        _jsonPID = 1,
        fragementRE=/^\s*<(\w+)[^>]*>/,
        _attrCache={},
        _propCache={};
        
        
        
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
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            indexOf: emptyArray.indexOf,
            concat: emptyArray.concat,
            selector: _selector,
            oldElement: undefined,
            
            setupOld: function(params) {
                if (params == undefined)
                    return $();
                params.oldElement = this;
                return params;
            
            },
            
            map: function(fn) {
                var value, values = [], i;
                for (i = 0; i < this.length; i++) {
                    value = fn(i,this.elems[i]);
                    if (value !== undefined)
                        values.push(value);
                }
                return $([values]);
            },
            
            each: function(callback) {
				var el=this.elems;
				for(var i=0,len=el.length;i<len;i++)
                    callback.call(el[i], i, el);
                return this;
            },
            
            
            ready: function(callback) {
                if (document.readyState === "complete" || document.readyState === "loaded"||(!$.os.ie&&document.readyState==="interactive")) //IE10 fires interactive too early
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
                    tmpElems = ($(sel, this.elems[i]).elems);
                    
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
            
            vendorCss:function(attribute,value,obj){
                return this.css($.feat.cssPrefix+attribute,value,obj);
            },
            
            empty: function() {
                for (var i = 0,len=this.length; i <len ; i++) {
                    $.cleanUpContent(this.elems[i], false, true);
                    this.elems[i].innerHTML = '';
                }
                return this;
            },
            
            hide: function() {
                if (this.length === 0)
                    return this;
                for (var i = 0,len=this.length; i <len ; i++) {
                    if (this.css("display", null, this.elems[i]) != "none") {
                        this.elems[i].setAttribute("jqmOldStyle", this.css("display", null, this.elems[i]));
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
                        this.elems[i].style.display = this.elems[i].getAttribute("jqmOldStyle") ? this.elems[i].getAttribute("jqmOldStyle") : 'block';
                        this.elems[i].removeAttribute("jqmOldStyle");
                    }
                }
                return this;
            },
            
            toggle: function(show) {
                var show2 = show === true ? true : false;
                for (var i = 0,len=this.length; i <len ; i++) {
                    if (window.getComputedStyle(this.elems[i])['display'] !== "none" || (show !== undefined && show2 === false)) {
                        this.elems[i].setAttribute("jqmOldStyle", this.elems[i].style.display)
                        this.elems[i].style.display = "none";
                    } else {
                        this.elems[i].style.display = this.elems[i].getAttribute("jqmOldStyle") != undefined ? this.elems[i].getAttribute("jqmOldStyle") : 'block';
                        this.elems[i].removeAttribute("jqmOldStyle");
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
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;            
                if (value === undefined && !$.isObject(attr)) {
                    var val = (this.elems[0].jqmCacheId&&_attrCache[this.elems[0].jqmCacheId][attr])?(this.elems[0].jqmCacheId&&_attrCache[this.elems[0].jqmCacheId][attr]):this.elems[0].getAttribute(attr);
                    return val;
                }
                for (var i = 0,len=this.length; i <len ; i++) {
                    if ($.isObject(attr)) {
                        for (var key in attr) {
                            $(this.elems[i]).attr(key,attr[key]);
                        }
                    }
                    else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
                    {
                        
                        if(!this.elems[i].jqmCacheId)
                            this.elems[i].jqmCacheId=$.uuid();
                        
                        if(!_attrCache[this.elems[i].jqmCacheId])
                            _attrCache[this.elems[i].jqmCacheId]={}
                        _attrCache[this.elems[i].jqmCacheId][attr]=value;
                    }
                    else if (value == null && value !== undefined)
                    {
                        this.elems[i].removeAttribute(attr);
                        if(this.elems[i].jqmCacheId&&_attrCache[this.elems[i].jqmCacheId][attr])
                            delete _attrCache[this.elems[i].jqmCacheId][attr];
                    }
                    else{
                        this.elems[i].setAttribute(attr, value);
                    }
                }
                return this;
            },
            
            removeAttr: function(attr) {
                var attrs=attr.split(/\s+|\,/g),el,at;
                for (var i = 0,len=this.length; i <len ; i++) {
					el=this.elems[i];
                    for(var j=0,lem=attrs.length;j<lem;j++){
						at=attrs[j];
                        el.removeAttribute(at);
                        if(el.jqmCacheId&&_attrCache[el.jqmCacheId][at])
                            delete _attrCache[el.jqmCacheId][at];
                    }
                }
                return this;
            },

            
            prop: function(prop, value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;          
                if (value === undefined && !$.isObject(prop)) {
                    var res;
                    var val = (this.elems[0].jqmCacheId&&_propCache[this.elems[0].jqmCacheId][prop])?(this.elems[0].jqmCacheId&&_propCache[this.elems[0].jqmCacheId][prop]):!(res=this.elems[0][prop])&&prop in this.elems[0]?this.elems[0][prop]:res;
                    return val;
                }
                for (var i = 0,len=this.length; i <len ; i++) {
                    if ($.isObject(prop)) {
                        for (var key in prop) {
                            $(this.elems[i]).prop(key,prop[key]);
                        }
                    }
                    else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
                    {
                        
                        if(!this.elems[i].jqmCacheId)
                            this.elems[i].jqmCacheId=$.uuid();
                        
                        if(!_propCache[this.elems[i].jqmCacheId])
                            _propCache[this.elems[i].jqmCacheId]={}
                        _propCache[this.elems[i].jqmCacheId][prop]=value;
                    }
                    else if (value == null && value !== undefined)
                    {
                        $(this.elems[i]).removeProp(prop);
                    }
                    else{
                        this.elems[i][prop]= value;
                    }
                }
                return this;
            },
            
            removeProp: function(prop) {
                var p=prop.split(/\s+/g),el,pr;
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
                for (var i = 0,len=this.length; i <len ; i++) {
                    var cls = this.elems[i].className;
                    var classList = [];
                    var names = name.split(/\s+|\,/g);
                    for(var j=0,lem=names.length;j<lem;j++)
                        if (!this.hasClass(names[j], this.elems[i])) classList.push(names[j]);
                    
                    this.elems[i].className += (cls ? " " : "") + classList.join(" ");
                    this.elems[i].className = this.elems[i].className.trim();
                }
                return this;
            },
            
            removeClass: function(name) {
                for (var i = 0,len=this.length; i <len ; i++) {
                    if (name == undefined) {
                        this.elems[i].className = '';
                        return this;
                    }
                    var classList = this.elems[i].className,names=name.split(/\s+|\,/g);
                    for(var j=0,lem=names.length;j<lem;j++)
                        classList = classList.replace(classRE(names[j]), " ");
                    if (classList.length > 0)
                        this.elems[i].className = classList.trim();
                    else
                        this.elems[i].className = "";
                }
                return this;
            },
            
            replaceClass: function(name, newName) {
                for (var i = 0,len=this.length; i <len ; i++) {
                    if (name == undefined) {
                        this.elems[i].className = newName;
                        continue;
                    }
                    var classList = this.elems[i].className;
                    name.split(/\s+/g).concat(newName.split(/\s+/g)).forEach(function(cname) {
                        classList = classList.replace(classRE(cname), " ");
                    });
					classList=classList.trim();
                    if (classList.length > 0){
                    	this.elems[i].className = (classList+" "+newName).trim();
                    } else
                        this.elems[i].className = newName;
                }
                return this;
            },
            
            hasClass: function(name, element) {
                if (this.length === 0)
                    return false;
                if (!element)
                    element = this.elems[0];
                return classRE(name).test(element.className);
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
            
            insertBefore: function(target, after) {
                if (this.length == 0)
                    return this;
                target = $(target).get(0);
                if (!target)
                    return this;
                for (var i = 0; i < this.length; i++)
                {
                    after ? target.parentNode.insertBefore(this.elems[i], target.nextSibling) : target.parentNode.insertBefore(this.elems[i], target);
                }
                return this;
            },
            
            insertAfter: function(target) {
                this.insertBefore(target, true);
            },
            
            get: function(index) {
                index = index == undefined ? 0 : index;
                if (index < 0)
                    index += this.length;
                return (this.elems[index]) ? this.elems[index] : undefined;
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
                while (cur && start.indexOf(cur) == -1) {
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
                    if (val.parentNode && $(selector, val.parentNode).indexOf(val) >= 0)
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
                    if (val.parentNode && $(selector, val.parentNode).indexOf(val) == -1)
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
                var params = {},elems;
				for (var i = 0,len=this.length; i <len ; i++) {
					if(elems= this.elems[i].elements){
						for(var j=0,lem=elems.length;j<lem;j++)
						//需要过滤部分情况
							elems[j].name&&(params[elems[j].name]=elems[j].value);
					}
                }
                return params;
            },

           
            eq:function(ind){
                return $(this.get(ind));
            },
            
            index:function(elem){
                return elem?this.elems.indexOf($(elem)[0]):this.parent().children().elems.indexOf(this.elems[0]);
            },
            
            is:function(selector){
                return !!selector&&this.filter(selector).length>0;
            }

        };


        /* AJAX functions */
        
        function empty() {
        }
        var ajaxSettings = {
            type: 'GET',
            beforeSend: empty,
            success: empty,
            error: empty,
            complete: empty,
            context: undefined,
            timeout: 0,
            crossDomain: null
        };
        
        $.jsonP = function(options) {
            var callbackName = 'jsonp_callback' + (++_jsonPID);
            var abortTimeout = "", 
            context;
            var script = document.createElement("script");
            var abort = function() {
                $(script).remove();
                if (window[callbackName])
                    window[callbackName] = empty;
            };
            window[callbackName] = function(data) {
                clearTimeout(abortTimeout);
                $(script).remove();
                delete window[callbackName];
                options.success.call(context, data);
            };
            script.src = options.url.replace(/=\?/, '=' + callbackName);
            if(options.error)
            {
               script.onerror=function(){
                  clearTimeout(abortTimeout);
                  options.error.call(context, "", 'error');
               }
            }
            $('head').append(script);
            if (options.timeout > 0)
                abortTimeout = setTimeout(function() {
                    options.error.call(context, "", 'timeout');
                }, options.timeout);
            return {};
        };

        
        $.ajax = function(opts) {
            var xhr;
            try {
				
                var settings = opts || {};
                for (var key in ajaxSettings) {
                    if (typeof(settings[key]) == 'undefined')
                        settings[key] = ajaxSettings[key];
                }
                
                if (!settings.url)
                    settings.url = window.location;
                if (!settings.contentType)
                    settings.contentType = "application/x-www-form-urlencoded";
                if (!settings.headers)
                    settings.headers = {};
               
                if(!('async' in settings)||settings.async!==false)
                    settings.async=true;
                
                if (!settings.dataType)
                    settings.dataType = "text/html";
                else {
                    switch (settings.dataType) {
                        case "script":
                            settings.dataType = 'text/javascript, application/javascript';
                            break;
                        case "json":
                            settings.dataType = 'application/json';
                            break;
                        case "xml":
                            settings.dataType = 'application/xml, text/xml';
                            break;
                        case "html":
                            settings.dataType = 'text/html';
                            break;
                        case "text":
                            settings.dataType = 'text/plain';
                            break;
                        default:
                            settings.dataType = "text/html";
                            break;
                        case "jsonp":
                            return $.jsonP(opts);
                            break;
                    }
                }
                if ($.isObject(settings.data))
                    settings.data = $.param(settings.data);
                if (settings.type.toLowerCase() === "get" && settings.data) {
                    if (settings.url.indexOf("?") === -1)
                        settings.url += "?" + settings.data;
                    else
                        settings.url += "&" + settings.data;
                }
                
                if (/=\?/.test(settings.url)) {
                    return $.jsonP(settings);
                }
                if (settings.crossDomain === null) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
                    RegExp.$2 != window.location.host;
                
                if(!settings.crossDomain)
                    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers);
                var abortTimeout;
                var context = settings.context;
                var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
				
				//ok, we are really using xhr
				xhr = new window.XMLHttpRequest();
				
				
                xhr.onreadystatechange = function() {
                    var mime = settings.dataType;
                    if (xhr.readyState === 4) {
                        clearTimeout(abortTimeout);
                        var result, error = false;
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0&&protocol=='file:') {
                            if (mime === 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
                                try {
                                    result = JSON.parse(xhr.responseText);
                                } catch (e) {
                                    error = e;
                                }
                            } else if (mime === 'application/xml, text/xml') {
                                result = xhr.responseXML;
                            } 
                            else if(mime=="text/html"){
                                result=xhr.responseText;
                                $.parseJS(result);
                            }
                            else
                                result = xhr.responseText;
                            //If we're looking at a local file, we assume that no response sent back means there was an error
                            if(xhr.status===0&&result.length===0)
                                error=true;
                            if (error)
                                settings.error.call(context, xhr, 'parsererror', error);
                            else {
                                settings.success.call(context, result, 'success', xhr);
                            }
                        } else {
                            error = true;
                            settings.error.call(context, xhr, 'error');
                        }
                        settings.complete.call(context, xhr, error ? 'error' : 'success');
                    }
                };
                xhr.open(settings.type, settings.url, settings.async);
				if (settings.withCredentials) xhr.withCredentials = true;
                
                if (settings.contentType)
                    settings.headers['Content-Type'] = settings.contentType;
                for (var name in settings.headers)
                    xhr.setRequestHeader(name, settings.headers[name]);
                if (settings.beforeSend.call(context, xhr, settings) === false) {
                    xhr.abort();
                    return false;
                }
                
                if (settings.timeout > 0)
                    abortTimeout = setTimeout(function() {
                        xhr.onreadystatechange = empty;
                        xhr.abort();
                        settings.error.call(context, xhr, 'timeout');
                    }, settings.timeout);
                xhr.send(settings.data);
            } catch (e) {
            	// General errors (e.g. access denied) should also be sent to the error callback
                console.log(e);
            	settings.error.call(context, xhr, 'error', e);
            }
            return xhr;
        };
        
        
        
        $.get = function(url, success) {
            return this.ajax({
                url: url,
                success: success
            });
        };
        
        $.post = function(url, data, success, dataType) {
            if (typeof (data) === "function") {
                success = data;
                data = {};
            }
            if (dataType === undefined)
                dataType = "html";
            return this.ajax({
                url: url,
                type: "POST",
                data: data,
                dataType: dataType,
                success: success
            });
        };
        
        $.getJSON = function(url, data, success) {
            if (typeof (data) === "function") {
                success = data;
                data = {};
            }
            return this.ajax({
                url: url,
                data: data,
                success: success,
                dataType: "json"
            });
        };

        $.param = function(obj, prefix) {
            var str = [];
            if (obj instanceof $jqm) {
                obj.each(function() {
                    var k = prefix ? prefix + "[]" : this.id, 
                    v = this.value;
                    str.push((k) + "=" + encodeURIComponent(v));
                });
            } else {
                for (var p in obj) {
                    var k = prefix ? prefix + "[" + p + "]" : p, 
                    v = obj[p];
                    str.push($.isObject(v) ? $.param(v, k) : (k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        };
        
        $.parseJSON = function(string) {
            return JSON.parse(string);
        };
       
        $.parseXML = function(string) {
            return (new DOMParser).parseFromString(string, "text/xml");
        };
        
        function detectUA($, userAgent) {
            $.os = {};
            
            $.feat = {};
            var head=document.documentElement.getElementsByTagName("head")[0];
            $.feat.nativeTouchScroll =  typeof(head.style["-webkit-overflow-scrolling"])!=="undefined"&&$.os.ios;
            $.feat.cssPrefix=$.os.webkit?"Webkit":$.os.fennec?"Moz":$.os.ie?"ms":$.os.opera?"O":"";
            $.feat.cssTransformStart=!$.os.opera?"3d(":"(";
            $.feat.cssTransformEnd=!$.os.opera?",0)":")";
            if($.os.android&&!$.os.webkit)
                $.os.android=false;
        }

        detectUA($, navigator.userAgent);
        $.__detectUA = detectUA; //needed for unit tests
		
        if (typeof String.prototype.trim !== 'function') {
            
            String.prototype.trim = function() {
                this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, '');
                return this
            };
        }
        
        
        $.uuid = function () {
            var S4 = function () {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        };

        
        

        
        var handlers = {}, 
        _jqmid = 1;
        
        function jqmid(element) {
            return element._jqmid || (element._jqmid = _jqmid++);
        }
        
        function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns)
                var matcher = matcherFor(event.ns);
            return (handlers[jqmid(element)] || []).filter(function(handler) {
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
            var id = jqmid(element), 
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
            
            var id = jqmid(element);
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

        
        $.fn.bind = function(event, callback) {
            for (var i = 0,len=this.length; i <len ; i++) {
                add(this.elems[i], event, callback);
            }
            return this;
        };
        
        $.fn.unbind = function(event, callback) {
            for (var i = 0,len=this.length; i <len ; i++) {
                remove(this.elems[i], event, callback);
            }
            return this;
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
                    this.elems[predicate] = returnTrue;					
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

        
        $.fn.delegate = function(selector, event, callback) {
            for (var i = 0,len=this.length; i <len ; i++) {
                var element = this.elems[i];
                add(element, event, callback, selector, function(fn) {
                    return function(e) {
                        var evt, match = $(e.target).closest(selector, element).get(0);
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
            return this;
        };

        $.fn.undelegate = function(selector, event, callback) {
            for (var i = 0,len=this.length; i <len ; i++) {
                remove(this.elems[i], event, callback, selector);
            }
            return this;
        }

        
        $.fn.on = function(event, selector, callback) {
            return selector === undefined || $.isFunction(selector) ? this.bind(event, selector) : this.delegate(selector, event, callback);
        };
       
        $.fn.off = function(event, selector, callback) {
            return selector === undefined || $.isFunction(selector) ? this.unbind(event, selector) : this.undelegate(selector, event, callback);
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
		
        /* The following are for events on objects */
		
		$.bind = function(obj, ev, f){
			if(!obj.__events) obj.__events = {};
			if(!$.isArray(ev)) ev = [ev];
			for(var i=0; i<ev.length; i++){
				if(!obj.__events[ev[i]]) obj.__events[ev[i]] = [];
				obj.__events[ev[i]].push(f);
			}
		};

        
		$.trigger = function(obj, ev, args){
			var ret = true;
			if(!obj.__events) return ret;
			if(!$.isArray(ev)) ev = [ev];
			if(!$.isArray(args)) args = [];
			for(var i=0; i<ev.length; i++){
				if(obj.__events[ev[i]]){
					var evts = obj.__events[ev[i]];
					for(var j = 0; j<evts.length; j++)
						if($.isFunction(evts[j]) && evts[j].apply(obj, args)===false) 
							ret = false;
				}
			}
			return ret;
		};
        
        $.unbind = function(obj, ev, f){
			if(!obj.__events) return;
			if(!$.isArray(ev)) ev = [ev];
			for(var i=0; i<ev.length; i++){
				if(obj.__events[ev[i]]){
					var evts = obj.__events[ev[i]];
					for(var j = 0; j<evts.length; j++){
                        if(f==undefined)
                            delete evts[j];
						if(evts[j]==f) {
							evts.splice(j,1);
							break;
						}
					}
				}
			}
		};
		
        
        
		$.proxy=function(f, c, args){
           	return function(){
				if(args) return f.apply(c, args);	//use provided arguments
               	return f.apply(c, arguments);	//use scope function call arguments
            }
		}

      
         
		function cleanUpNode(node, kill){
			//kill it before it lays eggs!
			if(kill && node.dispatchEvent){
	            var e = $.Event('destroy', {bubbles:false});
	            node.dispatchEvent(e);
			}
			//cleanup itself
            var id = jqmid(node);
            if(id && handlers[id]){
		    	for(var key in handlers[id])
		        	node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
            	delete handlers[id];
            }
		}
		function cleanUpContent(node, kill){
            if(!node) return;
			//cleanup children
            var children = node.childNodes;
            if(children && children.length > 0)
                for(var child in children)
                    cleanUpContent(children[child], kill);
			
			cleanUpNode(node, kill);
		}
		var cleanUpAsap = function(els, kill){
        	for(var i=0;i<els.length;i++){
            	cleanUpContent(els[i], kill);
            }	
		}

        
        $.cleanUpContent = function(node, itself, kill){
            if(!node) return;
			//cleanup children
            var cn = node.childNodes;
            if(cn && cn.length > 0){
				//destroy everything in a few ms to avoid memory leaks
				//remove them all and copy objs into new array
				$.asap(cleanUpAsap, {}, [slice.apply(cn, [0]), kill]);
            }
			//cleanUp this node
			if(itself) cleanUpNode(node, kill);
        }
		
        // Like setTimeout(fn, 0); but much faster
		var timeouts = [];
		var contexts = [];
		var params = [];
        
        $.asap = function(fn, context, args) {
			if(!$.isFunction(fn)) throw "$.asap - argument is not a valid function";
            timeouts.push(fn);
			contexts.push(context?context:{});
			params.push(args?args:[]);
			//post a message to ourselves so we know we have to execute a function from the stack 
            window.postMessage("jqm-asap", "*");
        }
		window.addEventListener("message", function(event) {
            if (event.source == window && event.data == "jqm-asap") {
                event.stopPropagation();
                if (timeouts.length > 0) {	//just in case...
                    (timeouts.shift()).apply(contexts.shift(), params.shift());
                }
            }
        }, true);

        
        var remoteJSPages={};
        $.parseJS= function(div) {
            if (!div)
                return;
            if(typeof(div)=="string"){
                var elem=document.createElement("div");
                elem.innerHTML=div;
                div=elem;
            }
            var scripts = div.getElementsByTagName("script");
            div = null;            
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src.length > 0 && !remoteJSPages[scripts[i].src]) {
                    var doc = document.createElement("script");
                    doc.type = scripts[i].type;
                    doc.src = scripts[i].src;
                    document.getElementsByTagName('head')[0].appendChild(doc);
                    remoteJSPages[scripts[i].src] = 1;
                    doc = null;
                } else {
                    window.eval(scripts[i].innerHTML);
                }
            }
        };
		

        
        var eventtrigger=["click","keydown","keyup","keypress","submit","load","resize","change","select","error"];
		for(var i=0,len=eventtrigger.length;i<len;i++)
            $.fn[eventtrigger[i]]=function(cb){
                return cb?this.bind(eventtrigger[i],cb):this.trigger(eventtrigger[i]);
            }
        return $;

    })(window);
    '$' in window || (window.$ = jq);
    //Helper function used in jq.mobi.plugins.
    if (!window.numOnly) {
        window.numOnly = function numOnly(val) {
			if (val===undefined || val==='') return 0;
			if ( isNaN( parseFloat(val) ) ){
				if(val.replace){
					val = val.replace(/[^0-9.-]/, "");
				} else return 0;
			}  
            return parseFloat(val);
        }
    }
}
