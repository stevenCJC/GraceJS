define(['g', './Class', './Event', './aspect', './attribute','_/utils','_/is'],
function (g, Class, Event, aspect, attribute) {

	
	
	var ClassFactory=g.Class.Factory;
	
	var BaseFactory=Class(function BaseFactory(){
			this.extendOptions=['Attrs'];
		},{
		Inherit:ClassFactory,
		stack:function(){
			BaseFactory.Super.stack.call(this);
			this.extends.push(Event);
			this.extends.push(aspect);
			this.extends.push(attribute);
			
			this.extends.push({
				__type__ : 'BASE',
				destroy : function () {
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
			BaseFactory.Super.extend.call(this);
			this.Constructor.prototype.__blacklist__=['__type__'];
			this.Constructor.prototype.__extendlist__=['Attrs'];
		},
		makeConstructor_ : function () {
			if (this.parent !== this.Empty && this.parent != this.constr){
				Base.prototype.__name__ = this.name;
				var func=this.constructorCallback();
				function Base() {
					g.utils.call(func,arguments,this);
				}
				this.Constructor=Base;
			}else this.Constructor =  this.constr;
		},
		constructorCallback:function (){
			var constr=this.constr, 
				parent=this.parent, 
				props=this.props; 
			
			this.implement(constr,parent,props);
			
			var construct=this.construct;
			
			return function(){
				var configs;
				if(g.is.object(arguments[0])) configs=arguments[0];
				
					construct.call(this,configs);
					
				if(parent)
					g.utils.call(parent, arguments, this);
					
				if (parent != constr)
					g.utils.call(constr, arguments, this);
			};
		},
		
		construct:function(configs){
			//init attrs
			attribute._attrInit.call(this,configs||{});
			//BaseFactory.prototype.attrConstruct.call(this,configs);
		},
		
		implement:function(){
			if(this.parent){
				var imps=this.extendOptions,_parent;
				
				for(var i=0;i<imps.length;i++){
					_parent=this.parent.prototype[imps[i]];
					if(!_parent) continue;
					this.props[imps[i]]=this.props[imps[i]]||{};
					for(var x in _parent)
						this.props[imps[i]][x]=_parent[x];
				}
			}
		},
		
		
		
	});
	

	
	
	var bf=new BaseFactory(1);
	
	g.Base = function(){ 
		return bf.create(arguments[0],arguments[1]);
	};
	g.Base.Factory=BaseFactory;
	return g.Base;
});
