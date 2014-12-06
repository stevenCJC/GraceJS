define([], function() {
	
	return function(str,len, allStr){
		if(!str) return;
		len=len||64;
		var box=[];
		
		var code,ind,strLen=str.length,tmp;
		
		for(var i=0;i<len;i++) {
			ind=i%len;
			box[ind]=box[ind]||strLen*i;
		}
		var sum=1314;
		for(var i=0;i<strLen+len;i++) {
			code=str.charCodeAt(i%strLen);
			box[i%len]+=code*sum;
			sum+=code;
		}
		
		for(var i=0;i<len;i++) {
			box[i]=box[i]%127;
			if(!allStr){
				if(box[i]<33) box[i]=box[i]+33;
			}else {
				if(box[i]<48) box[i]=box[i]%10+48;
				else if(box[i]>57&&box[i]<65) box[i]=box[i]%26+65;
				else if(box[i]>90&&box[i]<97||box[i]>122) box[i]=box[i]%26+97;
			}
		}
		
		
		
		
		return String.fromCharCode.apply(this,box);
		
		
	}
	
	
	
});