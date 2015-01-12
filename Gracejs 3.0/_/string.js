define(['g','_/is'], function(g) {
	g.string=g.s={
		
		ifJson:function(s){
			if(g.is.jsonString(s)) {
				var json;
				try{
					json=JSON.parse(s);
				}catch(e){
					console.log('ERR JSON.parse',e);
					json=s;
				}
				return json;
			}
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