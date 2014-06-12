define([],
function() {
	

	
	
	function Console(){
		
	}
	Console.prototype={
		constructor:Console,
		//同 info。区别是图标与样式不同。
		warn:function(obj){console.warn(obj);},
		//同 info。区别是图标与样式不同。error 实际上和 throw new Error() 产生的效果相同，使用该语句时会向浏览器抛出一个 js 异常。 
		error:function(obj){console.warn(obj);},
		log:function(obj,style){
			if(style) console.log('%c'+obj,style);
			else  console.log(obj);
		},
		//向控制台输出一条信息，它包括一个指向该行代码位置的超链接。
		debug:function(obj){console.debug(obj);},
		//向控制台输出一条信息，该信息包含一个表示“信息”的图标，和指向该行代码位置的超链接。
		info:function(obj){console.info(obj);},
		//输出一个对象的全部属性（输出结果类似于 DOM 面板中的样式）。
		dir:function(obj){console.dir(obj);},
		//输出一个 HTML 或者 XML 元素的结构树，点击结构树上面的节点进入到 HTML 面板。
		dirxml:function(obj){console.dirxml(obj);},
		//输出 Javascript 执行时的堆栈追踪。
		trace:function(obj){console.trace(obj);},
		//输出消息的同时打开一个嵌套块，用以缩进输出的内容。调用 console.groupEnd() 用以结束这个块的输出。 
		group:function(obj){console.group(obj);},
		groupEnd:function(obj){console.groupEnd(obj);},
		//同 console.group(); 区别在于嵌套块默认是收起的。
		groupCollapsed:function(obj){console.groupCollapsed(obj);},
		groupCollapsedEnd:function(obj){console.groupCollapsedEnd(obj);},
		//计时器，当调用 console.timeEnd(name);并传递相同的 name 为参数时，计时停止，并输出执行两条语句之间代码所消耗的时间（毫秒）。
		time:function(obj){console.time(obj);},
		timeEnd:function(obj){console.timeEnd(obj);},
		//与 profileEnd() 结合使用，用来做性能测试，与 console 面板上 profile 按钮的功能完全相同。
		profile:function(obj){console.profile(obj);},
		profileEnd:function(obj){console.profileEnd(obj);},
		//输出该行代码被执行的次数，参数 title 将在输出时作为输出结果的前缀使用。
		count:function(obj){console.count(obj);},
		
		clear:function(){console.clear();},
	};
	
	
	
	
	
	
	
})