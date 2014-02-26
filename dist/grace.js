(function(define) {
    define([], function() {
        //根据路径返回对象
        //path		数据路径
        //obj		基础对象
        //create	是否进行创建路径，如果否，返回null
        function getObjByPath(path, obj, create) {
            path = path.replace(/(^\s*)|(\s*$)/g, "");
            var tmp;
            if (path.indexOf("/") > -1) {
                path = path.split("/");
                var x;
                while (x = path.shift()) {
                    if (typeof obj[x] != "undefined") {
                        obj = obj[x];
                        if (path.length > 0 && typeof obj != "object") throw new Error("The " + x + " related to the node of Object is not an Object type");
                    } else if (create) {
                        //如果子路径元素不存在，并且需要创建
                        if (path.length) {
                            //路径中遇到undefined
                            obj = obj[x] = {};
                        } else {
                            //终端
                            obj[x] = {};
                            //创建路径
                            return obj[x];
                        }
                    } else return;
                }
                return obj;
            } else if (typeof obj[path] != "undefined") {
                return obj[path];
            } else if (create) {
                obj[path] = {};
                return obj[path];
            } else return;
        }
        function Mediator() {
            this.channels = {};
        }
        Mediator.prototype = {
            constructor: Mediator,
            publish: function(channel, message) {
                //根据路径获取对象
                var cn = getObjByPath(channel, this.channels);
                if (!cn || !cn.channels || !cn.channels.length) return;
                var sbcr = cn.channels;
                var wdg;
                for (var i = 0; i < sbcr.length; i++) {
                    sbcr[i](message);
                }
            },
            subscribe: function(channel, callback) {
                //根据路径生成对象树
                var cn = getObjByPath(channel, this.channels, 1);
                cn = cn.channels || (cn.channels = []);
                //将方法加入到监听数组
                cn.push(callback);
            }
        };
        function DSEvent() {
            this.handle = {
                //仅当前节点的更新会触发事件
                "path1/path2": {
                    all: {}
                },
                //关联事件，关联所有子节点的更新
                "path1/path2/": {
                    "delete": {}
                }
            };
        }
        DSEvent.prototype = {
            constructor: DSEvent,
            add: function(path, event, namespace, callback) {
                if (arguments.length == 3) {
                    callback = namespace;
                    namespace = "none";
                }
                var hs = this.handle[path] = this.handle[path] || {};
                var ev = hs[event] || {};
                var ns = ev[namespace] || [];
                ns.push(callback);
            },
            //删除委托事件
            del: function(path, event, namespace) {
                if (arguments.length == 2) {
                    namespace = "none";
                } else if (arguments.length == 1) {
                    namespace = "none";
                    event = "all";
                }
                var hs = this.handle[path];
                if (hs) {
                    if (event == "all") if (namespace == "none") delete this.handle[path]; else for (var x in hs) {
                        delete hs[x][namespace];
                    } else if (namespace == "none") delete hs[event]; else hs[event] && delete hs[event][namespace];
                }
            },
            trigger: function(path, event, namespace) {
                path = path.replace(/\s/gi, "");
                if (arguments.length == 2) {
                    namespace = "none";
                } else if (arguments.length == 1) {
                    namespace = "none";
                    event = "all";
                }
                if (path.lastIndexOf("/") == path.length - 1) {
                    _trigger(this.handle, path, event, namespace);
                } else {
                    var p = path.split("/");
                    while (p.length) {
                        _trigger(this.handle, p.join("/"), event, namespace);
                        p.pop();
                    }
                }
            }
        };
        function _trigger(handles, path, event, namespace) {
            var hs = handles[path];
            var es, ns, x, y;
            if (hs) {
                if (event == "all") if (namespace == "none") {
                    for (y in hs) if (ns = hs[y]) for (x in ns) ns[x].forEach(function(fn) {
                        fn(path, event);
                    });
                } else {
                    (ns = hs["delete"]) && ns[namespace] && ns[namespace].forEach(function(fn) {
                        fn(path, event);
                    });
                } else if (namespace == "none") if (ns = hs[event]) for (x in ns) ns[x].forEach(function(fn) {
                    fn(path, event);
                }); else if (ns = hs[event]) ns[namespace] && ns[namespace].forEach(function(fn) {
                    fn(path, event);
                });
            }
        }
        var dsevent = new DSEvent();
        //数据树节点定义
        function DS(path, ds) {
            //当前路径
            this.PATH = path;
            //返回数据树相应的数据节点
            this._dataset_ = getObjByPath(path, ds, 1);
        }
        DS.prototype = {
            //应该具备解析字符串值作为数据来源的功能，如 dom:#id.val,DS:path/path/Count
            get: function(path) {
                path = path.replace(/\s/gi, "");
                if (path) {
                    if (path.indexOf("/") > -1) return getObjByPath(path, this._dataset_); else return this._dataset_[path];
                } else return this._dataset_;
            },
            //这里会引起update或create事件的触发
            set: function(path, value) {
                var obj;
                if (value.constructor == Object) {
                    //如果值为对象，只需要扩展源对象即可
                    if (path.indexOf("/") > -1) obj = getObjByPath(path, this._dataset_, 1); else obj = this._dataset_[path];
                    for (var x in value) if (value.hasOwnProperty(x)) obj[path] = value[x];
                } else {
                    //如果值不为对象，则需要找到目标对象所在的父对象
                    //如果path是多个节点
                    if (path.indexOf("/") > -1) {
                        path = path.replace(/\s/gi, "").split("/");
                        var key = path.pop();
                        //对应的键
                        //返回父对象
                        if (path.length > 1) obj = getObjByPath(path.join("/"), this._dataset_, 1); else if (path.length == 1) obj = this._dataset_[path[0]];
                    } else obj = this._dataset_;
                    obj[path] = value;
                }
            },
            //这里可能会引起delete事件的触发
            "delete": function(path) {
                var srcPath = this.PATH + "/" + path;
                path = path.replace(/\s/gi, "").split("/");
                var p = path.pop();
                path = path.join("/");
                if (path) {
                    if (path.indexOf("/") > -1) {
                        delete getObjByPath(path, this._dataset_)[p];
                        event(this.handlers[srcPath], srcPath);
                    } else {
                        delete this._dataset_[path][p];
                    }
                } else {
                    delete this._dataset_[p];
                }
                function event(h, path) {
                    if (h) {
                        for (var x in h) {
                            if (x.indexOf("delete") == 0 || x.indexOf("all") == 0) {
                                h[x]();
                            }
                        }
                    }
                }
            },
            // 提供绑定事件类型有 update delete create all
            // 这里需要支持末尾为/的绑定，绑定指向末尾的所有数据包括其各级子数据
            // 事件触发要伴随变化前数据和变化后数据
            // 需要支持命名空间
            bind: function(path, event, handlers) {
                if (path.constructor == Function) {
                    //如果参数只有一个函数，则对当前路径进行绑定
                    callback = path;
                    path = this.PATH;
                    event = "all";
                } else if (event.constructor == Function) {
                    //如果第二个参数为函数
                    callback = event;
                    //如果path为事件名称，则使用当前PATH，以及path作为event
                    //.后面作为事件命名空间
                    if ("|update|delete|create|".indexOf("|" + path.split(".")[0] + "|") > -1) {
                        event = path;
                        path = this.PATH;
                    } else {
                        //否则认为path参数不为event
                        event = "all";
                        path = this.PATH + "/" + path;
                    }
                }
                for (var x in handlers) {
                    //这里应该使用时间管理类进行管理
                    var h = this.handlers[path] = this.handlers[path] || {};
                    h = h[event] = h[event] || [];
                    h.push(handlers);
                }
            },
            //需要事件管理类
            //删除数据事件绑定  		//  采用dom事件委托方式
            unbind: function(path, event) {
                //.后面作为事件命名空间
                if ("|update|delete|create|".indexOf("|" + path.split(".")[0] + "|") > -1) {
                    event = path;
                    path = this.PATH;
                } else {
                    event = "all";
                    path = this.PATH + "/" + path;
                }
                if (event == "all") {
                    delete this.handlers[path];
                } else {
                    var h = this.handlers[path];
                    for (var x in h) if (x.indexOf(event) == 0) delete h[x];
                }
            },
            //Dataset事件触发
            trigger: function(path, type, newData, oldData) {}
        };
        function DSEvent() {
            this.handle = {
                //仅当前节点的更新会触发事件
                "path1/path2": {
                    all: {}
                },
                //关联事件，关联所有子节点的更新
                "path1/path2/": {
                    "delete": {}
                }
            };
        }
        DSEvent.prototype = {
            constructor: DSEvent,
            add: function(path, event, namespace, callback) {
                if (arguments.length == 3) {
                    callback = namespace;
                    namespace = "none";
                }
                var hs = this.handle[path] = this.handle[path] || {};
                var ev = hs[event] || {};
                var ns = ev[namespace] || [];
                ns.push(callback);
            },
            //删除委托事件
            del: function(path, event, namespace) {
                if (arguments.length == 2) {
                    namespace = "none";
                } else if (arguments.length == 1) {
                    namespace = "none";
                    event = "all";
                }
                var hs = this.handle[path];
                if (hs) {
                    if (event == "all") if (namespace == "none") delete this.handle[path]; else for (var x in hs) {
                        delete hs[x][namespace];
                    } else if (namespace == "none") delete hs[event]; else hs[event] && delete hs[event][namespace];
                }
            },
            trigger: function(path, event, namespace) {
                path = path.replace(/\s/gi, "");
                if (arguments.length == 2) {
                    namespace = "none";
                } else if (arguments.length == 1) {
                    namespace = "none";
                    event = "all";
                }
                if (path.lastIndexOf("/") == path.length - 1) {
                    _trigger(this.handle, path, event, namespace);
                } else {
                    var p = path.split("/");
                    while (p.length) {
                        _trigger(this.handle, p.join("/"), event, namespace);
                        p.pop();
                    }
                }
            }
        };
        function _trigger(handles, path, event, namespace) {
            var hs = handles[path];
            var es, ns, x, y;
            if (hs) {
                if (event == "all") if (namespace == "none") {
                    for (y in hs) if (ns = hs[y]) for (x in ns) ns[x].forEach(function(fn) {
                        fn(path, event);
                    });
                } else {
                    (ns = hs["delete"]) && ns[namespace] && ns[namespace].forEach(function(fn) {
                        fn(path, event);
                    });
                } else if (namespace == "none") if (ns = hs[event]) for (x in ns) ns[x].forEach(function(fn) {
                    fn(path, event);
                }); else if (ns = hs[event]) ns[namespace] && ns[namespace].forEach(function(fn) {
                    fn(path, event);
                });
            }
        }
        var dsevent = new DSEvent();
        //深克隆函数
        function deepClone(item) {
            if (!item) {
                return item;
            }
            // null, undefined values check 
            var types = [ Number, String, Boolean ], result;
            // normalizing primitives if someone did new String('aaa'), or new Number('444');    
            //一些通过new方式建立的东东可能会类型发生变化，我们在这里要做一下正常化处理 
            //比如new String('aaa'), or new Number('444') 
            types.forEach(function(type) {
                if (item instanceof type) {
                    result = type(item);
                }
            });
            if (typeof result == "undefined") {
                if (Object.prototype.toString.call(item) === "[object Array]") {
                    result = [];
                    item.forEach(function(child, index, array) {
                        result[index] = deepClone(child);
                    });
                } else if (typeof item == "object") {
                    // testign that this is DOM 
                    //如果是dom对象，那么用自带的cloneNode处理 
                    if (item.nodeType && typeof item.cloneNode == "function") {
                        var result = item.cloneNode(true);
                    } else if (!item.prototype) {
                        // check that this is a literal 
                        // it is an object literal       
                        //如果是个对象迭代的话，我们可以用for in 迭代来赋值 
                        result = {};
                        for (var i in item) {
                            result[i] = deepClone(item[i]);
                        }
                    } else {
                        // depending what you would like here, 
                        // just keep the reference, or create new object 
                        //这里解决的是带构造函数的情况，这里要看你想怎么复制了，深得话，去掉那个false && ，浅的话，维持原有的引用，                 
                        //但是我不建议你去new一个构造函数来进行深复制，具体原因下面会解释 
                        if (false && item.constructor) {
                            // would not advice to do that, reason? Read below 
                            //朕不建议你去new它的构造函数 
                            result = new item.constructor();
                        } else {
                            result = item;
                        }
                    }
                } else {
                    result = item;
                }
            }
            return result;
        }
        function DataSet() {
            //数据岛的数据树
            this.dataset = {};
            //数据事件把柄
            this.handlers = {};
        }
        DataSet.prototype = {
            //path:	路径
            //ds:	数据
            //that:	数据源对象
            initData: function(path, ds) {
                if (ds) {
                    ds = deepClone(ds);
                    //深克隆
                    var dso = getObjByPath(path, this.dataset, 1);
                    //获得对象，强制生成
                    if (ds.constructor == Array) {
                        //如果是数组，说明对象是可以初始化多个实例，影响也有所区别，所以需要解析路径，此处应该把路径的解析独立处理
                        dso[ds[0]] = ds[1];
                    } else if (ds.constructor == Object) {
                        //如果是对象，即只需初始化一个实例即可
                        for (var x in ds) if (ds.hasOwnProperty(x)) dso[x] = ds[x];
                    }
                }
            },
            getDS: function(path) {
                //返回新的数据树节点实例
                return new DS(path, this.dataset);
            },
            //Dataset事件触发
            trigger: function(path, type, newData, oldData) {}
        };
        function Router() {
            this.routers = {};
            //绑定hash改变事件
            window.addEventListener("hashchange", function(e) {
                hashRouter(e);
            }, false);
        }
        function hashRouter(e) {
            //下面两个变量暂无作用
            var newURL = e.newURL;
            var oldURL = e.oldURL;
            //去除#，返回反编码后的路径
            var hash;
            if (window.location.hash) hash = decodeURI(window.location.hash).substr(1);
            if (hash) var hashs = hash.split("/"); else return;
            //如果没有hash则停止执行
            var subs, index, subs, param, h;
            while (h = hashs.pop()) {
                if (h.indexOf("!") > -1) {
                    //分拆订阅名称和参数
                    index = h.indexOf("!");
                    subs = h.substr(0, index);
                    param = h.substr(index + 1);
                } else {
                    subs = h;
                }
                //这里需要扩展param的解析函数
                G.MD.publish(subs, param);
            }
        }
        function Grace() {
            //存储widget类
            this.widget = {};
            //存储不同的扩展函数
            this.page = {};
            //存储不同的扩展函数
            this.extend = {};
            //初始化数据岛对象
            this.DS = new DataSet();
            //初始化中介对象
            this.MD = new Mediator();
            //初始化路由对象
            new Router();
        }
        Grace.prototype = {
            /*
			grace					Grace模块扩展
			widget					Widget原型扩展
			widget/init				Widget初始化key解析扩展
			widget/behavior		Widget定义的接口扩展
			widget/behavior/event	Widget定义的事件类型接口扩展
			page					Page原型扩展
			page/init				Page初始化key解析扩展
			page/behavior			Page定义的接口扩展
			page/behavior/event	Page定义的事件类型接口扩展
			
		*/
            Extend: function(target, ex) {
                //过滤空白符
                if (!target || !(target = target.replace(/\s/gi, ""))) return;
                var targets = target.split(",");
                while (target = targets.pop()) {
                    if (target.toLowerCase() == "grace") {
                        //当最高级扩展，同步加入prototype链
                        for (var x in ex) Grace.prototype[x] = ex[x];
                    } else {
                        //针对一些异步初始化的类应先保存
                        var extend = this.extend[target] || (this.extend[target] = {});
                        for (var x in ex) {
                            extend[x] = ex[x];
                        }
                    }
                }
            }
        };
        if (!window.G) window.G = new Grace();
        var G = window.G;
        function Engine(s) {
            this.core = null;
            //初始化后将存储操作核心
            this.length = 0;
            this.$(s);
        }
        var $$ = function(s) {
            return new Engine(s);
        };
        $$.fn = Engine.prototype;
        //不依赖任何dom操作框架
        G.Extend("grace", {
            //扩展grace的Engine扩展功能
            //两个必须参数	
            // proto	原型扩展
            // extend	属性方法扩展
            Engine: function(proto, extend) {
                if (proto) for (var x in proto) $$.fn[x] = proto[x];
                if (extend) for (var x in extend) $$[x] = extend[x];
            },
            $: $$
        });
        G.Engine({
            //引擎内部初始化
            z_freshCore: function() {
                var i = 0;
                var core = this.core;
                //实现数组方式使用内部元素
                while (core[i]) {
                    this[i] = core[i];
                    i++;
                }
                //返回内部元素个数
                this.length = core.length;
            }
        }, {
            extend: function(data) {
                for (var x in data) (function(name, func) {
                    $$.fn[name] = func;
                })(x, data[x]);
            }
        });
        /*
 * ComposeJS, object composition for JavaScript, featuring
* JavaScript-style prototype inheritance and composition, multiple inheritance, 
* mixin and traits-inspired conflict resolution and composition  
 */
        // function for creating instances from a prototype
        function Create() {}
        var delegate = Object.create ? function(proto) {
            return Object.create(typeof proto == "function" ? proto.prototype : proto || Object.prototype);
        } : function(proto) {
            Create.prototype = typeof proto == "function" ? proto.prototype : proto;
            var instance = new Create();
            Create.prototype = null;
            return instance;
        };
        function validArg(arg) {
            if (!arg) {
                throw new Error("Compose arguments must be functions or objects");
            }
            return arg;
        }
        // this does the work of combining mixins/prototypes
        function mixin(instance, args, i) {
            // use prototype inheritance for first arg
            var value, argsLength = args.length;
            for (;i < argsLength; i++) {
                var arg = args[i];
                if (typeof arg == "function") {
                    // the arg is a function, use the prototype for the properties
                    var prototype = arg.prototype;
                    for (var key in prototype) {
                        value = prototype[key];
                        var own = prototype.hasOwnProperty(key);
                        if (typeof value == "function" && key in instance && value !== instance[key]) {
                            var existing = instance[key];
                            if (value == required) {
                                // it is a required value, and we have satisfied it
                                value = existing;
                            } else if (!own) {
                                // if it is own property, it is considered an explicit override 
                                // TODO: make faster calls on this, perhaps passing indices and caching
                                if (isInMethodChain(value, key, getBases([].slice.call(args, 0, i), true))) {
                                    // this value is in the existing method's override chain, we can use the existing method
                                    value = existing;
                                } else if (!isInMethodChain(existing, key, getBases([ arg ], true))) {
                                    // the existing method is not in the current override chain, so we are left with a conflict
                                    console.error("Conflicted method " + key + ", final composer must explicitly override with correct method.");
                                }
                            }
                        }
                        if (value && value.install && own && !isInMethodChain(existing, key, getBases([ arg ], true))) {
                            // apply modifier
                            value.install.call(instance, key);
                        } else {
                            instance[key] = value;
                        }
                    }
                } else {
                    // it is an object, copy properties, looking for modifiers
                    for (var key in validArg(arg)) {
                        var value = arg[key];
                        if (typeof value == "function") {
                            if (value.install) {
                                // apply modifier
                                value.install.call(instance, key);
                                continue;
                            }
                            if (key in instance) {
                                if (value == required) {
                                    // required requirement met
                                    continue;
                                }
                            }
                        }
                        // add it to the instance
                        instance[key] = value;
                    }
                }
            }
            return instance;
        }
        // allow for override (by es5 module)
        Compose._setMixin = function(newMixin) {
            mixin = newMixin;
        };
        function isInMethodChain(method, name, prototypes) {
            // searches for a method in the given prototype hierarchy 
            for (var i = 0; i < prototypes.length; i++) {
                var prototype = prototypes[i];
                if (prototype[name] == method) {
                    // found it
                    return true;
                }
            }
        }
        // Decorator branding
        function Decorator(install, direct) {
            function Decorator() {
                if (direct) {
                    return direct.apply(this, arguments);
                }
                throw new Error("Decorator not applied");
            }
            Decorator.install = install;
            return Decorator;
        }
        Compose.Decorator = Decorator;
        // aspect applier 
        function aspect(handler) {
            return function(advice) {
                return Decorator(function install(key) {
                    var baseMethod = this[key];
                    (advice = this[key] = baseMethod ? handler(this, baseMethod, advice) : advice).install = install;
                }, advice);
            };
        }
        // around advice, useful for calling super methods too
        Compose.around = aspect(function(target, base, advice) {
            return advice.call(target, base);
        });
        Compose.before = aspect(function(target, base, advice) {
            return function() {
                var results = advice.apply(this, arguments);
                if (results !== stop) {
                    return base.apply(this, results || arguments);
                }
            };
        });
        var stop = Compose.stop = {};
        var undefined;
        Compose.after = aspect(function(target, base, advice) {
            return function() {
                var results = base.apply(this, arguments);
                var adviceResults = advice.apply(this, arguments);
                return adviceResults === undefined ? results : adviceResults;
            };
        });
        // rename Decorator for calling super methods
        Compose.from = function(trait, fromKey) {
            if (fromKey) {
                return (typeof trait == "function" ? trait.prototype : trait)[fromKey];
            }
            return Decorator(function(key) {
                if (!(this[key] = typeof trait == "string" ? this[trait] : (typeof trait == "function" ? trait.prototype : trait)[fromKey || key])) {
                    throw new Error("Source method " + fromKey + " was not available to be renamed to " + key);
                }
            });
        };
        // Composes an instance
        Compose.create = function(base) {
            // create the instance
            var instance = mixin(delegate(base), arguments, 1);
            var argsLength = arguments.length;
            // for go through the arguments and call the constructors (with no args)
            for (var i = 0; i < argsLength; i++) {
                var arg = arguments[i];
                if (typeof arg == "function") {
                    instance = arg.call(instance) || instance;
                }
            }
            return instance;
        };
        // The required function, just throws an error if not overriden
        function required() {
            throw new Error("This method is required and no implementation has been provided");
        }
        Compose.required = required;
        // get the value of |this| for direct function calls for this mode (strict in ES5)
        function extend() {
            var args = [ this ];
            args.push.apply(args, arguments);
            return Compose.apply(0, args);
        }
        // Compose a constructor
        function Compose(base) {
            var args = arguments;
            var prototype = args.length < 2 && typeof args[0] != "function" ? args[0] : // if there is just a single argument object, just use that as the prototype 
            mixin(delegate(validArg(base)), args, 1);
            // normally create a delegate to start with			
            function Constructor() {
                var instance;
                if (this instanceof Constructor) {
                    // called with new operator, can proceed as is
                    instance = this;
                } else {
                    // we allow for direct calls without a new operator, in this case we need to
                    // create the instance ourself.
                    Create.prototype = prototype;
                    instance = new Create();
                }
                // call all the constructors with the given arguments
                for (var i = 0; i < constructorsLength; i++) {
                    var constructor = constructors[i];
                    var result = constructor.apply(instance, arguments);
                    if (typeof result == "object") {
                        if (result instanceof Constructor) {
                            instance = result;
                        } else {
                            for (var j in result) {
                                if (result.hasOwnProperty(j)) {
                                    instance[j] = result[j];
                                }
                            }
                        }
                    }
                }
                return instance;
            }
            // create a function that can retrieve the bases (constructors or prototypes)
            Constructor._getBases = function(prototype) {
                return prototype ? prototypes : constructors;
            };
            // now get the prototypes and the constructors
            var constructors = getBases(args), constructorsLength = constructors.length;
            if (typeof args[args.length - 1] == "object") {
                args[args.length - 1] = prototype;
            }
            var prototypes = getBases(args, true);
            Constructor.extend = extend;
            if (!Compose.secure) {
                prototype.constructor = Constructor;
            }
            Constructor.prototype = prototype;
            return Constructor;
        }
        Compose.apply = function(thisObject, args) {
            // apply to the target
            // called with a target object, apply the supplied arguments as mixins to the target object
            return thisObject ? mixin(thisObject, args, 0) : extend.apply.call(Compose, 0, args);
        };
        Compose.call = function(thisObject) {
            // call() should correspond with apply behavior
            return mixin(thisObject, arguments, 1);
        };
        function getBases(args, prototype) {
            // this function registers a set of constructors for a class, eliminating duplicate
            // constructors that may result from diamond construction for classes (B->A, C->A, D->B&C, then D() should only call A() once)
            var bases = [];
            function iterate(args, checkChildren) {
                outer: for (var i = 0; i < args.length; i++) {
                    var arg = args[i];
                    var target = prototype && typeof arg == "function" ? arg.prototype : arg;
                    if (prototype || typeof arg == "function") {
                        var argGetBases = checkChildren && arg._getBases;
                        if (argGetBases) {
                            iterate(argGetBases(prototype));
                        } else {
                            for (var j = 0; j < bases.length; j++) {
                                if (target == bases[j]) {
                                    continue outer;
                                }
                            }
                            bases.push(target);
                        }
                    }
                }
            }
            iterate(args, true);
            return bases;
        }
        // returning the export of the module
        //替换path里面的变量，如{id}
        function fixPath(path, obj) {
            return path.replace(/(^\s*)|(\s*$)/g, "").replace(/\{.*?\}/gi, function(m) {
                return obj[m.replace(/\{|\}/gi, "")];
            });
        }
        //新组装一个插件
        function makeWidget(path, cons, behavior, proto) {
            var root = this;
            function Widget() {
                cons.apply(this, arguments);
                for (var x in behavior) if (x != "init") {
                    //循环各种行为的处理
                    var f = G.extend[proto.TYPE + "/behavior"][x];
                    if (f) {
                        f = f[0];
                        //返回初始化执行函数
                        if (f) f.call(this, path, behavior[x], root);
                    }
                }
                //执行初始化
                var init = behavior.init;
                if (proto.TYPE == "page") G.extend[proto.TYPE + "/behavior"]["init"][0].call(this, path, behavior["init"], root);
            }
            proto.PATH = path;
            var extend = this.extend[proto.TYPE];
            //需要跟page分开扩展
            //对widget 和page的内部方法扩展
            for (var x in extend) proto[x] = extend[x];
            for (var x in behavior) {
                var f = G.extend[proto.TYPE + "/behavior"][x];
                if (f) {
                    f = f[1];
                    //返回初始化前执行函数 ，应该调整一下
                    if (f) f.call(this, path, behavior[x], proto);
                }
            }
            //返回组装类
            return Compose(Widget, proto);
        }
        G.Extend("grace", {
            Widget: function(path, cons, behavior, proto) {
                proto.TYPE = "widget";
                //设置生成插件类别
                this.widget[path] = makeWidget.call(this, path, cons, behavior, proto);
            }
        });
        //widge page内置方法扩展
        G.Extend("widget,page", {
            DS: function(path) {
                //返回一个DS对象
                return G.DS.getDS(path);
            },
            //类JQ操作对象
            $: function(s) {
                return $$(s);
            },
            //向中介发布信息
            publish: function(channel, message) {
                if (message) G.MD.publish(channel, message); else G.MD.publish(channel);
            },
            //初始化一个widget插件，如果是widget调用，限制只能调用同根widget，如果是page调用，则不设限制
            "new": function(path, p) {
                var w = this.widget[path];
                if (this.TYPE == "widget" && w && this.PATH.split("/")[0] == path.split("/")[0] || this.TYPE != "widget" && w) return new w(p);
            }
        });
        //widget page 行为扩展
        //是否应该考虑吧初始化行为也提到这里来
        G.Extend("widget/behavior,page/behavior", {
            //数据岛行为扩展
            dataset: [ function(path, dataset, root) {
                var DS = root.DS;
                dataset = deepClone(dataset);
                if (dataset.constructor == Array) dataset[0] = fixPath(dataset[0], this);
                DS.initData(path, dataset);
            }, function() {} ],
            //util行为扩展，以冒号区分两种util扩展
            util: [ function(path, util, root) {
                utils(util, this);
            }, function(path, util, proto) {} ],
            //事件绑定扩展
            //考虑做成独立的内部事件绑定机制，不依赖jquery的事件绑定机制
            event: [ function(path, event, root) {
                for (var x in event) bind(this, x);
            }, function(path, event, proto) {
                for (var x in event) proto["zzE_" + x] = event[x];
            } ],
            //注册订阅
            subscribe: [ function(path, subs, root) {
                for (var x in subs) subscribe(this, x);
            }, function(path, subs, proto) {
                for (var x in subs) proto["zzS_" + x] = subs[x];
            } ],
            //初始化扩展
            init: [ function(path, init, root) {
                for (var x in init) {
                    if (init[x].constructor == String) {
                        runPageInit(this, fixPath(x, this), this[init[x]]);
                    } else runPageInit(this, fixPath(x, this), init[x]);
                }
            }, function(path, init, root) {} ]
        });
        G.Extend("widget/behavior/event,page/behavior/event", {
            //常规dom事件绑定实现方法
            //that	事件绑定相关对象
            //path	事件绑定指令
            //key	事件函数对应的prototype键
            event: function(that, path, key) {
                var index = path.indexOf(" ");
                var etype = path.substr(0, index);
                var dom = path.substr(index + 1).split("@");
                //
                //如果dom事件有委托
                if (dom.length == 2) $$(dom[0]).on(etype, dom[1], function(e) {
                    that[key]($$(this), e);
                }); else if (dom.length == 1) //如果dom事件没有委托
                $$(dom[0]).on(etype, function(e) {
                    that[key]($$(this), e);
                });
            }
        });
        G.Extend("widget/behavior/init,page/behavior/init", {
            dom: function(that, target, callback) {
                var t = $$(target);
                var set = t.data("set");
                if (set.constructor == String) set = G.DS.getDS(set);
                callback.call(that, t, set);
            }
        });
        //初始化utils
        function utils(d, that) {
            var func = {}, util = {};
            for (var x in d) {
                x = fixPath(x, that);
                //为了少用一个for循环
                if (x.indexOf(":") > -1) util[x] = d[x]; else func[x] = d[x];
            }
            //调用util扩展方法
            G.Util(util, func);
        }
        //初始化订阅功能
        function subscribe(that, path) {
            var key = "zzS_" + path;
            //对象中对应的执行方法的prototype键
            path = fixPath(path, that);
            if (that[key].constructor == String) key = that[key];
            G.MD.subscribe(path, function(message) {
                that[key](message);
            });
        }
        //事件函数绑定执行
        function bind(that, path) {
            var key = "zzE_" + path;
            if (that[key].constructor == String) key = that[key];
            path = fixPath(path, that);
            var index = path.indexOf(" ");
            var index2 = path.indexOf(":");
            if (index > 0 && (index2 > 0 && index < index2 || index2 == -1)) {
                //冒号在后面或者没有冒号，一定有空格，默认为常规dom事件处理方式
                var type = "event";
            } else if (index2 > 0 && (index > 0 && index2 < index || index == -1)) {
                //冒号在前面或者没有空格，一定有冒号，分析为其他事件处理方式
                var type = path.substr(0, index2);
                //也可能是dom方式
                var path = path.substr(index2 + 1);
            }
            G.extend[that.TYPE + "/behavior/event"][type](that, path, key);
        }
        //插件构造函数执行后就跑初始化程序
        function runPageInit(that, x, callback) {
            if (x.indexOf(":") > -1) {
                var index = x.indexOf(":");
                var type = x.substr(0, index);
                //获得key解析类型
                var target = x.substr(index + 1);
                //获得key解析对象
                var init = G.extend[that.TYPE + "/behavior/init"][type];
                //从扩展获得处理方式
                if (init) init(that, target, callback); else G.extend[that.TYPE + "/behavior/init"]["dom"](that, x, callback);
            } else {
                G.extend[that.TYPE + "/behavior/init"]["dom"](that, x, callback);
            }
        }
        G.Extend("grace", {
            Page: function(path, cons, behavior, proto) {
                proto.TYPE = "page";
                //调用makeWidget函数生成page插件
                this.page[path] = makeWidget.call(this, path, cons, behavior, proto);
            }
        });
        //提供内部page插件初始化扩展
        //专门提供page插件内部使用，
        //限制只能调用同根的page插件
        G.Extend("page", {
            //path	调用插件的路径
            //p		传入参数
            init: function(path, p) {
                var w = this.page[path];
                if (this.TYPE == "page" && w && this.PATH.split("/")[0] == path.split("/")[0]) return new w(p);
            }
        });
        G.Extend("grace", {
            //domUtils	对dom操作自动处理扩展
            //funcUtils	为engine添加prototype函数扩展
            Util: function(domUtils, funcUtils) {
                //调用$$自身扩展方法
                $$.extend(funcUtils);
                var du = $$.dataUtils;
                for (var x in domUtils) {
                    if (x.indexOf(":") > -1) {
                        var xx = x.split(":");
                        du[xx[0]] = du[xx[0]] || {};
                        du[xx[0]][xx[1]] = domUtils[x];
                    } else {
                        du["util"] = du["util"] || {};
                        du["util"][x] = domUtils[x];
                    }
                }
            }
        });
        G.Engine({
            //调用util自动初始化方法进行初始化
            //utils	初始化方法，逗号隔开
            util: function(utils) {
                var du = $$.dataUtils;
                //如果utils参数存在
                if (utils && utils.constructor == String) {
                    utils = utils.replace(/\s/gi, "").split(",");
                    var u, x;
                    var uts = du["util"];
                    while (u = utils.pop()) {
                        var func = uts[u];
                        this.find('[data-util="' + u + '"]').each(function(el) {
                            if (!el[0].inited && func) {
                                //如果未进行过初始化
                                func(el, el.data("set"));
                                el[0].inited = true;
                            }
                        }).end();
                    }
                } else {
                    //如果没有utils参数，则初始化所有
                    for (x in du) {
                        var t = du[x];
                        this.find("[data-" + x + "]").each(function(el) {
                            var u = el.data(x);
                            if (!el[0].inited && t[u]) {
                                t[u](el, el.data("set"));
                                el[0].inited = true;
                            }
                        }).end();
                    }
                }
                return this;
            }
        }, {
            //属性扩展
            dataUtils: {}
        });
        G.Extend("grace", {
            //应用初始化启动程序，需要模块依赖管理框架对各模块进行管理，此模块应该作为最后的模块加载
            //before 	初始化前执行函数
            //end		初始化后执行函数 
            App: function(before, end) {
                var p, x;
                before && before();
                for (x in this.page) {
                    if (x.indexOf("/") == -1) {
                        //仅对一级page进行初始化启动
                        p = this.page[x];
                        if (p) new p();
                    }
                }
                end && end();
            }
        });
        return G;
    });
})(typeof define != "undefined" ? define : // AMD/RequireJS format if available
function(deps, factory) {
    if (typeof module != "undefined") {
        module.exports = factory();
    } else {
        window.G = factory();
    }
});