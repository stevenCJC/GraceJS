define(['g', '_/utils'], function (g) {

	function Class(constructor_, properties, constructorMaker) {
		//参数预处理
		if(isFunction(properties)) {
			constructorMaker=properties;
			properties={};
		}
		
		if(!isFunction(constructor_)) {
			properties=constructor_||{};
			constructor_=properties.constructor == Object ? Empty : properties.constructor;
		}else {
			properties=properties||{};
		}

		if (properties.constructor != Object)
			delete properties.constructor;

		var parent = properties.Inherit || (Object.keys(constructor_.prototype).length ? constructor_ : false) || Empty;

		var name = properties.Name || constructor_.name;
		
		
		delete properties.Name;

		properties.Inherit = parent;

		properties.Extend = properties.Extend || [];
		properties.Extend = properties.Extend.constructor == Array ? properties.Extend : [properties.Extend];


		//构造函数生成
		var constructor__;
		if (parent !== Empty)
			constructor__ =makeConstructor(name, constructorMaker ? constructorMaker(constructor_,parent,properties): function () {
					g.utils.call( parent, arguments, this);
					if (parent != constructor_)
						g.utils.call( constructor_, arguments, this);
				});
		else
			constructor__ =  constructorMaker ? makeConstructor(name,constructorMaker(constructor_,null,properties)): constructor_;

		
		
		//变异注入
		implement.call(constructor__, properties, parent != constructor__ && parent != Empty);

		//继承静态方法
		if (constructor__ != parent && parent != Empty)
			mix(constructor__, parent);

		//扩展静态方法
		return classify(constructor__);

		function Empty() {}
	}

	function implement(properties, inh) {

		inh && Mutators['Inherit'].call(this, properties['Inherit']);

		Mutators['Statics'].call(this, properties['Statics']);

		var _extends = properties['Extend'];

		delete properties['Inherit'];
		delete properties['Statics'];
		delete properties['Extend'];

		_extends.push(properties);
		Mutators['Extend'].call(this, _extends);
	}

	//扩展也需要定义构造函数，默认执行父类的构造函数
	// Create a sub Class based on `Class`.
	function extend() {
		Mutators['Extend'].call(this, Array.prototype.slice.call(arguments));
		return this;
	}

	function classify(cls) {
		cls.extend = extend;
		return cls;
	}

	// Mutators define special properties.
	var Mutators = {

		'Inherit' : function (parent) {
			var that = this;
			var proto = createProto(parent.prototype);

			// Enforce the constructor to be what we expect.
			proto.constructor = this;
			
			
			if (this.prototype.__name__)
				proto.__name__ = this.prototype.__name__ || 'Empty';

			this.prototype = proto;

			// Set a convenience property in case the parent's prototype is
			// needed later.
			this.Super = parent.prototype;
		},

		'Extend' : function (items) {
			var proto = this.prototype,
			item;
			var blacklist=proto.__blacklist__||[];
			var extendlist=proto.__extendlist__||[];
			while (items.length) {
				item = items.shift();
				item = item && item.prototype || item || {};
				if(item.__blacklist__) blacklist.concat(item.__blacklist__);
				if(item.__extendlist__) extendlist.concat(item.__extendlist__);
				mix(proto, item, blacklist,extendlist);
				
			}
		},

		'Statics' : function (staticProperties) {
			mix(this, staticProperties, staticProperties && staticProperties.__blacklist__);
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
	}
	 : function (proto) {
		Ctor.prototype = proto;
		return new Ctor();
	};

	function makeConstructor(name, obj) {
		window._tmp_obj_ = obj;
		window.eval('window._tmp_constructor_=(function(obj){' +
			'return function ' + name + '(){\n obj.apply(this,arguments);}' +
			'})(window._tmp_obj_)');
		var constructor = window._tmp_constructor_;
		delete window._tmp_constructor_;
		delete window._tmp_constructor_;
		delete window._tmp_obj_;
		return constructor;
	}

	function makeConstructor_(name, obj) {
		Constructor.prototype.__name__ = name;
		function Constructor() {
			obj.apply(this, arguments);
		}
		return Constructor;
	}

	function mix(target, obj, blacklist, extendlist) {
		if (obj)
			for (var p in obj) {
				if (blacklist && blacklist.indexOf(p) > -1)
					continue;
				if (obj.hasOwnProperty(p)) {
					// 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
					if (p !== 'prototype' && p != 'constructor' && p != '__name__'&& p != '__blacklist__'&& p != '__extendlist__') {
						if (extendlist && extendlist.indexOf(p) > -1){
							if(obj[p]&&typeof obj[p] == 'object'){
								target[p]=target[p]||{};
								for(var x in obj[p]) target[p][x]=obj[p][x];
							}
						}else target[p] = obj[p];
					}
				}
			}
	}
	
	
	var toString = Object.prototype.toString;

	var isFunction = function (val) {
		return toString.call(val) === '[object Function]';
	};

	g.Class = Class;

	return Class;

});
