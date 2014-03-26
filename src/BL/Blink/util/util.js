define([], function () {

	G.Extend('grace', {
		//domUtils	对dom操作自动处理扩展,,,还需要支持自动去初始化
		//funcUtils	为engine添加prototype函数扩展
		Util : function (domUtils, funcUtils) {
			//调用$$自身扩展方法
			$.extend(funcUtils);

			var du = $.dataUtils= $.dataUtils||{};
			for (var x in domUtils) {
				if (x.indexOf(':') > -1) {
					var xx = x.split(':');
					du[xx[0]] = du[xx[0]] || {};
					du[xx[0]][xx[1]] = domUtils[x];
				} else {
					du['util'] = du['util'] || {};
					du['util'][x] = domUtils[x];
				}
			}
		},
	});

	

	return G;
});
