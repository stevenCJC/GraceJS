
define([], function() {
	//(\w+\,){1,}\w+
	//123,123,23,123
	//(\w+\=[^\&\s]*){1,}
	//key=uuu&kee=123
	function urlData(str){
		var arR=/([^\,\=]+\,){1,}[^\,\=]+/g;
		var objR=/(\w+\=[^\&\s]*){1,}/g;
		if(arR.test(str)) return str.split(',');
		if(objR.test(str)) {
			var o={},tmp;
			str=str.split('&');
			for(var i=0,len=str.length;i<len;i++) {
				tmp=str[i].split('=');
				if(tmp.length==2)o[tmp[0]]=tmp[1];
				else o[i]=tmp[0];
			}
			return o;
		}
		return str;
	}
	return urlData;
});
	








