define(['g'], function(g) {
	
	var is={
		
		// Is a given array, string, or object empty?
		// An "empty" object has no enumerable own-properties.
		empty : function (obj) {
			if (obj == null)
				return true;
			if (is.array(obj) || is.string(obj))
				return obj.length === 0;
			for (var key in obj)
				if (obj.hasOwnProperty(key))
					return false;
			return true;
		},
		
		// Is a given value a DOM element?
		element : function (obj) {
			return !!(obj && obj.nodeType === 1);
		},
	
		// Is a given value an array?
		// Delegates to ECMA5's native Array.isArray
		array : function(obj){
			return obj&&obj.constructor==Array;
		},
	
		// Is a given variable an object?
		object : function (obj) {
			return typeof obj === 'object';
		},
		date : function (obj) {
			return obj&&obj.constructor === Date;
		},
		
		regExp : function (obj) {
			return obj&&obj.constructor === RegExp;
		},
		
		Function : function (obj) {
			return typeof obj === 'function';
		},
		
		number : function (obj) {
			return typeof obj === 'number'||!isNaN(obj);
		},
		
		string : function (obj) {
			return typeof obj === 'string';
		},
		jsonString:function(s){
			if(!s||s.constructor!=String) return false
			return (s.charAt(0) == "{"||s.charAt(0) == "[") && (s.charAt(s.length - 1) == "}"||s.charAt(s.length - 1) == "]");
		},
		// Define a fallback version of the method in browsers (ahem, IE), where
		// there isn't any inspectable "Arguments" type.
		arguments : function (obj) {
			return !!(obj && obj.callee);
		},
	
		// Is a given variable undefined?
		undefined : function (obj) {
			return obj === void 0;
		},
	}
	
	g.is = is;
	
	return is;
});