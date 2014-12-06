define(['g','_/utils'], function(g) {
	var	slice = Array.prototype.slice;
	
	g.template=function(text,sid) {
		
		sid=sid||g.utils.parsesid(text);
		
		if(g.template._tpls[sid]) return g.template._tpls[sid];
		
		var noMatch = /(.)^/;
		var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
		var settings = {
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
		source = 'with(obj||{}){\n' + source + '}\n';
	
		source = "var __t,__p='',__j=Array.prototype.join," +
		  "print=function(){__p+=__j.call(arguments,'');};\n" +
		  source + "return __p;\n";
		
		try {
		  render = new Function('obj', source);
		} catch (e) {
		  e.source = source;
		  throw e;
		}
		
		g.template._tpls[sid]=render;
		
		render._sid_=sid;
		
		return render;
		
	};
	g.template._tpls={};
	
	return g.template;
});