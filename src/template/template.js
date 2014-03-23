define(['./core'], function(G) {
	function template(text,moduleName,settings) {
		var	slice = Array.prototype.slice;
	
		var noMatch = /(.)^/;
		var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
		var templateSettings_ = {
			evaluate: /<%([\s\S]+?)%>/g,
			interpolate: /<%=([\s\S]+?)%>/g,
			escape: /<%-([\s\S]+?)%>/g
		};
		var escapes = {
			"'": "'",
			'\\': '\\',
			'\r': 'r',
			'\n': 'n',
			'\t': 't',
			'\u2028': 'u2028',
			'\u2029': 'u2029'
		};
		var render;
		settings = defaults({}, settings, templateSettings_);
	
		var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');
	
		var index = 0;
		var source = "__p+='";
		text.replace(matcher,
		function(match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset).replace(escaper,
			function(match) {
				return '\\' + escapes[match];
			});
	
			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':_escape(__t))+\n'";
			}
			if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}
			index = offset + match.length;
			return match;
		});
		source += "';\n";
	
		// If a variable is not specified, place data values in local scope.
		if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
		source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n function _escape(string) {if (string == null) return ''; return ('' + string).replace(new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'), function(match) {return {'&': '&amp;','<': '&lt;', '>': '&gt;', '\"': '&quot;', '\\'': '&#x27;','/': '&#x2F;'}[match]; });};";
	
		return 'define("'+moduleName+'",[],function(' + (settings.variable || 'obj') + '){\n' + source + '})';
	
		function defaults(obj) {
			slice.call(arguments, 1).forEach(
			function(source) {
				if (source) {
					for (var prop in source) {
						if (obj[prop] == null) obj[prop] = source[prop];
					}
				}
			});
			return obj;
		};
		
	
	};
	
	return template;
});