require(['g','oop/Event'],function(g,Event){
	
	
	var ev=new Event();
	
	ev.on('alert',function(d){console.log(this.a+(d?d.b:0));},{a:1000});
	ev.on('alert.1',function(d){console.log(this.a+(d?d.b:0));},{a:2000});
	ev.on('alert.2',function(d){console.log(this.a+(d?d.b:0));},{a:3000});
	
	ev.trigger('alert');
	ev.trigger('alert.1');
	ev.off('alert.1');
	ev.trigger('alert',{b:11},{a:111111});
	
});

