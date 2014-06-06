require(['package'],function(G){
	//setTimeout(function(){
		console.time('index');
		G.App(['people'],function(C,$){
			//console.log(C);
			console.log(window.packages);
			new C.View.index();
			$('a').chzn(' index ');
			console.timeEnd('index');
			//alert('yeah!!')
		});
	//},2000);
	
});

