define(['g','_/utils'],function(g){
	
	
	
	function Class(constructor, properties) {
		
		
		
		if (!isFunction(constructor)) {
			properties = constructor || {};
			constructor=properties.constructor==Object? Empty : properties.constructor;
		} else { // 将第一个参数改为构造函数
			if(!properties) {
				return classify(constructor);
			}
		}
		if(properties.constructor!=Object)
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
		else constructor_ = constructor;
		
		properties.Extend=properties.Extend||[];
		properties.Extend=properties.Extend.constructor==Array?properties.Extend:[properties.Extend];
		//properties.Extend.unshift(parent);
		
		implement.call(constructor_, properties, parent!= constructor_&&parent!=Empty);
		
		// 继承静态方法
		if(constructor_!=parent&&parent!=Empty)
			mix(constructor_, parent);
		
		// Make subclass extendable.
		return classify(constructor_);
		
		function Empty(){}
	}
	
	
	
	function implement(properties,inh) {
		
		inh&&Mutators['Inherit'].call(this, properties['Inherit']);
			
		Mutators['Statics'].call(this, properties['Statics']);
		
		var _extends=properties['Extend'];
		
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
			var that=this;
			var proto = createProto(parent.prototype);

			// Enforce the constructor to be what we expect.
			proto.constructor = this;
			
			proto.__name__=this.prototype.__name__||'Empty';
			// Set the prototype chain to inherit from `parent`.
			this.prototype = proto;
			
			// Set a convenience property in case the parent's prototype is
			// needed later.
			this.Super = parent.prototype;
		},
		
		'Extend' : function (items) {
			var proto = this.prototype, item;
			var blacklist;
			while (items.length) {
				item = items.shift();
				item=item&&item.prototype || item || {};
				blacklist= item.Blacklist;
				mix(proto, item, blacklist);
			}
		},

		'Statics' : function (staticProperties) {
			mix(this, staticProperties, staticProperties&&staticProperties.Blacklist);
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
		window.eval('window._tmp_constructor_=(function(obj){'+
								'return function '+name+'(){\n obj.apply(this,arguments);}'+
							'})(window._tmp_obj_)');
		var constructor=window._tmp_constructor_;
		delete window._tmp_constructor_;
		console.timeEnd('scr');
		delete window._tmp_constructor_;
		delete window._tmp_obj_;
		return constructor;
	}
	
	function makeConstructor_(name,obj){
		Constructor.prototype.__name__=name;
		function Constructor(){
			obj.apply(this,arguments);
		}
		return Constructor;
	}
	
	function mix(target, obj, blacklist) {
		if(obj) for (var p in obj) {
				if(blacklist&&blacklist.indexOf(p)>-1) continue;
				if (obj.hasOwnProperty(p)) {
					// 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
					if (p !== 'prototype'&&p!='constructor'&&p!='__name__') {
						target[p] = obj[p];
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