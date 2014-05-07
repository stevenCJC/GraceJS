define(['oop/package/function/addLoadQueue'],function(addLoadQueue){

	function App(deps,init){
		addLoadQueue(deps,init);
	}
	
	return App;

});
