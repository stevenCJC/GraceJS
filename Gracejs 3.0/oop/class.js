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
		constructor:function ClassName(){}
		Extend: Flyable,//创建时批量输入
		method1:...
		method2:...
	});
	
	
	Class方法可创建新类
	extend不创建新类
	
	*/


	function Class(constructor, properties) {
		
		
		
		if (!isFunction(constructor)) {
			properties = constructor;
			constructor=properties.constructor|| Empty;
		} else { // 将第一个参数改为构造函数
			if(!properties) {
				return classify(constructor);
			}
		}
		
		delete properties.constructor;
		
		var parent = properties.Inherit || (Object.keys(constructor.prototype).length?constructor:false) || Empty;
		
		var name=properties.Name || constructor.name;
		delete properties.Name;
		
		properties.Inherit = parent;
		
		var constructor_;
		if(parent!==Empty)
			constructor_=makeConstructor(name,function(){
				g.utils.call(this,arguments,parent);
				if(parent!=constructor)g.utils.call(this,arguments,constructor);
			});
		else constructor_=constructor;
		
		properties.Extend=properties.Extend||[];
		properties.Extend=properties.Extend.constructor==Array?properties.Extend:[properties.Extend];
		properties.Extend.unshift(constructor);
		
		implement.call(constructor_, properties);
		
		
		/*if(!properties.__type__) 
			properties.__type__=parent.prototype.__type__?parent.prototype.__type__.toLowerCase():'class';
		if(!properties.__name__) 
			properties.__name__=constructor.name||'Extend';*/
		
		
		// 继承静态方法
		if (parent !== Class) {
			mix(constructor_, parent, parent.StaticsWhiteList);
		}
		if (constructor !== Class) {
			mix(constructor_, constructor, constructor.StaticsWhiteList);
		}
		// Make subclass extendable.
		return classify(constructor_);
	}
	
	function Empty(){};
	
	function implement(properties) {
		var mutators=['Inherit','Extend','Statics'];
		Mutators['Inherit'].call(this, properties['Inherit']);
		delete properties['Inherit'];
		Mutators['Statics'].call(this, properties['Statics']);
		delete properties['Statics'];
		var _extends=properties['Extend'];
		delete properties['Extend'];
		_extends.push(properties);
		Mutators['Extend'].call(this, _extends);
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

		'Inherit' : function (parent) {
			var that=this;
			var proto = createProto(parent.prototype);

			// Enforce the constructor to be what we expect.
			proto.constructor = this;

			// Set the prototype chain to inherit from `parent`.
			this.prototype = proto;

			// Set a convenience property in case the parent's prototype is
			// needed later.
			this.Super = parent.prototype;
		},
		
		'Extend' : function (items) {
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
	
	function makeConstructor(name,obj){
		console.time('scr');
		window._tmp_obj_=obj;
		for(var i=0;i<1000;i++){
			window.eval('window._tmp_constructor_=(function(obj){'+
									'return function '+name+'(){\n obj.apply(this,arguments);}'+
								'})(window._tmp_obj_)');
			var constructor=window._tmp_constructor_;
			delete window._tmp_constructor_;
		}
		console.timeEnd('scr');
		delete window._tmp_constructor_;
		delete window._tmp_obj_;
		return constructor;
		
	}
	

	function mix(r, s, wl) {
		for (var p in s) {
			if (s.hasOwnProperty(p)) {
				// 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
				if (p !== 'prototype'&&p!='constructor') {
					r[p] = s[p];
				}
			}
		}
	}

	var toString = Object.prototype.toString;

	
	var isFunction = function (val) {
		return toString.call(val) === '[object Function]';
	};

	
	
	g.Class=Class;
	
	return Class;

});