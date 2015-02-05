define(['g', 'oop/base','./common/css','./common/mediator','./common/tpl','_/utils','_/is'],
function (g, Base, Css, mediator, tpl) {

	var _extends=[Css,mediator,tpl];
	
	var BaseFactory=g.Base.Factory;
	
	var WidgetFactory=g.Class(function WidgetFactory(){
			this.extendOptions.push('Subscribe');
		},{
		Inherit:BaseFactory,
		extend:function(){
			WidgetFactory.Super.extend.call(this);
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
		toExtend:function(){
			
			WidgetFactory.Super.toExtend.call(this);
			this.Constructor.prototype.__type__='WIDGET';
			this.Constructor.prototype.__extendlist__=['options','Subscribe'];
			
			//	截取参数
			//	var propo=this.Constructor.prototype,key;
			//  for(var i=0; i < _extends.length; i++){
			//		_extends[i].Options = _extends[i].Extended.call(_extends[i]);
			//	}
			
		},
		makeConstructor_ : function () { 
			if (this.parent !== this.Empty && this.parent != this.constr){ 
				Widget.prototype.__name__ = this.name; 
				var obj=this.constructorCallback(); 
				function Widget() { 
					g.utils.call(this,arguments,obj); 
				} 
				this.Constructor=Class; 
			}else this.Constructor =  this.constr; 
		}, 
		
		
		construct:function(configs){ 
			WidgetFactory.Super.construct.call(this,configs);
			if(this._sid) return;
			this._sid='widget_sid_'+g.utils.sid('widget');
			Css._cssInit.call(this);
			mediator._mediatorInit.call(this);
			tpl._tplInit.call(this);
			
			//  for(var i=0; i < _extends.length; i++){
			//		_extends[i].Init.call(this,_extends[i].Options);
			//		_extends[i].beforeExtend();
			//	}
			
		}, 
		
		
		
	});
	
	
	
	
	var wf=new WidgetFactory(1);
	
	g.Widget = function(){ 
		return wf.create(arguments[0],arguments[1]);
	};
	g.Widget.Factory=WidgetFactory;
	return g.Base;
});
