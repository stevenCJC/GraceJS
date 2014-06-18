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
		jquery:"../testTD/libs/jquery-2.0.0.min",
		jqm:'../testTD/libs/jq.mobi',
		index:'../testTD/index', 
		pcks:'../testTD/packages',
		grace:'grace',
		//grace:'../dist/grace', 
		pages:'../testTD/page',
		utils:'../testTD/utils',
		widgets:'../testTD/widgets',
		
	},
	shim:{
		//grace:{deps:['pp']}
		jqm:{exports:'window.jqm'}
	},
	packages: [
		{name:'people',		main:'../../testTD/packages/people/main'}, 
		{name:'common',		main:'../../testTD/packages/common/main'},
		{name:'base',		main:'../../testTD/packages/base/main'},
		{name:'bbb',		main:'../../testTD/packages/bbb/main'}, 
	],
};
