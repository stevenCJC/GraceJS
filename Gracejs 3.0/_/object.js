define(['g','./function/deepClone'], function(g,deepClone) {
	// Retrieve the names of an object's properties.
	// Delegates to **ECMAScript 5**'s native `Object.keys`
	var object={
		
		each:function(obj,cb){
			if(typeof obj=='object')
				for(var x in obj)	cb(obj[x],x,obj);
		},
		
		keys : Object.keys,
		
		has : function (obj, key) {
			return obj.hasOwnProperty(key);
		},
		
		values : function (obj) {
			var values = [];
			for (var key in obj)
				if (object.has(obj, key))
					values.push(obj[key]);
			return values;
		},
		
		extend : function(target) {
			var ukey,key;
			var a= Array.prototype.slice.call(arguments, 1);
			for(var i=0,l=a.length;i<l;i++)
				for (key in a[i])
					target[key] = a[i][key];
			return target;
		},
		
		// Create a (shallow-cloned) duplicate of an object.
		clone : function (obj) {
			if (typeof obj != 'object')
				return obj;
			return obj.constructor==Array ? obj.slice() : object.extend({}, obj);
		},
		
		deepClone:deepClone,
		
		jsonClone:function (obj) {
			if (typeof obj != 'object')
				return obj;
			return JSON.parse(JSON.stringify(obj));
		},
		
		
		
	}
	
	g.object=g.o=object;
	
	return g.object;
});