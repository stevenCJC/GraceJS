define(["../core", 'dom/$'], function (G, $) {

	//对内部的dom进行扩展，不再对外部dom操作框架进行封装

	G.Extend('grace', {
		//扩展grace的Engine扩展功能
		//两个必须参数
		// proto	原型扩展
		// extend	属性方法扩展
		/*Engine : function (proto, extend) {
			if (proto)
				for (var x in proto)
					$.fn[x] = proto[x];
			if (extend)
				for (var x in extend)
					$[x] = extend[x];
		},*/
		$ : $,

	})

	G.Engine({
		
	}, {
		extend : function (data) {
			for (var x in data)
				(function (name, func) {
					$.fn[name] = func;
				})(x, data[x]);
		},
	})

	return G;
});
