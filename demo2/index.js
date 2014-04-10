require(['package'],function(G){
	setTimeout(function(){
		G.Package.load(['people','common'],function(C,$){
			console.log(C);
			//alert('yeah!!')
		});
	},2000);
});
