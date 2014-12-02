require(['g','oop/Base'],function(g){
	
	var cell=g.Base(function Cell(){this.name='细胞';});
	
	var animal=g.Base(function Animal(){
	},{
		Attrs:{
			name:'any thing',
		},
		Extend:cell,
		eat:function(){console.log(this.get('name'));},
	});
	
	var dog=g.Base(animal,{
		Attrs:{
			weight:100,
			height:50,
			name:'wangwang'
		},
		Name:'Dog',
		wang:function(){},
		eat:function(){
			console.log(this.get('name'));
		},
	});
	
	var cat=g.Base(function Cat(){
		console.log(this.Attrs);
		this.miao();
		this.eat();
	},{
		Inherit:animal,
		Attrs:{
			weight:60,
			height:30,
			miao:'miaomiao'
		},
		miao:function(){
			console.log(this.get('miao'));
		},
	});
	
	//console.log(new animal());
	
	//console.log(new dog());
	console.log({a: cat});
	var c=new cat({a:2,miao:'sdfsdf',ww:{getter:function(){return this.attrs.weight/1000;},setter:function(v){this.attrs.weight=v*1000;}}});
	console.log(c);
	c.on('change:ww',function(e){
		console.log(e);
	});
	console.log(c.get('ww'));
	c.set({ww:3});
	console.log(c.get('ww'));
	
	
	
	
	
	
});

