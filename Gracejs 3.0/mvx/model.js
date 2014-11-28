define(["g" , './var/_models' ,'ajax/request', './common/dataset/DS','_/string'], function (g, _models, request, DS) {
	
	
	/*
		
		不限数据源
		return g.Model.extend({
			getList:{
				url : '',
				data:{ page:0 },
				type:'post',
				datatype:'json',
				async:true, //可自行判断是否有callback函数
				default:{ //默认数据
					
				},
				before:function(xhr){ //简化传参，服务端接口与前端业务逻辑解耦
					xhr.url=xhr.url+'/'+xhr.data.id;
					xhr.data.index=xhr.data.page;
					delete xhr.data.page;
				},
				complete : function(data){ //数据预处理，与服务端接口解耦
					data.AID=data.id;
					delete data.AID;
					return data;
				},
				cache:'local:peopleList',
			},
			delete:{
				url:'',
			},
			
			getDetails:{
				localstorage:'',
				before:
				success:
				error:
			}
		});
		
			
			
			
			model.getList(function(data){});
			model.getList({
				success:function(data){},
				error:function(e){},
				before:function(setting){},
			});
			
			
1			
	*/
	
	
	
	
	g.Model.extend=function(opts){
		
		var models={},d;
		for(var x in opts){
			d=opts[x];
			if(d.url){
				models[x]=function(data,success,error){
					var sto,stg,async;
					
					if(arguments.length==1){
						if(data&&data.constructor==Function) {
							success=data;
							data={};
						}
					}else if(arguments.length==2){
						if(data&&data.constructor==Function) {
							error=success;
							success=data;
							data={};
						}
					}
					
					async=d.async!=undefined?d.async:(success?false:true);
					
					if(d.cache){
						//if(d.cache==true) stg=;
						stg=d.cache.split(':');
					}
					
					if(!data['-f']) {
						sto=storage(stg[0].trim(), stg[1].trim());
						if(sto){
							var t;
							if(success) t = success(sto);
							if(!async) return t!=undefined?t:sto;
						}
					}
					
					if(data['-f']||!d.cache||!sto){
						if(data['-f']) delete data['-f'];
						var r,setting={
							url : 		d.url,
							type : 		d.type,
							data : 		g.object.extend(d.data,data),
							dataType : 	d.dataType,
							async:		async,
							beforeSend:	d.before,
							success : function(data_){
								var t;
								//if(d.cache&&!d.force) 
								if(d.success) t=d.success(data_);
								r=t==undefined?data_:t;
								
								if(d.cache) storage(stg[0].trim(), stg[1].trim(),r);
								
								if(success) t = success(r);
								r=t==undefined?r:t;
								
							},
							error : function(e){
								d.error&&d.error(e);
								error&&error(e);
							},
						};
						request(setting);
						if(setting.async) return r;
					}
				};
			}else if(d.local||d.session){
				models[x]=function(data,extend){
					storage(d.local?'local':'session', d.local||d.session, data,extend)
				};
			}
			
		}
		
		return models;
	};
	
	
	function storage(type, key, data,extend){
		if(!key) throw 'a key is needed .';
		var sType=type=='local'?window.localStorage:(type=='session'?window.sessionStorage:null);
		if(!sType)throw 'storage type or window.localStorage or window.sessionStorage is needed .';
		if(data==undefined){
			return g.string.ifJson(sType[key]);
		}else{
			if(!extend) sType[key]=(data&&data.constructor==Object)?JSON.stringify(data):data;
			else {
				var d=g.string.ifJson(sType[key]);
				if(d.constructor==Object){
					g.object.extend(d,data);
					sType[key]=JSON.stringify(d);
				}else sType[key]=data;
			}
		}
		
		
	}
	
	
	function Model(options) {
		this.options = options;
		this.dataset = new DS();
		this.xhr = null;
		
	}
	Model.prototype = {
		constructor : Model,
		fetch : function (beforeSend, onSuccess, onError) {
			var options = this.options,that=this;
			options.beforeSend = function (xhr) {

				if (beforeSend)
					beforeSend(xhr);

				if (options.onSend)
					options.onSend(xhr);

				if (options.dataConver)
					converName(xhr.data, options.dataConver);

			};

			options.success = function (data) {

				converName(data, options.conver);

				if (options.default)data = setDefault(options.default, data);

				that.dataset.set(data);

				onSuccess(that.dataset);

			}

			options.error = onError;

			if (this.xhr && this.xhr.readyState > 0 && this.xhr.readyState < 4)
				this.xhr.abort();

			this.xhr = request(options);

			},
			abort : function () {
				if(this.xhr)
					this.xhr.abort();
			},
			get : function (path) {
				return this.dataset.get(path);
			},
			set : function (path, newValue) {
				this.dataset.set(path, newValue);
			},
			delete : function (path) {
				this.dataset.delete(path);
			},
			bind : function (path, event, callback) {
				this.dataset.bind(path, event, callback);
			},
			unbind : function (path, event) {
				this.dataset.unbind(path, event);
			},
			trigger : function (path, event) {
				this.dataset.trigger(path, event);
			},
			getDS : function (path) {
				return this.dataset.getDS(path);
			},

		};

		for (var x in DS.prototype) {
			Model.prototype[x] = function () {
				DS.prototype[x].apply(this.dataset, arguments);
			};
		}

		function setDefault(def, data) {
			if (!data)
				return def;
			for (var x in def) {
				if (def[x].constructor == Object) {
					data[x] = data[x] || {};
					setDefault(def[x], data[x]);
				} else {
					if (typeof data[x] == 'undefined' || !data[x])
						data[x] = def[x];
				}
			}
			return data;
		}

		function converName(data, rules) {
			if (!data || !rules)
				return data;
			var tmp = {},
			name,
			func,
			conver,
			tmp2;

			if (data.constructor == Array) {
				for (var i = 0, len = data.length; i < len; i++) {
					converName(data[i], rules);
				}
			} else if (data.constructor == Object) {
				for (var x in rules) {

					if (rules[x].constructor == String) {
						name = rules[x] || x;
					} else if (rules[x].constructor == Object) {
						name = rules[x].name || x;
						func = rules[x].node;
						conver = rules[x].conver;
					}

					//字段名替换的情况
					if (typeof data[name] != 'undefined') {
						tmp[name] = data[name];
					}

					if (typeof tmp[x] != 'undefined') {
						data[name] = func ? func(tmp[x], data) : (conver ? converName(tmp[x], conver) : tmp[x]);
						delete tmp[x];
					} else if (typeof data[x] != 'undefined') {
						data[name] = func ? func(data[x], data) : (conver ? converName(data[x], conver) : data[x]);
						delete data[x];
					}

					conver = func = name = null;
				}

			}

			return data;

		}

		function request(options) {
			
			if (!options.debug && !options.url)
				return;
			if (!options.datatype)
				options.datatype = 'json';
			if (!options.success)
				options.success = function () {};
			if (!options.error)
				options.error = function (e) {};
			if (typeof options.async=='undefined'||options.async) options.async=true;
			else options.async=false;
			var error_ = function (e) {
				e = e || {};
				if (e.statusText == "abort")
					return;

				if (options.debug) {
					$.ajax({
						url : options.debug,
						async : options.async,
						dataType : 'html',
						success : function (data) {
							try {
								if (options.datatype == 'json') {
									var d = "var json=" + data;
									eval(d);
								}
							} catch (e) {
								var json;
								error(e);
							}
							options.success(json || data);
						},
						error : options.error
					});
				}
			};
			if (options.url || options.datatype != 'json') {
				return $.ajax({
					url : options.url,
					data : options.data,
					type : options.type,
					async : options.async,
					dataType : options.datatype,
					success : options.success,
					error : error_,
				});
			} else if (!options.url && options.debug) {
				return $.ajax({
					url : options.debug,
					async : options.async,
					dataType : 'html',
					success : function (data) {
						try {
							if (datatype == 'json') {
								var d = "var json=" + data;
								eval(d);
							}
						} catch (e) {
							var json;
							options.error(e);
						}
						options.success(json || data);
					},
					error : options.error
				});
			}
		}

		return Model;

	});
