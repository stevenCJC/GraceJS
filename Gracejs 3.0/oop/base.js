define(['g', './Class', './Events', './aspect', './attribute','_/utils','_/is'],
function (g, Class, Events, aspect, attribute) {

	
	
	var ClassFactory=g.Class.Factory;
	
	var BaseFactory=Class(function BaseFactory(){},{
		Inherit:ClassFactory,
		extend:function(){
			BaseFactory.Super.extend.call(this);
			this.extends.push(Events);
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
		toExtend:function(){
			BaseFactory.Super.toExtend.call(this);
			this.Constructor.prototype.__blacklist__=['__type__'];
			this.Constructor.prototype.__extendlist__=['Attrs'];
		},
		makeConstructor_ : function () {
			if (this.parent !== this.Empty && this.parent != this.constr){
				Base.prototype.__name__ = this.name;
				var obj=this.constructorCallback();
				function Base() {
					g.utils.call(this,arguments,obj);
				}
				this.Constructor=Class;
			}else this.Constructor =  this.constr;
		},
		constructorCallback:function (){
			var constr=this.constr, 
				parent=this.parent, 
				props=this.props; 
			
			this.implement(constr,parent,props);
			
			var construct=BaseFactory.prototype.construct;
			
			return function(){
				var configs;
				if(g.is.object(arguments[0])) configs=arguments[0];
				else if(g.is.object(arguments[1])) configs=arguments[1];
				
				
					construct.call(this,configs);
					
				if(parent)
					g.utils.call(this, arguments, parent);
					
				if (parent != constr)
					g.utils.call(this, arguments, constr);
			};
		},
		
		construct:function(configs){
			//init attrs
			if(!this._attrsInited) 
				this.attrInit(configs||{});
			//BaseFactory.prototype.attrConstruct.call(this,configs);
		},
		
		implement:function(){
			this.attrImplement();
		},
		
		attrImplement:function(){
			var opts_parent;
			if(this.parent)
				opts_parent=this.parent.prototype.Attrs;
				
			if(!opts_parent) return;
			this.props.Attrs=this.props.Attrs||{};
			
			if(opts_parent)
				for(var x in opts_parent)
					this.props.Attrs[x]=opts_parent[x];
		},
		
	});
	

	
	
	var bf=new BaseFactory(1);
	
	g.Base = function(){ 
		return bf.create(arguments[0],arguments[1]);
	};
	g.Base.Factory=BaseFactory;
	return g.Base;
});
