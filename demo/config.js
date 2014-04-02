// JavaScript Document
var require = { 
	//baseUrl:'D:/GraceJS/src',
	baseUrl:'/src',
	paths: {
		$:'BL/Blink/$',
		BLs:'../dist/$',
		blk:'BL/Blink',
		p:'oop/package',
		jquery:"../demo/libs/jquery-2.0.0.min",
		jqm:'../demo/libs/jq.mobi',
		demo:'../demo/demo', 
		grace:'grace',
		//grace:'../dist/grace', 
		pages:'../demo/page',
		utils:'../demo/utils',
		widgets:'../demo/widgets',
		pp:'plugins/$',
	},
	shim:{
		//grace:{deps:['pp']}
		jqm:{exports:'window.jqm'}
	}
};
