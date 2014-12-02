define(['g', './Class', './Events', './aspect', './attribute','_/utils','_/is'], function (g, Class, Events, aspect, attribute) {

	//需要重写
	var base=function(constructor_,properties){
		
		var bclass;
		if(arguments.length==1)
			bclass=Class(constructor_,constructor__);
		else if(arguments.length==2) bclass=Class(constructor_,properties,constructor__);
		else bclass=Class(function Empty(){},constructor__);
		
		
		function constructor__(constr,parent,props){
			
			implement(constr,parent,props);
			
			return function(){
				
				var configs;
				if(g.is.object(arguments[0])) configs=arguments[0];
				else if(g.is.object(arguments[1])) configs=arguments[1];
				
				
				
				if(parent){
					if(parent.prototype&&parent.prototype.__type__=='BASE')
						g.utils.call(this, arguments, parent);
					else {
						construct.call(this,constr,parent,configs);
						g.utils.call(this, arguments, parent);
					}
				}else {
					construct.call(this,constr,parent,configs);
				}
				if (parent != constr)
					g.utils.call(this, arguments, constr);
			};
		}
		
		bclass.extend(Events, aspect, attribute, {
			
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
		return bclass;
	};
	
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
		
		/*Options:{
			implement:function(constr,parent,props){
				var opts_parent;
				console.log(arguments);
				if(parent)
					opts_parent=parent.prototype.Options;
					
				if(!opts_parent) return;
				props.Options=props.Options||{};
				
				if(opts_parent)
					for(var x in opts_parent)
						props.Options[x]=opts_parent[x];
			},
			construct:function(constr,parent,configs){
				
			},
		},*/
	}
	
	
	g.Base = base;

	return base;
});
