G.Page('base/header',
function(){
	this.PLObj={};//私有不公开的属性
},{
	//独立于对象的数据岛，按对象路径存储
	DataSet:{
		menu:[{},{}],
	},
	Subscribe:{
		
		'mouseout body@#mySpace':function(el,e,data){
		
		},
	},
	getMenu:{
		url:'~/sys/menu',
		Debug:[
			{url:'people#index',text:'人才'},
			{url:'company#index',text:'公司'},
			{url:'assignment#index',text:'项目'},
		],
	},
},{
	'#menu':function(el){
		this.getMenu(function(p){
			p.url=p.url+'/'+this.DS('user/id');
			//先判断DS中的类型，再对值进行相应处理    基本类型，数组，集合,默认不进行类型变换，this.DS.force(key,value)可以强制转换
			//this.DS('user/id',100000123);
			//this.DS('user/ids',100000123);
			//this.DS('user',{id:100000123});
			//this.DS.delete('user');
			//this.DS.clear('user/ids');
			p.params.module='people';
			return p;
		},function(data){
			
		},function(e){
			
		})
	},
	'dom:#header-add':function(el){
		
	},
	'ls:key':function(data){
		
	},
	
},{
	function1:function(){},
	function2:function(){},
	function3:function(){},
	function4:function(){},
})





