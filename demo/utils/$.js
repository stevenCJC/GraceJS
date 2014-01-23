	G.$=function(s){
		return new Engine(s);
	};
	$Engine=Engine;
	function Engine(s){
		/*底层依赖库相关对象*/
		var jq=this.jq=$(s);
		/*/底层依赖库相关对象*/
		
		/*dom元素模拟数组的方式使用*/
		var i=0;
		while(jq[i]){this[i]=jq[i];i++}
		this.length=jq.length;
		i=null;
		/*/dom元素模拟数组的方式使用*/
		
		/*设定GraceJS内部使用方法*/
		var methods=['find','html','val','text','remove','css','attr','addClass','data','on','append'];
		var m
		while(m=methods.pop()) (function(m,that){
			//绑定底层库方法
			Engine.prototype[m]=function(){
				//调用底层库方法，apply效率可能不够高
				var d=this.jq[m].apply(this.jq,arguments);
				//如果返回底层库对象，则返回G.$对象
				if(this.jq.constructor==d.constructor) return that;
				//否则返回数据
				else return d;
			};
		})(m,this);
		
		
		
	}
	
	/*定义GraceJS内部使用方法*/
	Engine.prototype={
		off:function(){},
	}
	
	G.$.extend=function(data){
		for(var x in data)
			(function(name,func){
				$.fn[name]=function(){
					var args=arguments;
					return this.each(function(){
						func.apply(this,args);
					});
				};
				Engine.prototype[name]=function(){
					var d=this.jq[name].apply(this.jq,arguments);
					if(this.jq.constructor==d.constructor) return this;
					else return d;
				}
			})(x,data[x]);
		}








