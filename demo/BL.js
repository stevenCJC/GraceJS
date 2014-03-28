require(['BL'],function($){
	
	console.log($);
	
	var a=$('a');
	if(!$.isString(a))
		$('a').append('0');
	
	$.each($('a'),function(a){
		a.append('555');
		
	});
	
	
});