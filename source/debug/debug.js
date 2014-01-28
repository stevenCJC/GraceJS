
	
	window.DEBUG=-1;// 0 no debug, 1 debug, -1 console;
	
	
	
	function Debug(){
		this.D=window.DEBUG;
		if(this.D==1){
			this._time={};
		}
	}
	
	Debug.prototype={
		
		constructor:Debug,
		open:function(type){
			this.D=type;
			if(this.D==1)debugInit();
		},
		close:function(){
			this.D=0;
			document.getElementsByTagName('body')[0].removeChild(document.getElementById('Debug-box'));
		},
		clear:function(){
			if(this.D==1){
				debugInit();
				document.getElementById('Debug-box').innerHTML='';
			}else if(this.D==-1)
				console.clear();
		},
		log:function(text){
			if(!this.D) return;
			else if(this.D==-1){
				console.log(text);
				return;
			}
			debugInit();
			var el=document.createElement('p');
			el.innerHTML=text;
			document.getElementById('Debug-box').appendChild(el);
		},
		error:function(text){
			if(!this.D) return;
			else if(this.D==-1){
				console.error(text);
				return;
			}
			this.log('<a>ERR:'+text+'</a>');
		},
		warn:function(text){
			if(!this.D) return;
			else if(this.D==-1){
				console.warn(text);
				return;
			}
			this.log('<b>WARNING:'+text+'</b>');
		},
		assert:function(text){
			if(!this.D) return;
			else if(this.D==-1){
				console.assert(text);
				return;
			}else{
				console.assert(text);
				this.log('<i>Asserted in console.</i>');
			}
		},
		dir:function(text){
			if(!this.D) return;
			else if(this.D==-1){
				console.dir(text);
				return;
			}else{
				console.dir(text);
				this.log('<i>dired in console.</i>');
			}
		},
		
		time:function(mark){
			if(!this.D)return;
			else if(this.D==-1){
				console.time(mark);
				return;
			}
			if(this._time[mark]) this.log('<i>the '+mark+' of time was remarked</i>');
			this._time[mark]=getTimer();
		},
		timeEnd:function(mark){
			if(!this.D)return;
			else if(this.D==-1){
				console.timeEnd(mark);
				return;
			}
			this.log('<i> '+mark+' </i> : <b> '+(getTimer()-this._time[mark])+'</b>');
		},
		
		
	}
	
	function debugInit(){
		var box=document.getElementById('Debug-box');
		if(!box&&window.DEBUG){
			var el=document.createElement('div');
			el.id='Debug-box';
			el.className='Debug-box';
			if(document.getElementsByTagName('body')[0]){
				document.getElementsByTagName('body')[0].appendChild(el);
			}
		}
	}
	
	function getTimer(){
		var d=new Date();
		return d.getYear()*365*31*24*60*60*1000+d.getMonth()*31*24*60*60*1000+d.getDate()*24*60*60*1000+d.getHours()*60*60*1000+d.getMinutes()*60*1000+d.getSeconds()*1000+d.getMilliseconds();
	}
	
	
	














