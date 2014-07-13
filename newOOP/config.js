// JavaScript Document
var require = { 
	//baseUrl:'D:/GraceJS/src',
	waitSeconds:6000,
	baseUrl:'/src',
	paths: {
		$:'BL/Blink/$',
		BLs:'../dist/$',
		blk:'BL/Blink',
		p:'oop/package',
		jquery:"../newOOP/libs/jquery-2.0.0.min",
		jqm:'../newOOP/libs/jq.mobi',
		index:'../newOOP/index', 
		pcks:'../newOOP/packages',
		
		grace:'grace',
		//grace:'../dist/grace', 
		pages:'../newOOP/page',
		utils:'../newOOP/utils',
		widgets:'../newOOP/widgets',
		
	},
	shim:{
		//grace:{deps:['pp']}
		jqm:{exports:'window.jqm'}
	},
};
