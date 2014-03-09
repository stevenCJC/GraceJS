(function(define) {
    define([], function() {
        //根据路径返回对象
        //path		数据路径
        //obj		基础对象
        //create	是否进行创建路径，如果否，返回null
        //需考虑末尾/的情况
        function getObjByPath(path, obj) {
            path = path.replace(/(^\s*)|(\s*$)/g, "");
            var tmp;
            if (path.indexOf("/") > -1) {
                path = path.split("/");
                var x;
                while (x = path.shift()) {
                    if (typeof obj[x] == "array" || typeof obj[x] == "object") {
                        obj = obj[x];
                        if (path.length > 0 && typeof obj != "object" && typeof obj[x] != "array") return;
                    } else return;
                }
                return obj;
            } else return obj[path];
        }
        //根据路径返回对象
        //path		数据路径
        //obj		基础对象
        //create	是否进行创建路径，如果否，返回null
        //需考虑末尾/的情况
        function setObjByPath(path, obj, kvp, force) {
            if (typeof obj != "object" && typeof obj != "array") throw new Error("The second arguments need to be an Object or an Array");
            path = path.replace(/(^\s*)|(\s*$)/g, "");
            path = path.split("/");
            var tail = path.pop();
            var x;
            //转到路径
            while (x = path.shift()) {
                if (force) obj = obj[x] = obj[x] || {}; else if (!obj[x] && path.length) return false;
            }
            ////如果是扩展模式，kvp为path指向的扩展元素，无需直接赋值
            if (tail) {
                obj[tail] = kvp;
                return kvp;
            } else {
                if (typeof obj == "array") for (var y in kvp) obj.push(kvp[y]); else if (typeof obj == "object") for (var y in kvp) obj[y] = kvp[y];
                return obj;
            }
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
                var cn = getObjByPath(channel, this.channels);
                if (cn) {
                    cn = cn.channels || (cn.channels = []);
                    //将方法加入到监听数组
                    cn.push(callback);
                } else setObjByPath(channel, this.channels, {
                    channels: [ callback ]
                }, 1);
            }
        };
        //深克隆函数
        function JSONClone(item) {
            return JSON.parse(JSON.stringify(item));
        }
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
                path = path.replace(/\s/gi, "");
                if (typeof namespace == "function") {
                    callback = namespace;
                    namespace = "none";
                } else if (typeof event == "function") {
                    callback = event;
                    event = "all";
                    namespace = "none";
                }
                var hs = this.handle[path] = this.handle[path] || {};
                var ev = hs[event] = hs[event] || {};
                var ns = ev[namespace] = ev[namespace] || [];
                ns.push(callback);
            },
            //删除委托事件
            del: function(path, event, namespace) {
                path = path.replace(/\s/gi, "");
                if (!event && !namespace) {
                    namespace = "none";
                    event = "all";
                } else if (!namespace) {
                    namespace = "none";
                }
                var hs = this.handle[path];
                if (hs) {
                    if (event == "all") if (namespace == "none") delete this.handle[path]; else for (var x in hs) {
                        delete hs[x][namespace];
                    } else {
                        if (namespace == "none") {
                            delete hs[event];
                        } else {
                            if (hs[event]) delete hs[event][namespace];
                        }
                    }
                }
            },
            trigger: function(e) {
                var path = e.path.replace(/\s/gi, ""), event = e.event, namespace = e.namespace;
                if (!namespace && !event) {
                    namespace = "none";
                    event = "all";
                } else if (!namespace) {
                    namespace = "none";
                }
                var isExtend = path.lastIndexOf("/") == path.length - 1;
                if (isExtend) {
                    e.currentPath = path;
                    e.handle = this.handle[path];
                    if (e.handle) _trigger(e);
                }
                var p = path.split("/");
                if (isExtend) p.pop();
                while (p.length) {
                    e.currentPath = p.join("/");
                    e.handle = this.handle[e.currentPath];
                    if (e.handle) _trigger(e);
                    p.pop();
                    if (p.length) {
                        e.currentPath = p.join("/") + "/";
                        e.handle = this.handle[e.currentPath];
                        if (e.handle) _trigger(e);
                    }
                }
            }
        };
        function _trigger(e) {
            var handles = e.handle, path = e.path, event = e.event, namespace = e.namespace;
            e = JSONClone(e);
            delete e["handle"];
            var es, ns, x, y;
            if (handles) {
                if (event == "all") {
                    //all事件不会引起其他事件的触发
                    if (namespace == "none") {
                        if (ns = handles["all"]) for (x in ns) ns[x].forEach(function(fn) {
                            fn(e);
                        });
                    } else {
                        (ns = handles["all"]) && ns[namespace] && ns[namespace].forEach(function(fn) {
                            fn(e);
                        });
                    }
                } else {
                    if (namespace == "none") {
                        if (ns = handles[event]) for (x in ns) ns[x].forEach(function(fn) {
                            fn(e);
                        });
                        //任何其他事件的触发都会引起事件all触发
                        if (ns = handles["all"]) for (x in ns) ns[x].forEach(function(fn) {
                            fn(e);
                        });
                    } else {
                        if (ns = handles[event]) ns[namespace] && ns[namespace].forEach(function(fn) {
                            fn(e);
                        });
                        //任何其他事件的触发都会引起事件all触发
                        if (ns = handles["all"]) ns[namespace] && ns[namespace].forEach(function(fn) {
                            fn(e);
                        });
                    }
                }
            }
        }
        var dsevent = new DSEvent();
        //根据路径返回对象
        //path		数据路径
        //obj		基础对象
        //create	是否进行创建路径，如果否，返回null
        //需考虑末尾/的情况
        function delObjByPath(path, obj) {
            if (typeof obj != "object" && typeof obj != "array") throw new Error("The second arguments need to be an Object or an Array");
            path = path.replace(/(^\s*)|(\s*$)/g, "");
            path = path.split("/");
            var p = path.pop();
            var x, tail;
            //转到路径
            while (x = path.shift()) {
                if (typeof obj == "object" || typeof obj == "array") obj = obj[x]; else if (!obj) return; else return;
            }
            var t = obj[p];
            delete obj[p];
            return t;
        }
        //数据树节点定义
        function DS(path, ds) {
            //当前路径
            if (path.lastIndexOf("/") == path.length - 1) path = path.substr(0, path.length - 1);
            this.PATH = path;
            //返回数据树相应的数据节点
            this.dataset = getObjByPath(path, ds);
        }
        DS.prototype = {
            //应该具备解析字符串值作为数据来源的功能，如 dom:#id.val,DS:path/path/Count
            get: function(path) {
                if (path) {
                    return getObjByPath(path, this.dataset);
                } else return this.dataset;
            },
            trigger: function(path, event) {
                if (!event) return;
                var ev = event.split("."), namespace;
                event = ev.shift();
                if (ev.length) namespace = ev.join(".");
                dsevent.trigger({
                    path: this.PATH + "/" + path,
                    event: event,
                    namespace: namespace || "none"
                });
            },
            on: function(path, event, namespace, callback) {
                dsevent.add(this.PATH + "/" + path, event, namespace, callback);
            },
            off: function(path, event, namespace) {
                dsevent.del(this.PATH + "/" + path, event, namespace);
            },
            "delete": function(path) {
                var src = delObjByPath(path, this.dataset), oldValue = JSONClone(src);
                dsevent.trigger({
                    path: this.PATH + "/" + path,
                    event: "delete",
                    namespace: "none",
                    oldValue: oldValue
                });
            },
            set: function(path, newValue) {
                var src = getObjByPath(path, this.dataset), oldValue = JSONClone(src);
                var event = typeof src != "undefined" ? "update" : "create";
                newValue = setObjByPath(path, this.dataset, newValue, 1);
                dsevent.trigger({
                    path: this.PATH + "/" + path,
                    event: event,
                    namespace: "none",
                    newValue: newValue,
                    oldValue: oldValue
                });
            }
        };
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
                    ds = JSONClone(ds);
                    //JSON克隆
                    return setObjByPath(path, this.dataset, ds, 1);
                }
            },
            getDS: function(path) {
                //返回新的数据树节点实例
                return new DS(path, this.dataset);
            },
            //Dataset事件触发
            trigger: function(path, event) {
                if (!event) return;
                var ev = event.split("."), namespace;
                event = ev.shift();
                if (ev.length) namespace = ev.join(".");
                dsevent.trigger({
                    path: path,
                    event: event,
                    namespace: namespace || "none"
                });
            },
            on: function(path, event, namespace, callback) {
                dsevent.add(path, event, namespace, callback);
            },
            off: function(path, event, namespace) {
                dsevent.del(path, event, namespace);
            },
            "delete": function(path) {
                var src = delObjByPath(path, this.dataset), oldValue = JSONClone(src);
                dsevent.trigger({
                    path: path,
                    event: "delete",
                    namespace: "none",
                    oldValue: oldValue
                });
            },
            set: function(path, newValue) {
                var src = getObjByPath(path, this.dataset), oldValue = JSONClone(src);
                var event = typeof src != "undefined" ? "update" : "create";
                newValue = setObjByPath(path, this.dataset, newValue, 1);
                dsevent.trigger({
                    path: path,
                    event: event,
                    namespace: "none",
                    newValue: newValue,
                    oldValue: oldValue
                });
            }
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
            //存储原插件碎片
            this.chips = {};
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
        // Save the previous value of the `_` variable.
        var breaker = {};
        // Save bytes in the minified (but not gzipped) version:
        var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
        // Create quick reference variables for speed access to core prototypes.
        var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
        // All **ECMAScript 5** native function implementations that we hope to use
        // are declared here.
        var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
        // Create a safe reference to the Underscore object for use below.
        var _ = function(obj) {
            if (obj instanceof _) return obj;
            if (!(this instanceof _)) return new _(obj);
            this._wrapped = obj;
        };
        // Collection Functions
        // --------------------
        // The cornerstone, an `each` implementation, aka `forEach`.
        // Handles objects with the built-in `forEach`, arrays, and raw objects.
        // Delegates to **ECMAScript 5**'s native `forEach` if available.
        var each = _.each = function(obj, iterator, context) {
            if (obj == null) return;
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === breaker) return;
                }
            } else {
                for (var key in obj) {
                    if (_.hasKey(obj, key)) {
                        if (iterator.call(context, obj[key], key, obj) === breaker) return;
                    }
                }
            }
        };
        // Return the results of applying the iterator to each element.
        // Delegates to **ECMAScript 5**'s native `map` if available.
        _.map = function(obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            });
            return results;
        };
        // Return the first value which passes a truth test. Aliased as `detect`.
        _.find = function(obj, iterator, context) {
            var result;
            any(obj, function(value, index, list) {
                if (iterator.call(context, value, index, list)) {
                    result = value;
                    return true;
                }
            });
            return result;
        };
        // Return all the elements that pass a truth test.
        // Delegates to **ECMAScript 5**'s native `filter` if available.
        // Aliased as `select`.
        _.filter = function(obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
            each(obj, function(value, index, list) {
                if (iterator.call(context, value, index, list)) results[results.length] = value;
            });
            return results;
        };
        // Determine if at least one element in the object matches a truth test.
        // Delegates to **ECMAScript 5**'s native `some` if available.
        // Aliased as `any`.
        var any = function(obj, iterator, context) {
            iterator || (iterator = _.identity);
            var result = false;
            if (obj == null) return result;
            if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
            each(obj, function(value, index, list) {
                if (result || (result = iterator.call(context, value, index, list))) return breaker;
            });
            return !!result;
        };
        // Determine if the array or object contains a given value (using `===`).
        // Aliased as `include`.
        _.contains = function(obj, target) {
            if (obj == null) return false;
            if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
            return any(obj, function(value) {
                return value === target;
            });
        };
        // Convenience version of a common use case of `map`: fetching a property.
        _.pluck = function(obj, key) {
            return _.map(obj, function(value) {
                return value[key];
            });
        };
        // Convenience version of a common use case of `filter`: selecting only objects
        // containing specific `key:value` pairs.
        _.where = function(obj, attrs, first) {
            if (_.isEmpty(attrs)) return first ? null : [];
            return _[first ? "find" : "filter"](obj, function(value) {
                for (var key in attrs) {
                    if (attrs[key] !== value[key]) return false;
                }
                return true;
            });
        };
        // Convenience version of a common use case of `find`: getting the first object
        // containing specific `key:value` pairs.
        _.findWhere = function(obj, attrs) {
            return _.where(obj, attrs, true);
        };
        // Return the number of elements in an object.
        _.size = function(obj) {
            if (obj == null) return 0;
            return obj.length === +obj.length ? obj.length : _.keys(obj).length;
        };
        // Return a version of the array that does not contain the specified value(s).
        _.without = function(array) {
            return _.difference(array, slice.call(arguments, 1));
        };
        // Produce a duplicate-free version of the array. If the array has already
        // been sorted, you have the option of using a faster algorithm.
        // Aliased as `unique`.
        _.uniq = _.unique = function(array, isSorted, iterator, context) {
            if (_.isFunction(isSorted)) {
                context = iterator;
                iterator = isSorted;
                isSorted = false;
            }
            var initial = iterator ? _.map(array, iterator, context) : array;
            var results = [];
            var seen = [];
            each(initial, function(value, index) {
                if (isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
                    seen.push(value);
                    results.push(array[index]);
                }
            });
            return results;
        };
        // Produce an array that contains the union: each distinct element from all of
        // the passed-in arrays.
        _.union = function() {
            return _.uniq(concat.apply(ArrayProto, arguments));
        };
        // Take the difference between one array and a number of other arrays.
        // Only the elements present in just the first array will remain.
        _.difference = function(array) {
            var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
            return _.filter(array, function(value) {
                return !_.contains(rest, value);
            });
        };
        // Delays a function for the given number of milliseconds, and then calls
        // it with the arguments supplied.
        _.delay = function(func, wait) {
            var args = slice.call(arguments, 2);
            return setTimeout(function() {
                return func(args);
            }, wait);
        };
        // Defers a function, scheduling it to run after the current call stack has
        // cleared.
        _.defer = function(func) {
            return _.delay.apply(_, [ func, 1 ].concat(slice.call(arguments, 1)));
        };
        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time.
        _.throttle = function(func, wait) {
            var context, args, timeout, result;
            var previous = 0;
            var later = function() {
                previous = new Date();
                timeout = null;
                result = func.apply(context, args);
            };
            return function() {
                var now = new Date();
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };
        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        _.debounce = function(func, wait, immediate) {
            var timeout, result;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) result = func.apply(context, args);
                return result;
            };
        };
        // Returns a function that will be executed at most one time, no matter how
        // often you call it. Useful for lazy initialization.
        _.once = function(func) {
            var ran = false, memo;
            return function() {
                if (ran) return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo;
            };
        };
        // Returns a function that will only be executed after being called N times.
        _.after = function(times, func) {
            if (times <= 0) return func();
            return function() {
                if (--times < 1) {
                    return func.apply(this, arguments);
                }
            };
        };
        // Object Functions
        // ----------------
        // Retrieve the names of an object's properties.
        // Delegates to **ECMAScript 5**'s native `Object.keys`
        _.keys = nativeKeys || function(obj) {
            if (obj !== Object(obj)) throw new TypeError("Invalid object");
            var keys = [];
            for (var key in obj) if (_.hasKey(obj, key)) keys[keys.length] = key;
            return keys;
        };
        // Retrieve the values of an object's properties.
        _.values = function(obj) {
            var values = [];
            for (var key in obj) if (_.hasKey(obj, key)) values.push(obj[key]);
            return values;
        };
        // Extend a given object with all the properties in passed-in object(s).
        _.extend = function(obj) {
            each(slice.call(arguments, 1), function(source) {
                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        };
        // Return a copy of the object only containing the whitelisted properties.
        _.pick = function(obj) {
            var copy = {};
            var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
            each(keys, function(key) {
                if (key in obj) copy[key] = obj[key];
            });
            return copy;
        };
        // Return a copy of the object without the blacklisted properties.
        _.omit = function(obj) {
            var copy = {};
            var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
            for (var key in obj) {
                if (!_.contains(keys, key)) copy[key] = obj[key];
            }
            return copy;
        };
        // Create a (shallow-cloned) duplicate of an object.
        _.clone = function(obj) {
            if (!_.isObject(obj)) return obj;
            return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };
        // Invokes interceptor with the obj, and then returns obj.
        // The primary purpose of this method is to "tap into" a method chain, in
        // order to perform operations on intermediate results within the chain.
        _.tap = function(obj, interceptor) {
            interceptor(obj);
            return obj;
        };
        // Is a given array, string, or object empty?
        // An "empty" object has no enumerable own-properties.
        _.isEmpty = function(obj) {
            if (obj == null) return true;
            if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
            for (var key in obj) if (_.hasKey(obj, key)) return false;
            return true;
        };
        // Is a given value a DOM element?
        _.isElement = function(obj) {
            return !!(obj && obj.nodeType === 1);
        };
        // Is a given value an array?
        // Delegates to ECMA5's native Array.isArray
        _.isArray = nativeIsArray || function(obj) {
            return toString.call(obj) == "[object Array]";
        };
        // Is a given variable an object?
        _.isObject = function(obj) {
            return obj === Object(obj);
        };
        // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
        each([ "Arguments", "Function", "String", "Number", "Date", "RegExp" ], function(name) {
            _["is" + name] = function(obj) {
                return toString.call(obj) == "[object " + name + "]";
            };
        });
        // Define a fallback version of the method in browsers (ahem, IE), where
        // there isn't any inspectable "Arguments" type.
        if (!_.isArguments(arguments)) {
            _.isArguments = function(obj) {
                return !!(obj && _.hasKey(obj, "callee"));
            };
        }
        // Optimize `isFunction` if appropriate.
        if (typeof /./ !== "function") {
            _.isFunction = function(obj) {
                return typeof obj === "function";
            };
        }
        // Is a given object a finite number?
        _.isFinite = function(obj) {
            return isFinite(obj) && !isNaN(parseFloat(obj));
        };
        // Is the given value `NaN`? (NaN is the only number which does not equal itself).
        _.isNaN = function(obj) {
            return _.isNumber(obj) && obj != +obj;
        };
        // Is a given value a boolean?
        _.isBoolean = function(obj) {
            return obj === true || obj === false || toString.call(obj) == "[object Boolean]";
        };
        // Is a given value equal to null?
        _.isNull = function(obj) {
            return obj === null;
        };
        // Is a given variable undefined?
        _.isUndefined = function(obj) {
            return obj === void 0;
        };
        // Shortcut function for checking if an object has a given property directly
        // on itself (in other words, not on a prototype).
        _.hasKey = function(obj, key) {
            return hasOwnProperty.call(obj, key);
        };
        // Return a random integer between min and max (inclusive).
        _.random = function(min, max) {
            if (max == null) {
                max = min;
                min = 0;
            }
            return min + Math.floor(Math.random() * (max - min + 1));
        };
        // Generate a unique integer id (unique within the entire client session).
        // Useful for temporary DOM ids.
        var idCounter = 0;
        _.uniqueId = function(prefix) {
            var id = ++idCounter + "";
            return prefix ? prefix + id : id;
        };
        //替换path里面的变量，如{id}
        function fixPath(path, obj) {
            return path.replace(/(^\s*)|(\s*$)/g, "").replace(/\{.*?\}/gi, function(m) {
                return obj[m.replace(/\{|\}/gi, "")];
            });
        }
        var baseClass = {};
        //新组装一个插件
        function makeWidget(path, func, behavior, proto) {
            var root = this;
            function Widget(p) {
                //继承，new一个base，把base的状态付给对象
                if (this.INHERIT) {
                    var base = this.base = new G.widget[this.INHERIT](p);
                    for (var x in base) if (base.hasOwnProperty(x)) this[x] = base[x];
                }
                func.call(this, p);
                //初始化处理阶段
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
            Widget.prototype.PATH = path;
            if (baseClass.path) {
                Widget.prototype[baseClass.type] = baseClass.path;
                if (baseClass.type == "REBUILT") Widget.prototype.baseProto = G.chips[baseClass.path].proto;
                baseClass.path = null;
            }
            var extend = this.extend[proto.TYPE];
            //需要跟page分开扩展
            //对widget 和page的内部方法扩展
            for (var x in extend) Widget.prototype[x] = extend[x];
            //原型处理阶段，所有原型方法就绪
            for (var x in behavior) {
                var f = G.extend[proto.TYPE + "/behavior"][x];
                if (f) {
                    f = f[1];
                    //返回初始化前执行函数 ，应该调整一下
                    if (f) f.call(this, path, behavior[x], proto);
                }
            }
            for (var x in proto) Widget.prototype[x] = proto[x];
            //返回组装类
            return Widget;
        }
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
        G.Extend("grace", {
            Widget: function(path, func, behavior, proto) {
                proto.TYPE = "widget";
                //设置生成插件类别
                //需要存储各成分结构，提供复用
                /*
				1、行为只有覆盖，不提供向上指针
				2、原型方法可提供向上原型指针
				
				复用分为两种模式：
					1、重构---生成兄弟关系的新类；
						a.覆盖base的构造函数，
						b.可选择继承行为，覆盖行为，
						c.覆盖原有原型方法，提供base向上原型指针
						d.执行新的构造函数进行构造
					2、继承---生成父子关系的新类；
						a.执行父级构造函数进行初始构造，生成base向上对象指针；
						b.选择继承行为，覆盖行为，
						c.原型覆盖
						d.执行新的构造函数进行构造
				
			*/
                //继承，在这里实现各成分拷贝
                if (baseClass.path) {
                    //获取base类
                    var base = this.widget[baseClass.path];
                    //获取base构件
                    var chips = this.chips[baseClass.path];
                    var options;
                    //获得继承的行为种类
                    if (baseClass.options == "*") options = Object.keys(G.extend["widget/behavior"]); else options = baseClass.options;
                    var tmp = {};
                    //根据继承行为种类进行拷贝构件
                    for (var i = 0, len = options.length; i < len; i++) tmp[options[i]] = _.extend({}, chips.behavior[options[i]], behavior[options[i]]);
                    behavior = _.extend({}, behavior, tmp);
                    //需要区别是否原生类，如果是原生类，需要继承prototype，如果不是原生类，只需要继承proto
                    proto = _.extend({}, chips.proto, func.prototype, proto);
                }
                this.chips[path] = {
                    path: path,
                    func: func,
                    behavior: behavior,
                    proto: proto
                };
                this.widget[path] = makeWidget.call(this, path, func, behavior, proto);
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
                if (dataset.constructor == Array) {
                    dataset[0] = fixPath(dataset[0], this);
                    DS.initData(path + "/" + dataset[0], dataset[1]);
                } else {
                    DS.initData(path, dataset);
                }
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