(function(G){
	
	
	
	var assembler = function (name) {
		return function Widget() {
			var chip=G['_Chips'].chips[name];
			
			var ds=chip.ds;
			for (var x in ds){
				switch(x){
					case'this':
						for(var y in ds[x]) this[y] = ds[x][y];
						continue;
						break;
					case'public':
						this['_public']=this['_public']||{};
						for(var y in ds[x]) this['_public'][y] = ds[x][y];
						continue;
						break;
				}
				
			}
			
			this['_Subscr']=chip.subs;
			
			
		};
	};
	
	G['_Assembler'] = function (name) {
		var chip=G['_Chips'].chips[name];
		var Widget = assembler(name);
		Widget.prototype = chip.func;
		Widget.prototype['_Init']=function(){
				var init=chip.init;
				for (var x in init) {
					this.$el = $('#' + x);
					init[x].call(this);//可先存储，后执行，再删除
				}
				this.$el = null;
				delete this.$el;
			}
		Widget.prototype.constructor = Widget;
		return new Widget();
	}
	

	
	
	
	
	
	
})(window.G||G)

