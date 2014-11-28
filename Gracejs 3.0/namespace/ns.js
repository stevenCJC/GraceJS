define(['g'], function(g) {
	
	
	
	
	/*
		命名空间的需求：
			
			作为公共域的一个子集
			
			基本影响的操作包括：
				
				1、订阅监听中介  sub  pub
				2、数据存储   变量:data  对象:object
				3、构造的组件
				4、上级能获得子级的命名空间
				
		
	
	var chat=g.namespace('chat');
	
	var c=new chat.ChatWindow();
	list.append(c.render());
	
	g=g.namespace('user'); 
	
	g=g.namespace('user/list');
	
	*/
	//开放给开发者的 编程接口 
	
	g.namespace=function(namespace){
		var ns={};
		for(var x in g) a[x]=g[x];
		
		g.__namespaces__[namespace]=g.__namespaces__[namespace]||{
			__namespace__:namespace,
			data:{},
			object:{},
			class:{},
			widget:{},
			view:{},
			model:{},
			controller:{},
			pub:function(name,data){
				g.pub(name.indexOf('!')>-1?name.replace(/\?/g,''):(name+'.'+namespace),data);
			},
			sub:function(name,cb){
				g.sub(name.indexOf('!')>-1?name.replace(/\?/g,''):(name+'.'+namespace),cb);
			},
			namespace:function(namespace_){return g.namespace(namespace+'/'+namespace_);},
			
		};
		g.o.extend(ns,g.__namespaces__[namespace]);
		return ns;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});