/*
	
	数据链式操作
		
		
	
*/




if (!window._ || typeof (_) !== "function") {
    
    var dt = (function(window) {
        var slice = [].slice, 
        _jsonPID = 1;
		
		function _ds(data,type){
			this.src=null;
			return this;
		}
		var _ = function(data,type) {
            return new _ds(data, type);
        };
		
		_ds.prototype.constructor=_ds;
		
		
		
		
		
		
		
		
		
		
		
		
		var mt=['each','filter','where']
		for(var i=0,len=mt.lengthl;i<len;i++){
			_ds.prototype[mt[i]]=function(){
				switch(arguments.length=){
				case 1:
				_[mt[i]](this.src,arguments[0]);
				break;
				case 2:
				_[mt[i]](this.src,arguments[0],arguments[1]);
				break;
				case 3:
				_[mt[i]](this.src,arguments[0],arguments[2],arguments[3]);
				break;
			}
		}
		
		
		
		
		
		
		
		
		
		
        var remoteJSPages={};
        _.parseJS= function(div) {
            if (!div)
                return;
            if(typeof(div)=="string"){
                var elem=document.createElement("div");
                elem.innerHTML=div;
                div=elem;
            }
            var scripts = div.getElementsByTagName("script");
            div = null;            
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src.length > 0 && !remoteJSPages[scripts[i].src]) {
                    var doc = document.createElement("script");
                    doc.type = scripts[i].type;
                    doc.src = scripts[i].src;
                    document.getElementsByTagName('head')[0].appendChild(doc);
                    remoteJSPages[scripts[i].src] = 1;
                    doc = null;
                } else {
                    window.eval(scripts[i].innerHTML);
                }
            }
        };
		

			
		_.getNow=function (){
			var d=new Date();
			return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		}
		
		_.find=function(){
			
		}
		
		
		
        /* AJAX functions */
        
        function empty() {
        }
        var ajaxSettings = {
            type: 'GET',
            beforeSend: empty,
            success: empty,
            error: empty,
            complete: empty,
            context: undefined,
            timeout: 0,
            crossDomain: null
        };
        
        _.jsonP = function(options) {
            var callbackName = 'jsonp_callback' + (++_jsonPID);
            var abortTimeout = "", 
            context;
            var script = document.createElement("script");
            var abort = function() {
                $(script).remove();
                if (window[callbackName])
                    window[callbackName] = empty;
            };
            window[callbackName] = function(data) {
                clearTimeout(abortTimeout);
                $(script).remove();
                delete window[callbackName];
                options.success.call(context, data);
            };
            script.src = options.url.replace(/=\?/, '=' + callbackName);
            if(options.error)
            {
               script.onerror=function(){
                  clearTimeout(abortTimeout);
                  options.error.call(context, "", 'error');
               }
            }
            $('head').append(script);
            if (options.timeout > 0)
                abortTimeout = setTimeout(function() {
                    options.error.call(context, "", 'timeout');
                }, options.timeout);
            return {};
        };

        
        _.ajax = function(opts) {
            var xhr;
            try {
				
                var settings = opts || {};
                for (var key in ajaxSettings) {
                    if (typeof(settings[key]) == 'undefined')
                        settings[key] = ajaxSettings[key];
                }
                
                if (!settings.url)
                    settings.url = window.location;
                if (!settings.contentType)
                    settings.contentType = "application/x-www-form-urlencoded";
                if (!settings.headers)
                    settings.headers = {};
               
                if(!('async' in settings)||settings.async!==false)
                    settings.async=true;
                
                if (!settings.dataType)
                    settings.dataType = "text/html";
                else {
                    switch (settings.dataType) {
                        case "script":
                            settings.dataType = 'text/javascript, application/javascript';
                            break;
                        case "json":
                            settings.dataType = 'application/json';
                            break;
                        case "xml":
                            settings.dataType = 'application/xml, text/xml';
                            break;
                        case "html":
                            settings.dataType = 'text/html';
                            break;
                        case "text":
                            settings.dataType = 'text/plain';
                            break;
                        default:
                            settings.dataType = "text/html";
                            break;
                        case "jsonp":
                            return $.jsonP(opts);
                            break;
                    }
                }
                if ($.isObject(settings.data))
                    settings.data = $.queryString(settings.data);
                if (settings.type.toLowerCase() === "get" && settings.data) {
                    if (settings.url.indexOf("?") === -1)
                        settings.url += "?" + settings.data;
                    else
                        settings.url += "&" + settings.data;
                }
                
                if (/=\?/.test(settings.url)) {
                    return $.jsonP(settings);
                }
                if (settings.crossDomain === null) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
                    RegExp.$2 != window.location.host;
                
                if(!settings.crossDomain)
                    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers);
                var abortTimeout;
                var context = settings.context;
                var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
				
				//ok, we are really using xhr
				xhr = new window.XMLHttpRequest();
				
				
                xhr.onreadystatechange = function() {
                    var mime = settings.dataType;
                    if (xhr.readyState === 4) {
                        clearTimeout(abortTimeout);
                        var result, error = false;
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0&&protocol=='file:') {
                            if (mime === 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
                                try {
                                    result = JSON.parse(xhr.responseText);
                                } catch (e) {
                                    error = e;
                                }
                            } else if (mime === 'application/xml, text/xml') {
                                result = xhr.responseXML;
                            } 
                            else if(mime=="text/html"){
                                result=xhr.responseText;
                                $.parseJS(result);
                            }
                            else
                                result = xhr.responseText;
                            //If we're looking at a local file, we assume that no response sent back means there was an error
                            if(xhr.status===0&&result.length===0)
                                error=true;
                            if (error)
                                settings.error.call(context, xhr, 'parsererror', error);
                            else {
                                settings.success.call(context, result, 'success', xhr);
                            }
                        } else {
                            error = true;
                            settings.error.call(context, xhr, 'error');
                        }
                        settings.complete.call(context, xhr, error ? 'error' : 'success');
                    }
                };
                xhr.open(settings.type, settings.url, settings.async);
				if (settings.withCredentials) xhr.withCredentials = true;
                
                if (settings.contentType)
                    settings.headers['Content-Type'] = settings.contentType;
                for (var name in settings.headers)
                    xhr.setRequestHeader(name, settings.headers[name]);
                if (settings.beforeSend.call(context, xhr, settings) === false) {
                    xhr.abort();
                    return false;
                }
                
                if (settings.timeout > 0)
                    abortTimeout = setTimeout(function() {
                        xhr.onreadystatechange = empty;
                        xhr.abort();
                        settings.error.call(context, xhr, 'timeout');
                    }, settings.timeout);
                xhr.send(settings.data);
            } catch (e) {
            	// General errors (e.g. access denied) should also be sent to the error callback
                console.log(e);
            	settings.error.call(context, xhr, 'error', e);
            }
            return xhr;
        };
        
        
        
        _.get = function(url, success) {
            return this.ajax({
                url: url,
                success: success
            });
        };
        
        _.post = function(url, data, success, dataType) {
            if (typeof (data) === "function") {
                success = data;
                data = {};
            }
            if (dataType === undefined)
                dataType = "html";
            return this.ajax({
                url: url,
                type: "POST",
                data: data,
                dataType: dataType,
                success: success
            });
        };
        
        _.getJSON = function(url, data, success) {
            if (typeof (data) === "function") {
                success = data;
                data = {};
            }
            return this.ajax({
                url: url,
                data: data,
                success: success,
                dataType: "json"
            });
        };
		//把参数转换为套接字符串
        _.queryString = function(obj, prefix) {
            var str = [];
            if (obj instanceof $jqm) {
                for(var i=0,len=obj.length;i<len;i++){
                    var k = prefix ? prefix + "[]" : obj.elems[i].name, 
                    v = obj.elems[i].value;
                    str.push((k) + "=" + encodeURIComponent(v));
                };
            } else {
                for (var p in obj) {
                    var k = prefix ? prefix + "[" + p + "]" : p, 
                    v = obj[p];
                    str.push($.isObject(v) ? $.queryString(v, k) : (k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        };
        
		
		
			
		
			
			
			
        return _;
		
		


    })(window);
    '_' in window || (window._ = dt);
}
