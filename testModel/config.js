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
		jquery:"../testModel/libs/jquery-2.0.0.min",
		jqm:'../testModel/libs/jq.mobi',
		index:'../testModel/index', 
		pcks:'../testModel/packages',
		grace:'grace',
		//grace:'../dist/grace', 
		pages:'../testModel/page',
		utils:'../testModel/utils',
		widgets:'../testModel/widgets',
		
	},
	shim:{
		//grace:{deps:['pp']}
		jqm:{exports:'window.jqm'}
	},
	packages: [
		{name:'people',		main:'../../testModel/packages/people/main'}, 
		{name:'common',		main:'../../testModel/packages/common/main'},
		{name:'base',		main:'../../testModel/packages/base/main'},
		{name:'bbb',		main:'../../testModel/packages/bbb/main'}, 
	],
};
