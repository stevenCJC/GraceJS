define(["BL/Blink/main", 'dataset/DS'], function ($, DS) {

	function Model(options) {
		this.options = options;
		this.dataset = new DS();
		this.xhr = null;
		/*
		0 : 非debug状态
		1 ： url请求出错会自动跳转到debug请求debug数据
		2 ： 直接跳转到debug请求debug数据
		 */
		this.debug = 0;
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
