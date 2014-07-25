define(['./_selectorAll','./_shimNodes'], function(_selectorAll,_shimNodes) {
	
	function _selector(selector, what) {
		selector=selector.trim();
		if (selector[0] === "#" && selector.indexOf(",")==-1 && selector.indexOf(".")==-1 && selector.indexOf(" ")===-1 && selector.indexOf(">")===-1){
			if (what == document)
				_shimNodes(what.getElementById(selector.replace("#", "")),this);
			else
				_shimNodes(_selectorAll(selector, what),this);
		}  else if (selector[0] === "<" && selector[selector.length - 1] === ">"){
			var tmp = document.createElement("div");
			tmp.innerHTML = selector.trim();
			_shimNodes(tmp.childNodes,this);
		} else {
			_shimNodes((_selectorAll(selector, what)),this);
		}
		return this;
	}
	
	return _selector;
});