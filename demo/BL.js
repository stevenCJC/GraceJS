require(['BL'],function($){
	
	var html= $('div:first-child').elems[0].outerHTML,t='';
	
	function uuuuuuuuuuuuu(){
		for(var i=0;i<1000;i++) $('body').append(html);
	}
	
	uuuuuuuuuuuuu();
	
	$.extend({
		'util:chzn':function(el){
			this.html('CHZN!!!');
		},
	})
	
	$('a').init();
	
});