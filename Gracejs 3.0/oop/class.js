define(['g','_/utils'],function(g){
	
	/*
	扩展父类，创建子类
	Class(constructor,{
		Extend: Flyable,//创建时批量输入
	});
	继承父类，创建子类，执行父类构造函数
	Class(constructor,{
		Inherit: Animal,//继承，将执行父类构造函数
		Extend: [Flyable,Class2,Class3],//创建时批量输入
	});
	
	扩展父类，不创建子类
	SubClass.extend({
		method1:...
		method2:...
	},class2,class3);
	
	扩展父类，创建子类
	Class(PClass,{
		Extend: Flyable,//创建时批量输入
		method1:...
		method2:...
	});
	
	
	Class方法可创建新类
	extend不创建新类
	
	*/

	// Create a new Class
	//
	//  var SuperPig = Class({
	//    Extends: Animal,
	//    Implements: Flyable,
	//    constructor: function() {
	//      SuperPig.superclass.constructor.apply(this, arguments)
	//    },
	//    Statics: {
	//      COLOR: 'red'
	//    }
	// })
	//
	//应该改一下第一个参数的作用 --> 构造函数

	function Class(constructor, properties) {
		
		if (!isFunction(constructor)) {
			properties = constructor;
			constructor=properties.constructor||function Empty(){};
		} else { // 将第一个参数改为构造函数
			if(!properties) {
				return classify(constructor);
			}
		}
		
		delete properties.constructor;
		
		var parent = properties.Extends || Class;

		properties.Extends = parent;
		
		
		if(!properties.__type__) 
			properties.__type__=parent.prototype.__type__?parent.prototype.__type__.toLowerCase():'class';
		if(!properties.__name__) 
			properties.__name__=constructor.name||'Extend';
		
		
		// 继承静态方法
		if (parent !== Class) {
			mix(constructor, parent, parent.StaticsWhiteList);
		}

		// Add instance properties to the subclass.
		implement.call(constructor, properties);

		// Make subclass extendable.
		return classify(constructor);
	}

	function implement(properties) {
		var key ;
		
		var mutators=Object.keys(Mutators);
		for(var i=0,l=mutators.length;i<l;i++)
			if(properties[mutators[i]]) {
				Mutators[mutators[i]].call(this, properties[mutators[i]]);
				delete properties[mutators[i]];
			}
		
		for (key in properties) {
			this.prototype[key] = properties[key];
		}
	}
	
	//扩展也需要定义构造函数，默认执行父类的构造函数
	// Create a sub Class based on `Class`. 
	function extend(constructor, properties) {
		var ext=this;
		if (!isFunction(constructor)) {
			properties=constructor;
			constructor=properties.constructor||function Empty(){};
		} else { // 将第一个参数改为构造函数
			if(!properties) properties={};
		}
		
		
		var dd =function (){
			if(ext!=Class)g.utils.call(this, arguments, ext);
			g.utils.call(this, arguments, constructor);
		}
		
		properties.constructor = dd;
		
		properties.Extends = ext;
		return Class(properties);
	}
	Class.extend=extend;
	function classify(cls) {
		cls.extend = extend;
		cls.implement = implement;
		return cls;
	}

	// Mutators define special properties.
	var Mutators = {

		'Extends' : function (parent) {
			
			var proto = createProto(parent.prototype);

			// Enforce the constructor to be what we expect.
			proto.constructor = this;

			// Set the prototype chain to inherit from `parent`.
			this.prototype = proto;

			// Set a convenience property in case the parent's prototype is
			// needed later.
			this.Super = parent.prototype;
		},

		'Implements' : function (items) {
			isArray(items) || (items = [items])
			var proto = this.prototype, item;
			while (item = items.shift()) {
				mix(proto, item.prototype || item)
			}
		},

		'Statics' : function (staticProperties) {
			mix(this, staticProperties);
		}
	}

	// Shared empty constructor function to aid in prototype-chain creation.
	function Ctor() {}

	// See: http://jsperf.com/object-create-vs-new-ctor
	//如果__proto__可访问，则会创造__proto__属性，指向父类的prototype，
	var createProto = Object.__proto__ ?
	function (proto) {
		return {
			__proto__ : proto
		};
	} : function (proto) {
		Ctor.prototype = proto;
		return new Ctor();
	};

	// Helpers
	// ------------

	function mix(r, s, wl) {
		// Copy "all" properties including inherited ones.
		for (var p in s) {
			if (s.hasOwnProperty(p)) {
				if (wl && indexOf(wl, p) === -1)
					continue;
				// 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
				if (p !== 'prototype') {
					r[p] = s[p];
				}
			}
		}
	}

	var toString = Object.prototype.toString;

	var isArray = Array.isArray || function (val) {
		return toString.call(val) === '[object Array]';
	};

	var isFunction = function (val) {
		return toString.call(val) === '[object Function]';
	};

	var indexOf = Array.prototype.indexOf ?
	function (arr, item) {
		return arr.indexOf(item)
	}
	 :
	function (arr, item) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (arr[i] === item) {
				return i
			}
		}
		return -1
	};
	
	g.Class=Class;
	
	return Class;

});