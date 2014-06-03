define(["jquery"],function($) {
	
	function Models(){
		this.model={};
		this.baseUrl={
			'~':window.info.base_url,
			'^':window.info.assets,
		};
		/*
			0 : 非debug状态
			1 ： url请求出错会自动跳转到debug请求debug数据
			2 ： 直接跳转到debug请求debug数据
		*/
		this.debug=0;
		
	}
	
	/*
		解决问题： 
				1、解耦前后端字段对应问题
				2、方便转换字段名
				3、提供默认数据
				4、数据事件绑定
				5、便捷调用
	*/
	// 支持 ~/ 相对根目录，-/ 相对资源目录
	/*options={
		url:'~/',
		debug:'',
		data:{
			id:null,
			type:null,
			tpl:'emali',
		},
		datatype:'json',
		type:'post',
		onSend:function(xhr){
			var data=xhr.data;
			var url=xhr.url;
			data.ID=data.id;
			data.Type=data.type;
			return url+'/'+window.pagetype;
		},
		
		//浅转换，子节点由NODE方法转换
		conver:{
			workexp:'WorkExp',
			counter:{
				name:'Counters',
				node:function(node,data){
					return node;
				},
			},
			value:{
				name:'Items',
				conver:{
					PID:'id',
					DisplayName:'Name',
				}
			}
		},
		
		default:{
			WorkExp:{},
			Counters:{
				CounterTask:0,
			},
		},
		
	}*/
	Models.prototype={
		constructor:Models,
		add:function(name,options){
			options.url=options.url.replace(/\~/,this.baseUrl['~']);
			if(this.debug) options.debug=options.url.replace(/\^/,this.baseUrl['^']);
			else delete options.debug;
			
			this[name]=new Model(options);
		},
		remove:function(name){
			
		},
	};
	
	function Model(options){
		this.options=options;
		this.dataset=null;
		this.xhr=null;
	}
	Model.prototype={
		constructor:Model,
		set:function(path,data){
			
		},
		fetch:function(beforeSend,onSuccess,onError){
			
			options.beforeSend=function(xhr){
				if(beforeSend) beforeSend(xhr);
				if(options.onSend) options.onSend(xhr);
			};
			
			options.success=function(data){
				
				converName(data,options.conver);
				
				if(options.default) data=setDefault(options.default,data);
				
				onSuccess(data);
				
			}
			
			options.error=onError;
			
			if(this.xhr&&this.xhr.readyState>0&&this.xhr.readyState<4) this.xhr.abort();
			
			this.xhr=request(options);
			
			
		},
		abort:function(){
			this.xhr.abort();
		},
		
	};
	
	window.model=window.model||new Models();
	
	
	
	
	
	
	
	function setDefault(def,data){
		if(!data) return def;
		for(var x in def){
			if(def[x].constructor==Object){
				data[x]=data[x]||{};
				setDefault(def[x],data[x]);
			}else{
				if(typeof data[x]=='undefined'||!data[x]) 
					data[x]=def[x];
			}
		}
		return data;
	}
	
	
	
	function converName(data,rules){
		var tmp={},name,func,conver,tmp2;
		
		if(data.constructor!=Array){
			for(var i=0,len=data.length;i<len;i++){
				converName(data[i],rules);
			}
		}else if(data.constructor==Object){
			for(var x in rules){
				
				if(rules[x].constructor==String){
					name=rules[x];
				}else if(rules[x].constructor==Object){
					name=rules[x].name;
					func=rules[x].node;
					conver=rules[x].conver;
				}
				
				//字段名替换的情况
				if(typeof data[name]!='undefined') tmp[name]=data[name];
				
				if(typeof tmp[x]!='undefined') {
					data[name]=func?func(tmp[x],data):(conver?converName(tmp[x],conver):tmp[x]);
					delete tmp[x];
				}else if(typeof data[x]!='undefined') {
					data[name]=func?func(data[x],data):(conver?converName(data[x],conver):data[x]);
					delete data[x];
				}
			}
			conver=func=name=null;
		}
		
		return data;
		
	}
	
	function request(options){
		
		if(!options.debug&&!options.url) return;
		if(!options.datatype) options.datatype='json';
		if(!options.success) options.success=function(){};
		if(!options.error) options.error=function(e){};
		
		
		var error_=function(e){
			e=e||{};
			if(e.statusText=="abort") return;
			
			if(options.debug>0){
				$.ajax({
					url:options.debug,
					async:options.async,
					dataType:'html',
					success:function(data){
						try{
							if(options.datatype=='json') {
								var d="var json="+data;
								eval(d);
							}
						}catch(e){
							var json;
							error(e);
						}
						options.success(json||data);
					},
					error:options.error
				});
			}
		};
		if(options.debug<2||options.datatype!='json'){
			return $.ajax({
				url:options.url,
				data:options.data,
				type:options.type,
				async:options.async,
				dataType:options.datatype,
				success: options.success,
				error:error_,
			});
		}else {
			return $.ajax({
				url:options.debug,
				async:options.async,
				dataType:'html',
				success:function(data){
					try{
						if(datatype=='json') {
							var d="var json="+data;
							eval(d);
						}
					}catch(e){
						var json;
						options.error(e);
					}
					options.success(json||data);
				},
				error:options.error
			});
		}
	}
});