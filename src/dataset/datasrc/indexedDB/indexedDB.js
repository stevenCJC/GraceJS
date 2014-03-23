(function(window){
	
	/*
		此类做不到多重条件查询
	
	
	
	*/
	
	
	
	if (!window.indexedDB) {  
		window.indexedDB = window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB; 
	}
	if(!window.indexedDB) throw new Error('your browser does not support IndexedDB!');
	
	
	var DB=null;
	
	window.IDB=function(dbName,tbName){
		return DB||(DB=new IndexedDB(dbName,tbName));
	}
	
	//{table:''}
	function IndexedDB(dbName,tbName){
		this.dbName=dbName;
		if(tbName) return new Table(this.dbName,tbName);
		return this;
	}
	IndexedDB.prototype={
		
		constructor:IndexedDB,
		// options:{keyPath:"myKey",autoIncrement:false}
		// index：{'id':'unique'}
		createTableByDelDB:function(tables){
			createTableByDelDB(this.dbName,tables)
		},
		add:function(table,data,callback){
			add(this.dbName,table,data,callback);
		},
		get:function(table,index,key,callback){
			get(this.dbName,table,index,key,callback);
		},
		read:function(table,index,range,callback){
			read(this.dbName,table,index,range,callback);
		},
		delete:function(table,key,callback){
			del(this.dbName,table,key,callback);
		},
		clear:function(table,callback){
			clear(this.dbName,table,callback);
		},
	}
	
	
	function Table(dbName,table){
		this.dbName=dbName;
		this.table=table;
	}
	
	Table.prototype={
		constructor:Table,
		add:function(data,callback){
			add(this.dbName,this.table,data,callback);
		},
		get:function(index,key,callback){
			get(this.dbName,this.table,index,key,callback);
		},
		read:function(index,range,callback){
			read(this.dbName,this.table,index,range,callback);
		},
		delete:function(key,callback){
			del(this.dbName,this.table,key,callback);
		},
		clear:function(callback){
			clear(this.dbName,this.table,callback);
		},
	}
	
	function dropTable(db,table,callback){
		var request=window.indexedDB.open(db);
		request.onsuccess = function(event) {
			db = request.result;
			var svreq=db.setVersion('1.1'); 
			svreq.onsuccess=function(){
				db.deleteObjectStore(table);
			}
		}
	}
	
	function createTableByDelDB(db,tables){
		var dbs=window.indexedDB.webkitGetDatabaseNames();
		dbs.onsuccess=function(){
			if(dbs.result.contains(db)) {
				var deldb=window.indexedDB.deleteDatabase(db);
				deldb.onsuccess=function(){
					makeTable()
				}
			}else {
				makeTable()
			}
		}
		function makeTable(){
			var request=window.indexedDB.open(db);
			request.onupgradeneeded  = function(event) {
				db = event.target.result;
				var objectStore;
				for(var i=0; i<tables.length;i++){
					var objectStore =db.createObjectStore(tables[i].name, tables[i].options);
					var index=tables[i].index;
					for(var x in index) objectStore.createIndex(x, x, {unique:index[x]});
				}
				objectStore.transaction.oncomplete = function(event) {
					console.log('objectStore transaction oncompleted .');
					db.close();
				}
				
			}
		}
	}
	
	function clear(db,table,callback){
		var request=window.indexedDB.open(db);
		request.onsuccess = function(event) {
			db = event.target.result;
			var transaction = db.transaction(table, 'readwrite');
			var objectStore = transaction.objectStore(table);
			var subReq=objectStore.clear();
			subReq.onsuccess = function (e) {
				callback&&callback();
				db.close();
			};
		}
		request.onupgradeneeded =function(event){console.log(table+' is not exist');}
	}
	
	/*
	IDBKeyRange.only("Donna");
	IDBKeyRange.lowerBound("Bill");
	IDBKeyRange.lowerBound("Bill", true);不匹配Bill
	IDBKeyRange.upperBound("Donna", true);
	IDBKeyRange.bound("Bill", "Donna", false, true);
	*/
	function read(db,table,index,range,callback){
		var a=[];
		for(var i=0;i<arguments.length;i++){
			if(typeof arguments[i]!='undefined') a[i]=arguments[i];
			else break;
		}
		
		if(a.length==3){
			index=null;
			range=null;
			callback=a[2];
		}else if(a.length==4){
			if(a[2].constructor==Object){
				for(var x in a[2]){
					index=x=='0'?0:x;
					range=rang(a[2][x]);
				}
			}else{
				index=a[2];
				range=null;
			}
			callback=a[3];
		}else if(a.length==5){
		}else console.log('the number of parameters is not right');	
		var that=this;
		if(!db)return;
		var request=window.indexedDB.open(db);
		request.onsuccess = function(event) {
			var db=event.target.result;
			var store=db.transaction(table).objectStore(table);
			if(index)store=store.index(index);
			if(range)store=store.openCursor(range);
			else store=store.openCursor();
			store.onsuccess = function (e) {
				var cursor = e.target.result;
				if (cursor) {
					callback&&callback(e.target.result.value);
					cursor.continue();
				}else {
					db.close();
				}
			};
		}
		request.onupgradeneeded =function(event){
			console.log(table+' is not exist');
		}
		function rang(r){
			/*
			IDBKeyRange.only("Donna");
			IDBKeyRange.lowerBound("Bill");
			IDBKeyRange.lowerBound("Bill", true);不匹配Bill
			IDBKeyRange.upperBound("Donna", true);
			IDBKeyRange.bound("Bill", "Donna", false, true);
			*/
			r=r.toString().replace(/\s/ig,'')
			if(r.indexOf(',')>-1){
				r=r.split(',');
				if(r[0].indexOf('=')>-1&&r[1].indexOf('=')>-1){
					r[0]=r[0].substr(1)
					if(!isNaN(r[0])) r[0]=r[0].indexOf('.')>-1?parseInt(r[0]):parseFloat(r[0]);
					r[1]=r[1].substr(1)
					if(!isNaN(r[1])) r[1]=r[1].indexOf('.')>-1?parseInt(r[1]):parseFloat(r[1]);
					return IDBKeyRange.bound(r[0],r[1], false, false);
				}
				if(r[0].indexOf('=')==-1&&r[1].indexOf('=')>-1){
					if(!isNaN(r[0])) r[0]=r[0].indexOf('.')>-1?parseInt(r[0]):parseFloat(r[0]);
					r[1]=r[1].substr(1)
					if(!isNaN(r[1])) r[1]=r[1].indexOf('.')>-1?parseInt(r[1]):parseFloat(r[1]);
					return IDBKeyRange.bound(r[0],r[1], true, false);
				}
				if(r[0].indexOf('=')>-1&&r[1].indexOf('=')==-1){
					r[0]=r[0].substr(1)
					if(!isNaN(r[0])) r[0]=r[0].indexOf('.')>-1?parseInt(r[0]):parseFloat(r[0]);
					if(!isNaN(r[1])) r[1]=r[1].indexOf('.')>-1?parseInt(r[1]):parseFloat(r[1]);
					return IDBKeyRange.bound(r[0],r[1], false, true);
				}
				if(r[0].indexOf('=')==-1&&r[1].indexOf('=')==-1){
					if(!isNaN(r[0])) r[0]=r[0].indexOf('.')>-1?parseInt(r[0]):parseFloat(r[0]);
					if(!isNaN(r[1])) r[1]=r[1].indexOf('.')>-1?parseInt(r[1]):parseFloat(r[1]);
					return IDBKeyRange.bound(r[0],r[1], true, true);
				}
			}else{
				if(r.indexOf('>=')>-1){
					r=r.substr(2);
					if(!isNaN(r)) r=r.indexOf('.')>-1?parseInt(r):parseFloat(r);
					return IDBKeyRange.upperBound(r, false);
				}
				if(r.indexOf('<=')>-1){
					r=r.substr(2);
					if(!isNaN(r)) r=r.indexOf('.')>-1?parseInt(r):parseFloat(r);
					return IDBKeyRange.lowerBound(r, false);
				}
				if(r.indexOf('>')>-1){
					r=r.substr(1);
					if(!isNaN(r)) r=r.indexOf('.')>-1?parseInt(r):parseFloat(r);
					return IDBKeyRange.upperBound(r, true);
				}
				if(r.indexOf('<')>-1){
					r=r.substr(1);
					if(!isNaN(r)) r=r.indexOf('.')>-1?parseInt(r):parseFloat(r);
					return IDBKeyRange.lowerBound(r.substr(1), true);
				}
				if(r.indexOf('=')>-1){
					r=r.substr(1);
					if(!isNaN(r)) r=r.indexOf('.')>-1?parseInt(r):parseFloat(r);
					return IDBKeyRange.only(r, true);
				}
				if(!isNaN(r)) r=r.indexOf('.')>-1?parseInt(r):parseFloat(r);
				return IDBKeyRange.only(r, true);
			}
		}
	}
	
	function get(db,table,index,key,callback){
		var a=[];
		for(var i=0;i<arguments.length;i++){
			if(typeof arguments[i]!='undefined') a[i]=arguments[i];
			else break;
		}
		if(a.length==4){
			index=null;
			if(a[2].constructor==Object){
				for(var x in a[2]){
					index=x;
					key=a[2][x];
				}
			}else{
				key=a[2];
			}
			callback=a[3];
		}else if(a.length==5){
		}else console.log('the number of parameters is not right');	
		var that=this;
		if(!db)return;
		var request=window.indexedDB.open(db);
		request.onsuccess = function(event) {
			db=event.target.result;
			var store=db.transaction(table).objectStore(table);
			if(index)store=store.index(index);
			store.get(_key).onsuccess = function (e) {
				callback&&callback(e.target.result);
				console.log(e.target.result);
				db.close();
			};
		}
		request.onupgradeneeded =function(event){
			console.log(table+' is not exist');
		}
	}
	function add(db,table,data,callback){
		if(!db)return;
		var request=window.indexedDB.open(db);
		request.onsuccess = function(event) {
			db = event.target.result;
			var transaction = db.transaction(table, 'readwrite');  
			var objectStore = transaction.objectStore(table); 
			var subReq={};
			for(var x in data) try{subReq=objectStore.add(data[x]);}catch(e){};
			subReq.onsuccess = function (e) {
				callback&&callback();
				console.log(subReq.result);
				db.close();
			};
		}
		request.onupgradeneeded =function(event){
			console.log(table+' is not exist');
		}
	}
	
	function del(db,table,key,callback){
		var request=window.indexedDB.open(db);
		request.onsuccess = function(event) {
			db = event.target.result;
			var transaction = db.transaction(table, 'readwrite');
			var objectStore = transaction.objectStore(table);
			var subReq={};
			try{subReq=objectStore.delete(key);}catch(e){};
			subReq.onsuccess = function (e) {
				callback&&callback();
				console.log(subReq.result);
				db.close();
			};
		}
		request.onupgradeneeded =function(event){console.log(table+' is not exist');}
	}
	
		
})(window)
