define([], function() {
	function View(obj){
		this._obj=obj;
	}
	
	View.prototype={
		constructor:View,
		
		init:function(data){
			
		},
		
		trigger:function(action,data){
			var e;
			if(e=this._obj.event[action]){
				e(data);
			}else {
				if(action.indexOf(' ')>-1){
					index=action.indexOf(' ');
					ev=action.substr(0,index);
					st=action.substr(index+1);
				}else {
					st=action;
					ev='all';
				}
				this._obj._state.trigger(st, ev);
			}
		},
		
		bind:function(state,callback){
			var st,ev,index;
			if(state.indexOf(' ')>-1){
				index=state.indexOf(' ');
				ev=state.substr(0,index);
				st=state.substr(index+1);
			}else {
				st=state;
				ev='all';
			}
			this._obj._state.bind(st, ev, callback);
		},
		unbind:function(state){
			var st,ev,index;
			if(state.indexOf(' ')>-1){
				index=state.indexOf(' ');
				ev=state.substr(0,index);
				st=state.substr(index+1);
			}else {
				st=state;
				ev='all';
			}
			this._obj._state.unbind(st, ev);
		},
		
		// get state , can't set state ;
		state:function(name){
			
			if(arguments.length==2){
				throw new Error("can't set state.");
			}
			
			return this._obj._state.get(name);
			
		},
		
		
		
		destroy:function(){
			
		},
		
		
	}
	
	return View;
});