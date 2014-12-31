define(['g'], function(g) {
	
	
	function Event(){
		
	}
	Event.prototype={
		constructor:Event,
		  
		on:function(events,cb,context){
			var handles=this.handles=this.handles||{};
			events=parseEvents(events);
			var event_;
			while(event_=events.pop()){
				
				handles[event_.type]=handles[event_.type]||[];
				if(event_.ns){
					handles[event_.name]=handles[event_.name]||[];
					handles[event_.type].push({callback:cb,ns:event_.ns,context:context,type:event_.type});
					handles[event_.name].push({callback:cb,ns:event_.ns,context:context,type:event_.type});
				}else handles[event_.type].push({callback:cb,context:context,type:event_.type});
			}
		},
		
		off:function(events){
			if(!events)return;
			var handles=this.handles||{};
			events=parseEvents(events);
			var event_;
			while(event_=events.pop()){
				
				if(handles[event_.type])
					if(!event_.ns){ 
						while(tmp=handles[event_.type].pop())
							if(tmp.ns) delete handles[event_.name];
					}else {
						if(handles[event_.name]) delete handles[event_.name];
						for(var i=0,l=handles[event_.type].length;i<l;i++){
							if(handles[event_.type][i].ns==event_.ns) handles[event_.type].splice(i--,1);
							l--;
						}
					}
			}
		},
		
		once:function(events,cb,context){
			var me=this;
			events=parseEvents(events);
			var event_;
			while(event_=events.pop()){
				this.on(event_,function(data){
					cb.call(this,data);
					me.off(event_);
				},context);
			}
		},
		
		trigger:function(events,data,context){
			if(!events)return;
			var handles=this.handles||{};
			events=parseEvents(events);
			var event_,arg;
			while(event_=events.pop())
				if(handles[event_.name])
					for(var i=0,l=handles[event_.name].length;i<l;i++)
						handles[event_.name][i].callback.call(context||handles[event_.name][i].context,data);
			
		},
		
		
		
	}
	
	
	function parseEvents(events){
		if(!events)return [];
		
		var _events=[],event_;
		
		events=events.split(/\,|\s/g);
		
		while(event_=events.pop()){
			if(event_.indexOf('.')>-1) {
				event_=event_.split('.');
			}else event_=[event_];
			_events.push({type:event_[0],ns:event_[1],name:event_[0]+(event_[1]?'.'+event_[1]:'')});
		}
		
		return _events;
		
	}
	
	
	return Event;
	
});
	