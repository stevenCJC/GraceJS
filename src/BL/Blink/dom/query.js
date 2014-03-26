define(['$'], function ($) {

	$.extend($.fn , {

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
		
		end: function() {
			return this.oldElement != undefined ? this.oldElement : $();
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
		

	});
	return $;
});
