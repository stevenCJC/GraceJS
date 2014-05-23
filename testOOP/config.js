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
		jquery:"../testOOP/libs/jquery-2.0.0.min",
		jqm:'../testOOP/libs/jq.mobi',
		index:'../testOOP/index', 
		pcks:'../testOOP/packages',
		grace:'grace',
		//grace:'../dist/grace', 
		pages:'../testOOP/page',
		utils:'../testOOP/utils',
		widgets:'../testOOP/widgets',
		
	},
	shim:{
		//grace:{deps:['pp']}
		jqm:{exports:'window.jqm'}
	},
	packages: [
		{name:'people',		main:'../../testOOP/packages/people/main'}, 
		{name:'common',		main:'../../testOOP/packages/common/main'},
		{name:'base',		main:'../../testOOP/packages/base/main'},
		{name:'bbb',		main:'../../testOOP/packages/bbb/main'}, 
	],
};
