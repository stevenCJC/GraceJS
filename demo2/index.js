require(['package'],function(G){
	setTimeout(function(){
		G.Package.load('people',function(C,$){
			console.log(C);
			alert('yeah!!')
		});
	},2000);
});
