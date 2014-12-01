
var Class = (function () {
	function Class(o) {
		// Convert existed function to Class.
		if (!(this instanceof Class) && isFunction(o)) {
			return classify(o);
		}
	}

	// Create a new Class.
	//
	//  var SuperPig = Class.create({
	//    Extends: Animal,
	//    Implements: Flyable,
	//    initialize: function() {
	//      SuperPig.superclass.initialize.apply(this, arguments)
	//    },
	//    Statics: {
	//      COLOR: 'red'
	//    }
	// })
	//
	//应该改一下第一个参数的作用 --> 构造函数

	Class.create = function (_constructor, properties) {

		if (!isFunction(_constructor)) {
			properties = _constructor;
		} else { //将第一个参数改为构造函数
			properties.initialize = _constructor;
		}

		properties || (properties = {});

		var parent = properties.Extends || Class;

		properties.Extends = parent;

		// The created class constructor////??????
		function SubClass() {
			// Call the parent constructor.
			parent.apply(this, arguments); //貌似删掉也没差别

			// Only call initialize in self constructor.
			//执行自己的初始化函数，父类的初始化函数都不执行,
			if (this.constructor === SubClass && this.initialize) {
				this.initialize.apply(this, arguments);
			}
		}

		// Inherit class (static) properties from parent.
		if (parent !== Class) {
			mix(SubClass, parent, parent.StaticsWhiteList);
		}

		// Add instance properties to the subclass.
		implement.call(SubClass, properties);

		// Make subclass extendable.
		return classify(SubClass);
	}

	function implement(properties) {
		var key,
		value

		for (key in properties) {
			value = properties[key]
				// 遍历传入参数，特殊参数特殊处理，其他归入原型
				if (Class.Mutators.hasOwnProperty(key)) {
					Class.Mutators[key].call(this, value);
				} else {
					this.prototype[key] = value;
				}
		}
	}

	// Create a sub Class based on `Class`.
	Class.extend = function (properties) {
		properties || (properties = {});
		properties.Extends = this;
		return Class.create(properties);
	}

	function classify(cls) {
		cls.extend = Class.extend;
		cls.implement = implement;
		return cls;
	}

	// Mutators define special properties.
	Class.Mutators = {

		'Extends' : function (parent) {
			var existed = this.prototype;
			var proto = createProto(parent.prototype);

			// Keep existed properties.
			mix(proto, existed);

			// Enforce the constructor to be what we expect.
			proto.constructor = this;

			// Set the prototype chain to inherit from `parent`.
			this.prototype = proto;

			// Set a convenience property in case the parent's prototype is
			// needed later.
			this.superclass = parent.prototype;
		},

		'Implements' : function (items) {
			isArray(items) || (items = [items])
			var proto = this.prototype, item;
			while (item = items.shift()) {
				mix(proto, item.prototype || item)
			}
		},

		'Statics' : function (staticProperties) {
			mix(this, staticProperties)
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

	return Class;

})();
