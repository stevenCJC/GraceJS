require(['g','oop/Class'],function(g){
	
	var cell=g.Class(function Cell(){
		this.name='细胞';
		console.log('cell');
	});
	
	var animal=g.Class(function Animal(){
		console.log('animal');
	},{
		Inherit:cell,
		eat:function(){},
	});
	
	var dog=g.Class(function Dog(){
		console.log(this.Name||'dog');
	},{
		Inherit:animal,
		wang:function(){},
	});
	
	var xtq=g.Class(function XTQ(){
		this.name_='这是大猫';
	},{
		Extend:[cell,animal,dog],
		wang:function(){
			this.miao();
		},
		miao:function(){},
	});
	
	function uu(){}
	uu.prototype={
		constructor:uu,
		bleath:function(){},
	}
	function AA(){}
	AA.prototype={
		constructor:AA,
		AAAAAAAAA:function(){},
	}
	
	var ddog=g.Class(dog,{
		Name:'DDog',
		Extend:[uu,AA],
		wang:function(){
			this.ddog();
		},
		ww:function(){},
	});
	var aa=g.Class(AA,{
		Name:'AAA',
		Extend:[xtq],
		AAA:function(){
			this.ddog();
		},
		AAAA:function(){},
	});
	console.log(new animal());
	console.log(new dog());
	console.log(new xtq());
	console.log(new ddog());
	console.log(new aa());
	
	
	
	
	
	
	
	
	
});

