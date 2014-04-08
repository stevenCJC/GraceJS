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
		demo:'../demo2/demo', 
		grace:'grace',
		//grace:'../dist/grace', 
		pages:'../demo2/page',
		utils:'../demo2/utils',
		widgets:'../demo2/widgets',
		pp:'plugins/$',
	},
	shim:{
		//grace:{deps:['pp']}
		jqm:{exports:'window.jqm'}
	},
	packages: [
		{name:'people',		main:'../demo2/people/main'}, 
		{name:'common',		main:'../demo2/common/main'}
	],
};
