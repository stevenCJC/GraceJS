// JavaScript Document
var require = { 
	//baseUrl:'D:/GraceJS/src',
	waitSeconds:6000,
	baseUrl:'/src',
	paths: {
		g:'var/g',
		jquery:"../newOOP/libs/jquery-2.0.0.min",
		jqm:'../newOOP/libs/jq.mobi',
		
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
