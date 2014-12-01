require(['g','oop/Base'],function(g){
	
	var cell=g.Base.extend(function Cell(){this.name='细胞';});
	
	var animal=g.Base.extend(function Animal(){
		
	},{
		Extends:cell,
		eat:function(){},
	});
	
	var dog=animal.extend(function Dog(){},{
		wang:function(){},
	});
	console.log(new animal());
	
	console.log(new dog());
	
	
	
	
	
	
	
	
	
	
	
	
});

