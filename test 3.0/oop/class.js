require(['g','oop/Class'],function(g){
	
	var cell=g.Class(function Cell(){this.name='细胞';});
	
	var animal=g.Class(function Animal(){
		
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

