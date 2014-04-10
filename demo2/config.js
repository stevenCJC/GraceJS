// JavaScript Document
var require = { 
	//baseUrl:'D:/GraceJS/src',
	baseUrl:'/src',
	paths: {
		$:'BL/Blink/$',
		BLs:'../dist/$',
		blk:'BL/Blink',
		p:'oop/package',
		jquery:"../demo2/libs/jquery-2.0.0.min",
		jqm:'../demo2/libs/jq.mobi',
		index:'../demo2/index', 
		pcks:'../demo2/packages',
		grace:'grace',
		//grace:'../dist/grace', 
		pages:'../demo2/page',
		utils:'../demo2/utils',
		widgets:'../demo2/widgets',
		
	},
	shim:{
		//grace:{deps:['pp']}
		jqm:{exports:'window.jqm'}
	},
	packages: [
		{name:'people',		main:'../../demo2/packages/people/main'}, 
		{name:'common',		main:'../../demo2/packages/common/main'}
	],
};
