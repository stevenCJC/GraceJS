define([], function() {
	function Engine(s){
		this.core=null;//初始化后将存储操作核心
		this.length=0;
		this.$(s);
	}
	return window.Engine=window.Engine||Engine;
});