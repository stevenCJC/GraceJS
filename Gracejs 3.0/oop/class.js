define(['g','./function/makeConstructor', '_/utils','_/is'], function (g, makeConstructor) {
	
	function ClassFactory(mode){
		this.mode=mode;// 1 debug模式，2 快速模式
		this.clean();
	}
	
	ClassFactory.prototype={
		constructor:ClassFactory,
		
		load:function(constructor_, properties){
			
			if(!g.is.Function(constructor_)) {
				this.props=constructor_||{};
				this.constr=this.props.constructor == Object ? this.Empty : this.props.constructor;
			}else {
				this.constr=constructor_;
				this.props=properties||{};
			}
	
			if (this.props.constructor != Object)
				delete this.props.constructor;
			
			this.parent = this.props.Inherit || (Object.keys(this.constr.prototype).length ? this.constr : false) || this.Empty;
			
			if(this.props.Inherit&&this.constr.prototype) this.superInherit=true;
			
			this.name = this.props.Name || this.constr.name;
			
			
			
		},
		
		inherit:function(){
			if(this.parent != this.Constructor && this.parent != this.Empty){
				var proto = createProto(this.parent.prototype);
				proto.constructor = this.Constructor;
				
				// 展平构造器的原型链的元素
				if(this.superInherit) {
					//var constrProto=findAllProto(this.Constructor);
				}
								
				if ( this.Constructor.prototype.__name__)
					proto.__name__ =  this.Constructor.prototype.__name__ || 'Empty';
				this.Constructor.prototype = proto;
				this.Constructor.Super = this.parent.prototype;
			}
		},
		stack:function(){
			this.extends = this.props.Extend || [];
			this.extends = this.extends.constructor == Array ? this.extends : [this.extends];
			
			this.statics = this.props.Statics;
			
			delete this.props.Inherit;
			delete this.props.Name;
			delete this.props.Extend;
			
			this.extends.push(this.props);
		},
		extend:function(){
			var i=0;
			var proto = this.Constructor.prototype,item;
			var blacklist=proto.__blacklist__||[];
			var extendlist=proto.__extendlist__||[];
			while (this.extends[i]) {
				item = this.extends[i++];
				item = item && item.prototype || item || {};
				if(item.__blacklist__) blacklist=blacklist.concat(item.__blacklist__);
				if(item.__extendlist__) extendlist=extendlist.concat(item.__extendlist__);
				mix(proto, item, blacklist,extendlist);
			}
		},
		
		static:function(){
			if (this.Constructor != this.parent && this.parent != this.Empty)
				mix(this.Constructor, this.parent, this.parent && this.parent.__blacklist__, this.parent && this.parent.__extendlist__);
			mix(this.Constructor, this.statics, this.statics && this.statics.__blacklist__, this.statics && this.statics.__extendlist__);
		},
		
		classify:function(cls){
			cls=cls||this.Constructor;
			cls.extend = function(){ 
				ClassFactory.prototype.extend.call({Constructor:this,extends:Array.prototype.slice.call(arguments)});
				return this;
			};
			return cls;
		},
		
		create:function(){
			this.load(arguments[0],arguments[1]);
			this.mode==1?this.makeConstructor():this.makeConstructor_();
			this.inherit();
			this.stack();
			this.extend();
			this.static();
			this.classify();
			var newClass=this.Constructor;
			this.clean();
			return newClass;
		},
		
		clean:function(){
			this.constr=null;
			this.Constructor=null;
			this.parent=null;
			this.props=null;
			this.extends=null;
			this.statics=null;
			this.name=null;
			this.Empty=function Empty(){};
		},
		
		makeConstructor_ : function () {
			if (this.parent !== this.Empty && this.parent != this.constr){
				Class.prototype.__name__ = this.name;
				var func=this.constructorCallback();
				function Class() {
					g.utils.call(func, arguments, this);
				}
				this.Constructor=Class;
			}else this.Constructor =  this.constr;
		},
		makeConstructor:function(){
			
			if (this.parent !== this.Empty && this.parent != this.constr)
				this.Constructor = makeConstructor(this.name, this.constructorCallback());
			else
				this.Constructor =  this.constr;
		},
		constructorCallback:function(){
			var constructor_=this.constr;
			var parent=this.parent;
			return function () {
				g.utils.call(parent, arguments, this);
				if (parent != constructor_)
					g.utils.call(constructor_, arguments, this);
			}
		},
		
	};
	
	
	function findAllProto(cons){
		var child,protos=[cons.prototype];
		child=cons.prototype.constructor;
		while(child=(child.prototype.constructor||child.__proto__.constructor)&&child!=Object)
			if(child.prototype) protos.push(child.prototype);
		return protos;
	}
	
	
	
	// Shared empty constructor function to aid in prototype-chain creation.
	function Ctor() {}
	// See: http://jsperf.com/object-create-vs-new-ctor
	//如果__proto__可访问，则会创造__proto__属性，指向父类的prototype，
	var createProto = Object.__proto__ ?
	function (proto) {
		return {
			__proto__ : proto//父类的原型链
		};
	}
	 : function (proto) {
		Ctor.prototype = proto;
		return new Ctor();
	};

	

	function mix(target, obj, blacklist, extendlist) {
		if (obj)
			for (var p in obj) {
				if (blacklist && blacklist.indexOf(p) > -1)
					continue;
				if (obj.hasOwnProperty(p)) {
					// 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
					if (p !== 'Super' &&p !== 'prototype' && p != 'constructor' && p != '__name__'&& p != '__blacklist__'&& p != '__extendlist__') {
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
	
	
	var cf=new ClassFactory(1);

	g.Class = function(){
		return cf.create(arguments[0],arguments[1]);
	}
	
	g.Class.Factory=g.Class(ClassFactory);
	
	return g.Class;

});
