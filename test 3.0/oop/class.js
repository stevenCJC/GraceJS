require(['g','oop/Class'],function(g){
	
	var A=g.Class(function AA(){
		this.a='细胞';
	});
	
	var B=g.Class(function BB(){
		console.log('animal');
	},{
		Inherit:A,
		bbbb:function(){},
	});
	
	var C=g.Class(function CC(){
		console.log(this.Name||'dog');
	},{
		Inherit:B,
		cccc:function(){},
	});
	
	var D=g.Class(function DD(){
		this.d='这是大猫';
	},{
		Extend:[A,D,C],
		dddd:function(){
			this.ddd();
		},
		ddd:function(){},
	});
	
	function UU(){}
	UU.prototype={
		constructor:UU,
		uuuuu:function(){},
	}
	function QQ(){}
	QQ.prototype={
		constructor:QQ,
		qqqqq:function(){},
	}
	
	var DD=g.Class(D,{
		Name:'DDDD',
		Extend:[UU,C],
		ddd:function(){
			this.ddog();
		},
		dd:function(){},
	});
	var aa=g.Class(C,{
		Name:'AAA',
		Extend:[A],
		aaaaa:function(){
			this.aaaaa();
		},
		aaaaa:function(){},
	});
	
	
	function WW(){}
	WW.prototype={
		constructor:WW,
		www:function(){},
	}
	
	g.Class(WW).extend(B,QQ,UU,{
		wwwww:function(){},
		www:function(r){alert(8);},
	});
	
	var t1=g.Class();
	var t2=g.Class({});
	var t3=g.Class({a:12,b:function(){}});
	
	console.log({1:WW,2:DD,3:D});
	
	console.log(new t1());
	console.log(new t2());
	console.log(new t3());
	
	
	console.log(new A());
	console.log(new C());
	console.log(new D());
	console.log(new DD());
	console.log(new aa());
	console.log(new QQ());
	console.log(new WW());
	
	
	
	
	
	
	
});

