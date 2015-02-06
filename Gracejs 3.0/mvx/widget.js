define(['g', 'oop/base','./common/css','./common/mediator','./common/tpl','_/utils','_/is'],
function (g, Base, Css, mediator, tpl) {

	var _extends=[Css,mediator,tpl];
	
	var BaseFactory=g.Base.Factory;
	
	var WidgetFactory=g.Class(function WidgetFactory(){
			this.extendOptions.push('Subscribe');
		},{
		Inherit:BaseFactory,
		stack:function(){
			WidgetFactory.Super.stack.call(this);
			this.extends=this.extends.concat(_extends); 
			//引入Model
			this.extends.push({ 
				destroy : function () { 
					this.el=null; 
					this.off(); 
					for (var p in this) { 
						if (this.hasOwnProperty(p)) { 
							delete this[p]; 
						} 
					} 
					this.destroy = function () {}; 
				} 
			}); 
		}, 
		extend:function(){
			
			this.Constructor.prototype.__blacklist__=['__onCreate','__onInstantiate','__onDestroy'];
			
			WidgetFactory.Super.extend.call(this);
			
			this.Constructor.prototype.__type__='WIDGET'; 
			this.Constructor.prototype.__extendlist__=['options','Subscribe']; 
			
			var i=0;
			while(_extends[i++])
				if(_extends[i-1].__onCreate) 
					_extends[i-1].__onCreate.call(this,_extends);
			
			
		},
		makeConstructor_ : function () { 
			if (this.parent !== this.Empty && this.parent != this.constr){ 
				Widget.prototype.__name__ = this.name; 
				var func=this.constructorCallback(); 
				function Widget() { 
					g.utils.call(func,arguments,this); 
				} 
				this.Constructor=Widget; 
			}else this.Constructor =  this.constr; 
		}, 
		
		
		construct:function(configs){ 
			WidgetFactory.Super.construct.call(this,configs);
			if(this._sid) return;
			this._sid='widget_'+g.utils.sid('widget');
			g.Widget._widgets[g.Widget._widgets]=this;
			var i=0;
			while(_extends[i++])
				if(_extends[i-1].__onInstantiate) 
					_extends[i-1].__onInstantiate.call(this);
			
		}, 
		
		
		
	});
	
	
	
	
	var wf=new WidgetFactory(1);
	
	g.Widget = function(){ 
		return wf.create(arguments[0],arguments[1]);
	};
	g.Widget.Factory=WidgetFactory;
	
	g.Widget._widgets={};
	
	return g.Base;
});
