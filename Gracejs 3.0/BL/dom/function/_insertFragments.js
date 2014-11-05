
define([], function() {
	function _insertFragments(jqm,container,insert){
		var frag=document.createDocumentFragment();
		if(insert){
			for(var j=jqm.length-1;j>=0;j--)
			{
				frag.insertBefore(jqm[j],frag.firstChild);
			}
			container.insertBefore(frag,container.firstChild);
		
		}
		else {
		
			for(var j=0;j<jqm.length;j++)
				frag.appendChild(jqm[j]);
			container.appendChild(frag);
		}
		frag=null;
	}
	return _insertFragments;
});