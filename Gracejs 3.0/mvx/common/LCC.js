define(['g','_/is','dom/core','dom/','_/utils'], function (g) {
	
	var css={
		
		//构建期
		
		__onCreate:function(_extends){
			
			
			var render=this.Constructor.prototype.Render||function(){};
			delete this.Constructor.prototype.Render;
			this.Constructor.prototype.render=function(){
				
				if(this._rendered) console.warn(this.__name__+' rendered again.',this);
				
				var html=g.u.call(render,arguments,this);
				
				g.q(html).attr('WidgetID',this._sid);
				
				this._rendered=true;
				
				return html;
			};
			
			
			var init=this.Constructor.prototype.Init||function(){};
			delete this.Constructor.prototype.Init;
			this.Constructor.prototype.init=function(){
				if(this._inited) console.warn(this.__name__+' inited again.',this);
				var i=this._widgets.length;
				while(this._widgets[i++])
					if(this._widgets[i-1].init) 
						this._widgets[i-1].init.call(this);
				init.call(this);
				this._inited=true;
			};
			
			
			var destroy=this.Constructor.prototype.Destroy||function(){};
			delete this.Constructor.prototype.Destroy;
			this.Constructor.prototype.destroy=function(){
				var i=0;
				while(this._widgets[i++])
					if(this._widgets[i-1].destroy) 
						this._widgets[i-1].destroy.call(this);
				destroy.call(this);
				i=0;
				while(this._widgets[i++])
					if(this._widgets[i-1].destroy) 
						this._widgets[i-1].destroy.call(this);
			};
			
			
		},
		
		//实例化期
		
		__onInstantiate:function(){
			
		},
		__onDestroy:function(){},
		
		
		//function
		use:function(widget,param1,param2,paramX){
			
			this._widgets=this._widgets||[];
			
			if(typeof widget=='object') {
				this._widgets.push(widget);
			}else {
				var w=g.u.New(widget,arguments);
				this._widgets.push(w);
				return w;
			}
		},
		
		
	};
	
	
	
	return css;
});



