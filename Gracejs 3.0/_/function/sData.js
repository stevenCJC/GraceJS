define(['g'],function (g) {
	
	function SData(str){
		this.str=str;
	}
	
	SData.prototype= {
		
		constructor:SData,
		
		toString:function(data){
			for(var x in data) 
		},
		
		parse:function (url){
			if(!url||url.indexOf('=')==-1) return null;
			if(url.indexOf('?')>-1) var tmp=url.split('?')[1].split('&');
			else var tmp=url.split('&');
			
			var data={},t,tt,kk;
			for(var i=0;i<tmp.length;i++){
				if(!tmp) continue;
				t=tmp[i].split('=');
				if(!t[0]||!t[1]) continue;
				if(t[1].indexOf(';')!=-1){
					data[t[0]]=[];
					t[1]=t[1].split(';');
					for(var j=0;j<t[1].length;j++){
						if(!t[1][j]) continue;
						data[t[0]].push(makeObj(t[1][j]));
					}
				}else data[t[0]]=makeObj(t[1]);
			}
			return data;
		},
		
	}
	
	function makeObj(str){
		if(!str) return null;
		var data,kk,tt,t;
		if(str.indexOf(',')!=-1){
			kk=str.split(',');
			if(str.indexOf(':')!=-1) {
				data={};
				for(var i=0;i<kk.length;i++){
					if(!kk[i]) continue;
					kk[i]=kk[i].split(':');
					if(!kk[i][0]||!kk[i][1]) continue;
					data[kk[i][0]]=kk[i][1]; 
				}
				return data;
			}else{
				return kk;
			}
		}else return str;
	}
	
	var chars=[',',';','=','&',':','/'];
	function _decode(str){
		str=str.replace(/\,/g,'!0!');
		str=str.replace(/\;/g,'!1!');
		str=str.replace(/\=/g,'!2!');
		str=str.replace(/\:/g,'!3!');
		str=str.replace(/\//g,'!4!');
		str=str.replace(/\&/g,'!5!');
		return str;
	}
	function _encode(str){
		str=str.replace(/\!0\!/g,',');
		str=str.replace(/\!1\!/g,';');
		str=str.replace(/\!2\!/g,'=');
		str=str.replace(/\!3\!/g,':');
		str=str.replace(/\!4\!/g,'/');
		str=str.replace(/\!5\!/g,'&');
		return str;
		
	}
	
	
	
});