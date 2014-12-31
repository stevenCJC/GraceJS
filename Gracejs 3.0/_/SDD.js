define(['g'],function (g) {
	
	// 状态数据定义
	/*
		name=sdf,wer&list=id:12,name:sdfsdf;id:13,name:3dfsdf
		
		
	*/
	
	g.sdd={};
	g.sdd.parse=function(str){
		if(str&&str.constructor==String){
			str=parseSdd(str);
			if(str) return new SDD(str);
			else return new SDD();
		} else return new SDD();
		
	};
	
	
	function SDD(obj){
		if(!obj) return null;
		if(typeof obj =='object')
			for(var x in obj) 
				if(obj.hasOwnProperty(x)) 
					this[x]=obj[x];
		//console.log(this);
	}
	
	
	SDD.prototype={
		
		constructor:SDD,
		valueOf:function(){
			var data={};
			for(var x in this) 
				if(this.hasOwnProperty(x)) 
					data[x]=this[x];
			return data;
		},
		toString:function(){
			return sddToString(this);
		},
		
	};
	
	
	
	/*
		
		a=1,2,3,4&b=id:123,name:werwer;id:222,name:rrrrr
		
	*/
	
	function parseSdd(str){
		
		if(!str||str.indexOf('=')==-1) return null;
		
		//劈开 &
		var tmp=str.split('&');
		
		var data={},t,tt,kk;
		//遍历每个单位
		for(var i=0;i<tmp.length;i++){
			if(!tmp) continue;
			//劈开 = 
			t=tmp[i].split('=');
			if(!t[0]||!t[1]) continue;
			if(t[1].indexOf(';')!=-1){// 如果有 ; 则确定为 数组
				data[t[0]]=[];
				t[1]=t[1].split(';'); // 劈开数组元素
				for(var j=0;j<t[1].length;j++){ //遍历每个元素
					if(!t[1][j]) continue;
					data[t[0]].push(parseObject(t[1][j])); //生成对象
				}
			}else data[t[0]]=parseObject(t[1]); //生成对象
		}
		return data;
	}
	
	function parseObject(str){
		if(!str) return null;
		var data,arr;
		if(str.indexOf(',')!=-1){
			arr=str.split(',');
			if(str.indexOf(':')!=-1) { // 对象
				data={};
				for(var i=0;i<arr.length;i++){
					if(!arr[i]) continue;
					arr[i]=arr[i].split(':');
					if(!arr[i][0]) continue;
					data[arr[i][0]]=arr[i][1]?unescape(arr[i][1]):null; 
				}
				return data;
			}else{
				for(var i=0,l=arr.length;i<l;i++)
					arr[i]=arr[i]?unescape(arr[i]):null
				return arr;//数组
			}
		}else return unescape(str);//字符串
		
	}
	
	
	function sddToString(obj){
		
		if(!obj) return '';
		var str=[];
		for(var x in obj){
			if(obj.hasOwnProperty(x))
				str.push(x+'='+objToString(obj[x]));
		}
		return str.join('&');
	}
	
	function objToString(obj,inside){
		
		if(!obj) return '';
		var arr=[];
		if(obj.constructor==Array){
			if(obj[0]&&obj[0].constructor==Object){
				for(var i=0,l=obj.length;i<l;i++)
					obj[i]=objToString(obj[i],1);
				return obj.join(';');
			}else {
				for(var i=0,l=obj.length;i<l;i++)
					obj[i]=escape(obj[i]);
				return obj.join(',');
			}
		}else if(typeof obj=='object'){
			for(var x in obj){
				if(obj.hasOwnProperty(x))
					arr.push(x+(inside?':':'=')+escape(obj[x]));
			}
			return arr.join(',');
		}else return escape(obj.toString());
		
				
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});