require(['BL'],function($){
	
	var html= $('div:first-child')[0].outerHTML,t='';
	for(var i=0;i<2;i++) $('body').append(html);
	
	
	
	
	$.extend({
		'util:chzn':function(el){
			this.html('CHZN!!!');
		},
		'util:chzn_':function(el){
			this.html('??');
		},
	})
	
	$('a').init();
	console.time('BL')
	var a2=$('a[_id]').eq(2)
	a2.attr("sdf",44);
	a2.destroy();
	a2.removeAttr('sdf');
	console.timeEnd('BL')
});