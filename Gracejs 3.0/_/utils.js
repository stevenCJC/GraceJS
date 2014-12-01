define(['g','./extend/md5','./var/_ids'], function(g ,md5 ,_ids) {
	
	var utils={
		sid:function(ns){
			if(!_ids[ns])_ids[ns]=1;
			else _ids[ns]++;
			return _ids[ns];
		},
		md5 :　md5,
		call : function( context, args, func ){
			context=context||this;
			switch(args.length){
				case 0:
				func.call(context);
				break;
				case 1:
				func.call(context,args[0]);
				break;
				case 2:
				func.call(context,args[0],args[1]);
				break;
				case 3:
				func.call(context,args[0],args[1],args[2]);
				break;
				case 4:
				func.call(context,args[0],args[1],args[2],args[3]);
				break;
				case 5:
				func.call(context,args[0],args[1],args[2],args[3],args[4]);
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
