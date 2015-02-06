define(['g','./function/md5','./function/parsesid','./var/_ids'], function(g ,md5, parsesid, _ids) {
	
	var utils={
		trim:function(str){
			if(str) return str.replace(/(^\s*)|(\s*$)/g,'');
			else return str;
		},
		sid:function(ns){
			if(!_ids[ns])_ids[ns]=1;
			else _ids[ns]++;
			return _ids[ns];
		},
		parsesid:parsesid,
		md5 :　md5,
		New : function( construct, args ){
			switch(args.length){
				case 0:
				return new construct();
				break;
				case 1:
				return new construct(args[0]);
				break;
				case 2:
				return new construct(args[0],args[1]);
				break;
				case 3:
				return new construct(args[0],args[1],args[2]);
				break;
				case 4:
				return new construct(args[0],args[1],args[2],args[3]);
				break;
				case 5:
				return new construct(args[0],args[1],args[2],args[3],args[4]);
				break;
			}
		},
		call : function( context, args, func ){
			context=context||this;
			switch(args.length){
				case 0:
				return func.call(context);
				break;
				case 1:
				return func.call(context,args[0]);
				break;
				case 2:
				return func.call(context,args[0],args[1]);
				break;
				case 3:
				return func.call(context,args[0],args[1],args[2]);
				break;
				case 4:
				return func.call(context,args[0],args[1],args[2],args[3]);
				break;
				case 5:
				return func.call(context,args[0],args[1],args[2],args[3],args[4]);
				break;
			}
		},
		
		rand : function (min, max) {
			if (max == null ) {
				max = min;
				min = 0;
			}
			return min + Math.floor(Math.random() * (max - min + 1));
		},
	};
	
	g.utils=g.u=utils;
	
	return utils;
});
