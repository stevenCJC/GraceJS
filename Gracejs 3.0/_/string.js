define(['g','_/is'], function(g) {
	g.string=g.s={
		
		ifJson:function(s){
			if(g.is.jsonString(s)) return JSON.parse(s);
			else return s;
		},
		
		
		parse:function(){},
		
	}
	
		
		
	
	
});

if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, '');
		return this
	};
}