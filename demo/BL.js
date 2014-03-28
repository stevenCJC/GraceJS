require(['BL'],function($){
	
	var html= $('div:first-child')[0].outerHTML,t='';
	for(var i=0;i<100;i++) $('body').append(html);
	console.time('BL')
	$('a').one('click',function(){});
	console.timeEnd('BL')
	
	
	
	$.extend({
		'util:chzn':function(el){
			this.html('CHZN!!!');
		},
	})
	
	$('a').init();
	
});