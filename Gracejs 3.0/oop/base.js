define(['g', './Class', './Events', './aspect', './attribute','_/utils','_/is'],
function (g, Class, Events, aspect, attribute) {

	
	
	var ClassFactory=g.Class.Factory;
	
	var BaseFactory=Class(function BaseFactory(){},{
		Inherit:ClassFactory,
		extend:function(){
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
			
			BaseFactory.Super.extend.call(this);
			this.Constructor.prototype.__blacklist__=['__type__'];
			this.Constructor.prototype.__extendlist__=['Attrs'];
		},
		constructorCallback:function constructor__(){
			var constr=this.constr, parent=this.parent, props=this.props;
			
			implement(constr,parent,props);
			
			return function(){
				
				var configs;
				if(g.is.object(arguments[0])) configs=arguments[0];
				else if(g.is.object(arguments[1])) configs=arguments[1];
				
				if(!this._attrsInited) 
					construct.call(this,constr,parent,configs);
				if(parent)
					g.utils.call(this, arguments, parent);
				if (parent != constr)
					g.utils.call(this, arguments, constr);
			};
		},
	});
	

	
	function construct(constr,parent,configs){
		
		Mutator.Attrs.construct.call(this,constr,parent,configs);
		
	}
	
	function implement(constr,parent,props){
		
		Mutator.Attrs.implement.call(this,constr,parent,props);
		
	}
	
	var Mutator={
		Attrs:{
			implement:function(constr,parent,props){
				var opts_parent;
				console.log(arguments);
				if(parent)
					opts_parent=parent.prototype.Attrs;
					
				if(!opts_parent) return;
				props.Attrs=props.Attrs||{};
				
				if(opts_parent)
					for(var x in opts_parent)
						props.Attrs[x]=opts_parent[x];
			},
			construct:function(constr,parent,configs){
				this.attrInit(configs||{});
			},
		},
	}
	
	var bf=new BaseFactory(1);
	
	g.Base = function(){ 
		return bf.create(arguments[0],arguments[1]);
	};
	g.Base.Factory=BaseFactory;
	return g.Base;
});
