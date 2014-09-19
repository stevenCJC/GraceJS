define(["view/View"], function (View) {
	
	/*
	Views.add('name',{
		
		tpl:{
			index:'~/index.html',
			view:'~/index.html',
			edit:'~/index.html',
		},
		
		event:{
			'click body@#load':'loadIndex',
			'viewLoaded':function(value){}
		},
		
		action:{
			
			init:function(){
				
			},
			
			loadIndex:function(){
				
				this.tpl.index(function(tpl){
					
				});
				
			},
			loadView:function(){
				this.tpl.index(function(tpl){
					$('#right').append(tpl(data));
				});
				
				this.state('viewLoaded',true);
				
			},
			
			destroy:function(){
				
			},
		},
		
		state:{
			viewLoaded:false,
		}
		
	});
	
	*/
	function Views(){
		
		
	}
	
	Views.prototype={
		constructor:Views,
		add:function(name,options){
			this[name]=new View(options);
		}
	}
	
});