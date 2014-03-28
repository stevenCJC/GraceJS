define(['$','./function/unique','./function/siblings','./function/_shimNodes','BL/Blink/_/main'], function ($,unique,siblings,_shimNodes) {

	$.extend({

		setupOld: function(params) {
			if (params == undefined)
				return $();
			params.oldElement = this;
			return params;
		},
		
		//如果callback返回数据，则返回[数据]，否则默认返回this
		each: function(callback) {
			var el=this,tmp,returns=[];
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
				tmpElems = $(sel, this[i]);
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
				var tmp=this[i];
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
				elems = elems.concat(siblings(this[i].firstChild));
			}
			return this.setupOld($((elems)).filter(selector));
		
		},
		
		siblings: function(selector) {
			if (this.length == 0)
				return this;
			var elems = [];
			for (var i = 0,len=this.length; i <len ; i++) {
				if (this[i].parentNode)
					elems = elems.concat(siblings(this[i].parentNode.firstChild, this[i]));
			}
			return this.setupOld($(elems).filter(selector));
		},
		
		closest: function(selector, context) {
			if (this.length == 0)
				return this;
			var elems = [], 
			cur = this[0];
			
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
				var val = this[i];
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
				var val = this[i];
				if (val.parentNode && $(selector, val.parentNode).indexOf(val) == -1)
					elems.push(val);
			}
			return this.setupOld($(unique(elems)));
		},
		
		add:function(elems){
			_shimNodes(elems,this);
			return this;
		},
		
		end: function() {
			return this.oldElement != undefined ? this.oldElement : $();
		},
		
		
	   
		eq:function(ind){
			var index;
			index = ind == undefined ? 0 : ind;
			if (index < 0)
				index += this.length;
			return $((this[index]) ? this[index] : undefined);
		},
		
		index:function(elem){
			return elem?this.indexOf($(elem)[0]):this.parent().children().indexOf(this[0]);
		},
		

	});
	return $;
});
