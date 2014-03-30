require(['BL'],function($){
	
	var html= $('div:first-child')[0].outerHTML,t='';
	//for(var i=0;i<2000;i++) $('body').append(html);
/*	console.time('BL2')
	for(var i=0;i<10000;i++) $(document.querySelectorAll('#aaa')[0].querySelectorAll('a'));
	console.log($(document.querySelectorAll('#aaa')[0].querySelectorAll('a')))
	console.timeEnd('BL2')*/
	
	//for(var i=0;i<100000;i++)$['sdfsfd'+i]=function(){};
	console.log(typeof [])
	
	console.time('BL')
	for(var i=0;i<100000;i++) $('#aaa a')
	console.log($('#aaa a'))
	console.timeEnd('BL')
	/*
	var div=$('<div data-util="chzn">');
	
	$.extend({
		'util:chzn':function(el){
			this.html('!!!!!!!!');
		},
		'util:chzn_':function(el){
			//this.beforeTo('body');
		},
	})
	
	
	
	
	
	console.log($('#aaa,#bbb'))
	console.time('BL')
	for(var i=0;i<10000;i++) $('body')[0].querySelectorAll('#aaa,#bbb')
	console.log($('body')[0].querySelectorAll('#aaa,#bbb').length)
	console.timeEnd('BL')
	console.time('BL2')
	for(var i=0;i<10000;i++) document.querySelectorAll('#aaa')[0].querySelectorAll('>a');
	console.log(document.querySelectorAll('#aaa')[0].querySelectorAll('>a').length)
	console.timeEnd('BL2')
	
	
	
	
	$('div').append(div);
	console.time('BL')
	var a2=$('a[_id]').eq(2)
	a2.attr("sdf",44);
	a2.destroy();
	a2.removeAttr('sdf');
	console.timeEnd('BL')*/
});