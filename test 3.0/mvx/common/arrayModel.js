require(['g','mvx/common/ArrayModel'],function(g,ArrayModel){
	
	var a=[{a:1,b:2},{a:2,b:1},{a:1,b:1}];
	
	var am=new ArrayModel(a);
	am.shift();
	console.log(am);
	console.log(am.find({a:1,b:1}))
	console.log(am.toString());
});

