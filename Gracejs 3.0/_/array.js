define(['g'], function(g) {
	//面向复杂数组的情况下使用
	var array = {
		
		del:function(arr,index){
			var v=arr[index];
			arr.splice(index,1);
			return v;
		},
		
		add:function(arr,index,value){
			arr.splice(index,0,value);
		},
		
		sort:function(arr, field){
			if(arr.toString()!='[object Object]')
				return arr.sort(field);
			else {
				if(field.constructor==Function){
					
				}else if(field.constructor==String){
					
				}
			}
		},
		
		each:function ( arr, cb ) {
			if (!arr)
				return;
			for(var i=0,l=arr.length;i<l;i++){
				if(cb(arr[i],i)===false) break;
			}
		},
		// Return the results of applying the cb to each element.
		// Delegates to **ECMAScript 5**'s native `map` if available.
		map : function ( arr,cb ) {
			var results = [],t;
			if (!arr)
				return results;
			for(var i=0,l=arr.length;i<l;i++){
				t=cb(arr[i],i);
				if(typeof t!='undefined') results.push(t);
			}
			return results;
		},
	
		// Return the first value which passes a truth test. Aliased as `detect`.
		find : function (arr, cb) {
			if(!arr) return null;
			var r,t;
			if(!cb) return null;
			else if(cb.constructor==Function)
				for(var i=0,l=arr.length;i<l;i++){
					if(cb(arr[i],i)){
						return arr[i];
					}
				}
			else if(cb.constructor==Object)
				for(var i=0,l=arr.length;i<l;i++){
					r=arr[i];
					t=true;
					if(r&&typeof r=='object')
						for(var x in cb){
							if(r[x]!=cb[x]){
								t=false;
								break;
							}
						}
					else t=false;
					if(t) return r
				}
		},

		filter : function (arr, cb) {
			var results = [],r,t;
			if (arr == null)
				return results;
			if(!cb) return null;
			else if(cb.constructor==Function)
				for(var i=0,l=arr.length;i<l;i++){
					if(cb(arr[i],i)){
						results.push(arr[i]);
					}
				}
			else if(cb.constructor==Object)
				for(var i=0,l=arr.length;i<l;i++){
					r=arr[i];
					t=true;
					if(r&&typeof r=='object')
						for(var x in cb){
							if(r[x]!=cb[x]){
								t=false;
								break;
							}
						}
					else t=false;
					if(t) results.push(r);
 				}
			return results;
		},

		has : function (arr, target) {
			if (arr == null)
				return false;
			return arr.indexOf(target) != -1;
		},
		
		// Produce a duplicate-free version of the array. If the array has already
		// been sorted, you have the option of using a faster algorithm.
		// Aliased as `unique`.
		uniq :  function (arr) {
			var results=[];
			for(var i=0,l=arr.length;i<l;i++){
				if(results.indexOf(arr[i])==-1) results.push(arr[i]);
			}
			return results;
		},
		
		toString:function(arr){
			if(!arr) return '';
			if(arr.constructor!=Array||arr.toString()=='[object Object]') return JSON.stringify(arr.toArray?arr.toArray():arr);
			else return arr.toString();
			
		}
		
	}
	
	g.array=g.a=array;
	
	return array;
});
