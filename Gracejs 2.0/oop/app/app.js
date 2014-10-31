define(['oop/package/function/addLoadQueue','oop/package/var/statusInfo'],function(addLoadQueue,statusInfo){

	function App(deps,init){
		statusInfo.pkgState='loading';
		addLoadQueue(deps,init);
	}
	
	return App;

});
