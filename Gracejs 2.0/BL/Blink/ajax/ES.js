define(["jquery",'utils/localstorage','eventsource'],
function($,ls){
	
	
	
	
	
	$(window).on('beforeunload',function(e){
		if(window.ESource&&ls.get('es-id')==window.ESource.esid);
			ls.delete('es-id');
	});
	
	
    return {
		get:function(url,dataready){
			this.fetch(url,dataready);
			
			ls.bind('userID',function(n,o,u){
				if(window.userinfo.id!=n) {
					window.location.reload();
				}
			})
			ls.set('userID',window.userinfo.id);
			
		},
		
		fetch:function(url,dataready){
			var ready=0;
			var id=getTimer();//页面ID
			
			ls.bind('es-data',function(n,o,u){
				if(n) dataready(n);
			},true);
			
			ls.bind('es-id',function(n,o,u){
				if(!n&&o){//删除链接
					if(id!=o) makeES(url,1);
				}else if(!n&&!o){
					closeES();
				}else if(n&&o){
					if(id!=n) closeES();
				}
			})
			
			/*setInterval(function(){
				if(window.ESource){
					id=getTimer();
					window.ESource.esid=id;
					ls.set('es-id',id);
					return;
				}
				makeES(url);
			},10*1000);*/
			
			//加载执行
			makeES(url);
			
			
			
			function makeES(url,doit){
				var t=getTimer();
				if(!doit){
					if(t-parseInt(ls.get('es-id'))<20100)return;
				}
				if(window.ESource)return;
				var source= new EventSource(url);
				source.onmessage = function(event){
					var data=JSON.parse(event.data);
					data['msgID']=(parseInt(id)*Math.random()).toString().substr(0,10).replace(/\./ig,'');
					ls.set('es-data',data);
				}
				source.onerror=function(){
					window.ESource=null;
				}
				window.ESource=null;
				id=t
				ls.set('es-id',id);
				if(source) {
					window.ESource=source;
					window.ESource.esid=id;
				}
			}
			function closeES(){
				 if(window.ESource){
					window.ESource.close();
					window.ESource=null;
				}
			}
			function getTimer(){
				var d=new Date();
				return d.getMonth()*31*24*60*60*1000+d.getDate()*24*60*60*1000+d.getHours()*60*60*1000+d.getMinutes()*60*1000+d.getSeconds()*1000+d.getMilliseconds();
				
			}
		},
		
		
		
	}
});

window.ESource=window.ESource||null;
  
