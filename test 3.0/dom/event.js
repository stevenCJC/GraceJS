require(['g','dom/event'],function(g){
	
	g.q('#aaa').on('click',function(e){
		this.innerHTML=this.innerHTML+'2';
	}).off('click');
	g.q('#bbb').on('click.1',function(e){
		this.innerHTML=this.innerHTML+'1';
	});
	g.q('#bbb').on('click.2',function(e){
		this.innerHTML=this.innerHTML+'2';
	});
	g.q('#bbb').trigger('click');
	g.q('#bbb').off('click.2');
	g.q('#bbb').trigger('click');
	console.log(g.q._domEvent);
});

