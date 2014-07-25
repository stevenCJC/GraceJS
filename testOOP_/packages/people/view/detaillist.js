G.Package.View(function(View){
	
	/*
		<h1><%=obj.title%></h1><%#networkSublist obj.network%>
	*/
	View(function detaillist(obj){
		
		return '<h1>'+obj.title+'</h1>'+View.networkSublist(obj.network);
		
	});
	
	/*
		<h1><%=obj.title%></h1><%#../../common/networkSublist obj.network%>
	*/
	View(function networkSublist(obj){
		
		return '<h1>'+obj.title+'</h1>'+View('tenmic/common/networkSublist.html',obj.network);
		
	});

});

