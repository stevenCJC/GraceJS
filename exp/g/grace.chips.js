(function(G){
	
	G['_Chips']=new Chips();
	
	G.DS=function(n,ds){
		G['_Chips'].setDS(n,ds);
	};
	
	G.Init=function(n,ds,init){
		if(arguments.length==3) G['_Chips'].setDS(n,ds);
		else if(arguments.length==2) init=ds;
		else throw new Error('G.Init('+n+'...) 参数不对');
		G['_Chips'].setInit(n,init);
	};
	
	G.Subscribe=function(n,ds,subs){
		if(arguments.length==3) G['_Chips'].setDS(n,ds);
		else if(arguments.length==2) subs=ds;
		else throw new Error('G.Subscribe('+n+'...) 参数不对');
		G['_Chips'].setSubs(n,subs);
	};
	
	G.Function=function(n,ds,func){
		if(arguments.length==3) G['_Chips'].setDS(n,ds);
		else if(arguments.length==2) func=ds;
		else throw new Error('G.Function('+n+'...) 参数不对');
		G['_Chips'].setFunc(n,func);
	};
	
	G.Widget=function(n,ds,init,subs,func){
		if(arguments.length!=5) throw new Error('G.Widget('+n+'...) 参数不对，需要 5 个参数');
		G['_Chips'].setDS(n,ds);
		G['_Chips'].setInit(n,init);
		G['_Chips'].setSubs(n,subs);
		G['_Chips'].setFunc(n,func);
	};
	
	function Chips(){
		this.chips={};
	}
	
	
	Chips.prototype={
		setDS:function(n,list){
			var c=this.chips[n]=this.chips[n]||{};
			var t=c.ds=c.ds||{};
			for(var x in list){
				t[x]=t[x]||{};
				if(x=='this'){
					for(var y in list[x]) t[x][y]=list[x][y];
				}else if(x=='public'){
					for(var y in list[x]) t[x][y]=list[x][y];
				}
				//t[x]=list[x];
			}
		},
		setInit:function(n,list){
			var c=this.chips[n]=this.chips[n]||{};
			var t=c.init=c.init||{};
			for(var x in list) t[x]=list[x];
		},
		setSubs:function(n,list){
			var c=this.chips[n]=this.chips[n]||{};
			var t=c.subs=c.subs||{};
			for(var x in list){
				t[x]=list[x];
				G['_Mediator'].subscribe(n,x);//写入到中介
			}
		},
		setFunc:function(n,list){
			var c=this.chips[n]=this.chips[n]||{};
			var t=c.func=c.func||{};
			for(var x in list) t[x]=list[x];
		},
		get:function(n){
			return this.chips[n];
		},
	}
	
	
	
	
	
	
})(G)