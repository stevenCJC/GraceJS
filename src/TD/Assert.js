define(['TD/var/consl'],
function(consl) {
	
	
	
	function Assert(){
		
	}
	
	Assert.prototype={
		
		constructor:Assert,
		//大致等于,是Object对象就直接stringify进行字符串对比
		ok: function (ac, msg, data) {
			consl.push({
			    assert: !!ac,
			    msg: ' [ok]   '+msg,
			    //ex: 1,
			    //ac: ,
			    data: data,
			});
		},
		sa: function (ac, ex, msg, data) {
		    consl.push({
		        assert: ac == ex,
		        msg: ' [sa]   '+msg,
		        ex: ex,
		        ac: ac,
		        data: data,
		    });
		},
		//严格等于,是Object对象就比较每个属性绝对相等
		eq: function (ac, ex, msg, data) {
		    consl.push({
		        assert: ac === ex,
		        msg: ' [eq]    '+msg,
		        ex: ex,
		        ac: ac,
		        data: data,
		    });
		},
		deq: function (ac, ex, msg, data) {
		    var eq;
		    //需要转换一下ac和ex为Object类型才能安全输出
		    if (typeof ac == 'object' && typeof ex == 'object') {
		        eq = true;
		        for (var x in ac) {
		            if (ac[x] !== ex[x]) {
		                eq = false;
		                break;
		            }
		        }
		        if (eq) for (var x in ex) {
		            if (ac[x] !== ex[x]) {
		                eq = false;
		                break;
		            }
		        }
		    } else eq = ac === ex;
		    consl.push({
		        assert: eq,
		        msg: ' [deq]   '+msg,
		        ex: ex,
		        ac: ac,
		        data: data,
		    });
		},
		//类型判断
		type: function (val, type, msg,data) {
		    var eq;
		    if (typeof type == 'undefined') {
		        eq = typeof val == 'undefined';
		        consl.push({
		            assert: eq,
		            msg: ' [type]   '+msg,
		            ex: 'undefined',
		            ac: val,
		            data: data,
		        });
		    } else if (type == null) {
		        eq = val == null;

		        consl.push({
		            assert: eq,
		            msg: msg,
		            ex: null,
		            ac: val,
		            data: data,
		        });
		    } else {
		        eq = val.constructor == type;
		        consl.push({
		            assert: eq,
		            msg: msg,
		            ex: type,
		            ac: val,
		            data: data,
		        });
		    }
		},
		
		block:function(name){
			consl.block(name);
		},
		
		blockEnd:function(){
			consl.blockEnd();
		},
		//调用外部测试模块
		pub:function(name,data,until){
		    if (arguments.length != 3) throw new Error('Assert.pub needs 3 parametters.');
			

		},
		
		
	};
	
	return Assert;
	
})