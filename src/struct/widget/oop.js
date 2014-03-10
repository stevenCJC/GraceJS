define(["./core",'oop/baseClass'], function(G,baseClass) {

	G.Extend('grace',{
		
		Rebuilt:function(path,options){
			
			if(!options) options='*';
			else options=options.split(/\s|\,/g);
			baseClass.path=path;
			baseClass.options=options;
			baseClass.type='REBUILT';
			return this;
		},
		
		Inherit:function(path,options){
			if(!options) options='*';
			else options=options.split(/\s|\,/g);
			baseClass.path=path;
			baseClass.options=options;
			baseClass.type='INHERIT';
			return this;
		}
	});
});
