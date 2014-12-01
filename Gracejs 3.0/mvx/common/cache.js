define(['g','_/utils','_/is'], function(g) {
	
	function Cache(){ }
	
	Cache.prototype={
		constructor:Cache,
		id:function(el,toMake){
			var id,el=g.q(el);
			if(id=el.attr('_sid_'))
				return id;
			else {
				if(toMake===undefined||toMake){
					id=g.sid('element');
					el.attr('_sid_',id);
					return id;
				}else return false;
			}
		},
		
		slim:function(el){
			el=g.q(el);
			var id=el.attr('_sid_');
			if(id&&!this.hasObj(id))
				el.removeAttr('_sid_');
			return id;
		},
		
		hasObj:function(id){
			return this[id].widgets&&this[id].widgets.length||this[id].events&&this[id].events.length;
		},
		
		clear:function(el){
			var id;
			if(el&&!isNaN(el)) {
				id=el;
				el=g.q('[_sid_="'+id+'"]');
			}else{
				el=g.q(el);
				id=el.attr('_sid_');
			}
			if(id&&this[id]){
				for(x in this[id].widgets) if(x!='length')this[id].widgets[x].destroy();
				if(this[id].events.length) el.off();
				this.slim(el);
			}
		},
		getWidget:function(id,name){
			if(g.is.element(id)) id=this.id(id);
			if(this[id]&&this[id].widgets[name]) return this[id].widgets[name];
		},
		//一个元素不能被相同组件多次初始化
		addWidget:function(id, widget){
			if(g.is.element(id)) id=this.id(id);
			if(!this[id]) this[id] ={widgets:{length:0},events:[]};
			if(!this[id].widgets[widget.__name__]) {
				this[id].widgets[widget.__name__]=widget;
				this[id].widgets.length++;
			}else throw 'one element could not be inited twice by a widget :'+widget.__name__;
		},
		delWidget:function(id, widget){
			if(g.is.element(id)) id=this.id(id);
			if(this[id]){
				if(widget){
					if(this[id].widgets[widget.__id__]) widget.destroy();
					delete this[id].widgets[widget.__id__];
					this[id].widgets.length--;
				}else{
					for(x in this[id].widgets) if(x!='length')this[id].widgets[x].destroy();
				}
			}
		},
		
		addEvent:function(id, event){
			if(g.is.element(id)) id=this.id(id);
			if(!this[id]) this[id] ={widgets:{length:0},events:[]};
			this[id].events.push(event);
		},
		getEvent:function(id){
			if(g.is.element(id)) id=this.id(id);
			if(this[id]) return this[id].events;
		},
		delEvent:function(id, event){
			if(g.is.element(id)) id=this.id(id);
			if(this[id]) this[id].events=[];
		},
		
		remove:function(id){
			
			
		},
		
		
	};
	
	g.cache=g.c=new Cache();
	
});

