define(["g" , './var/_models' ,'ajax/request', './common/dataset/DS','_/string'], function (g, _models, request, DS) {
	
	
	/*
		
		不限数据源
		return g.Model.extend({
			getList:{
				url : '',
				data:{ page:0 },
				type:'post',
				datatype:'json',
				async:true, //可自行判断是否有callback函数
				default:{ //默认数据
					
				},
				before:function(xhr){ //简化传参，服务端接口与前端业务逻辑解耦
					xhr.url=xhr.url+'/'+xhr.data.id;
					xhr.data.index=xhr.data.page;
					delete xhr.data.page;
				},
				complete : function(data){ //数据预处理，与服务端接口解耦
					data.AID=data.id;
					delete data.AID;
					return data;
				},
				cache:'local:peopleList',
			},
			delete:{
				url:'',
			},
			
			getDetails:{
				localstorage:'',
				before:
				success:
				error:
			}
		});
		
			
			
			
			model.getList(function(data){});
			model.getList({
				success:function(data){},
				error:function(e){},
				before:function(setting){},
			});
			
			
1			
	*/
	
	
	
	
	g.Model.extend=function(opts){
		
		var models={},d;
		for(var x in opts){
			d=opts[x];
			if(d.url){
				models[x]=function(data,success,error){
					var sto,stg,async;
					
					if(arguments.length==1){
						if(data&&data.constructor==Function) {
							success=data;
							data={};
						}
					}else if(arguments.length==2){
						if(data&&data.constructor==Function) {
							error=success;
							success=data;
							data={};
						}
					}
					
					async=d.async!=undefined?d.async:(success?false:true);
					
					if(d.cache){
						//if(d.cache==true) stg=;
						stg=d.cache.split(':');
					}
					
					if(!data['-f']) {
						sto=storage(stg[0].trim(), stg[1].trim());
						if(sto){
							var t;
							if(success) t = success(sto);
							if(!async) return t!=undefined?t:sto;
						}
					}
					
					if(data['-f']||!d.cache||!sto){
						if(data['-f']) delete data['-f'];
						var r,setting={
							url : 		d.url,
							type : 		d.type,
							data : 		g.object.extend(d.data,data),
							dataType : 	d.dataType,
							async:		async,
							beforeSend:	d.before,
							success : function(data_){
								var t;
								//if(d.cache&&!d.force) 
								if(d.success) t=d.success(data_);
								r=t==undefined?data_:t;
								
								if(d.cache) storage(stg[0].trim(), stg[1].trim(),r);
								
								if(success) t = success(r);
								r=t==undefined?r:t;
								
							},
							error : function(e){
								d.error&&d.error(e);
								error&&error(e);
							},
						};
						request(setting);
						if(setting.async) return r;
					}
				};
			}else if(d.local||d.session){
				models[x]=function(data,extend){
					storage(d.local?'local':'session', d.local||d.session, data,extend)
				};
			}
		}
		
		return models;
	};
	
	
	function storage(type, key, data,extend){
		if(!key) throw 'a key is needed .';
		var sType=type=='local'?window.localStorage:(type=='session'?window.sessionStorage:null);
		if(!sType)throw 'storage type or window.localStorage or window.sessionStorage is needed .';
		if(data==undefined){
			return g.string.ifJson(sType[key]);
		}else{
			if(!extend) sType[key]=(data&&data.constructor==Object)?JSON.stringify(data):data;
			else {
				var d=g.string.ifJson(sType[key]);
				if(d.constructor==Object){
					g.object.extend(d,data);
					sType[key]=JSON.stringify(d);
				}else sType[key]=data;
			}
		}
		
		
	}
	
});