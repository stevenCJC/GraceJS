(function(window){
	if(typeof window.openDatabase === 'undefined')return;
	
	var DBs={};
	window.DB=function(dbName,tbName,maxSize){
		return new Sqlite(dbName,tbName,maxSize);
	}
	function Sqlite(dbName,tbName,maxSize){
		this.db=DBs[dbName]?DBs[dbName]:openDatabase(dbName, '1.0', '', (maxSize||65536));
		if(this.db)DBs[dbName]=this.db;
		if(tbName) return new Table(DBs[dbName],tbName);
		return this;
	}
	
	
	Sqlite.prototype={
		constructor:Sqlite,
		
		insert:function(table, fields,success,error){
			insert(this.db,table,fields,success,error);
		},
		update:function(table, fields,condition,success,error){
			update(this.db,table, fields,condition,success,error);
		},
		select:function(table, fields,condition,options,success,error){
			select(this.db,table, fields,condition,options,success,error);
		},
		delete:function(table, condition,success,error){
			del(this.db,table, condition,success,error);
		},
		
		count:function(table, condition,options,success,error){
			count(this.db,table, condition,options,success,error)
		},
		scalar:function(table, field,condition,options,success,error){
			scalar(this.db,table, field,condition,options,success,error);
		},
		dropTable:function(table,success,error){
			dropTable(this.db,table,success,error);
		},
		
		createTable:function(table,cols,success,error){
			createTable(this.db,table,cols,success,error);
		},
		
		renameTable:function(table,newName,success,error){
			renameTable(this,table,newName,success,error);
		},
		
		addFields:function(table,fields,success,error){
			addFields(this.db,table,fields,success,error);
		},

		exec:function(query, success,error){
			execute(this.db,query, null, success,error);
		},
		
		table:function(tbName){
			return new Table(DBs[dbName],tbName);
		},
		
		close:function(){},
		drop:function(){},
	}
	
	function Table(db,tbName){
		this.db=db;
		this.table=tbName;
		
	}
	
	Table.prototype={
		constructor:Table,
		
		insert:function(fields,success,error){
			insert(this.db,this.table,fields,success,error);
		},
		update:function(fields,condition,success,error){
			update(this.db,this.table, fields,condition,success,error);
		},
		select:function(fields,condition,options,success,error){
			select(this.db,this.table, fields,condition,options,success,error);
		},
		delete:function(condition,success,error){
			del(this.db,this.table, condition,success,error);
		},
		
		count:function(condition,success,error){
			count(this.db,this.table, condition,success,error);
		},
		scalar:function(field,conditions,options,success,error){
			scalar(this.db,this.table,field,conditions,options,success,error);
		},
		
		dropTable:function(success,error){
			dropTable(this.db,this.table,success,error);
		},
		
		renameTable:function(newName,success,error){
			renameTable(this,this.table,newName,success,error);
		},
		
		addFields:function(fields,success,error){
			addFields(this.db,this.table,fields,success,error);
		},
		
		
		exec:function(query, success,error){
			execute(this.db,query, null, success,error);
		},
	}
	
	
	function DataSet(results){
		this.length=results.rows.length;
		var i=0,x;
		while(i<results.rows.length){
			x=results.rows.item(i)
			this[i]=results.rows.item(i);
			i++;
		}
	}
	DataSet.prototype={
		constructor:DataSet,
		each:function(func){
			var i=0,x;
			while(x=this[i]){
				func(this[i]);
				i++;
			}
			return this;
		},
	}
	
	
	
	
	function createTable(db,table,fields,success,error){
		var sql = createTableSQL(table, fields);
		execute(db,sql, null, succ, err);
		function succ(){
			success&&success();
		}
		function err(t,e){
			error&&error(e,sql);
		}
	}
	function dropTable(db,table,success,error) {
		var sql = dropTableSQL(table);
		execute(db,sql, null, succ, err);
		///execute(db,'alter table pp', null, succ, err);
		function succ(){
			success&&success();
		}
		function err(t,e){
			error&&error(e,sql);
		}
	}
	function renameTable(dbo,table,newName,success,error){
		var sql = renameTableSQL(table, newName);
		execute(dbo.db,sql, null, succ, err);
		function succ(){
			if(dbo.constructor==Table) dbo.table=newName;
			success&&success();
		}
		function err(t,e){
			error&&error(e,sql);
		}
	}
	function addFields(db,table,fields,success,error){
		var length=fields.length;
		var sql = addFieldsSQL(table, fields);
		var i=0;
		while(i<length){
			execute(db,sql[i], null, succ, err);
			i++;
		}
		function succ(){
			success&&success();
		}
		function err(t,e){
			error&&error(e,sql);
		}
	}

	
	function insert(db,table,fields,success,error){
		var sql =insertSQL(table, fields);
		execute(db,sql[0], sql[1], succ, err);
		function succ(t,results){
			success&&success(results.insertId,results.rowsAffected);
		}
		function err(t,e){
			error&&error(e,sql[0],sql[1].join(','));
		}
	}
	function update(db,table,fields,conditions,success,error){
		var sql =updateSQL(table, fields,conditions);
		execute(db,sql[0], sql[1], succ, error);
		function succ(t,results){
			success&&success(results.rowsAffected);
		}
		function err(t,e){
			error&&error(e,sql[0],sql[1].join(','));
		}
	}
	function select(db,table,fields,conditions,options,success,error){
		var sql =selectSQL(table, fields, conditions, options);
		execute(db,sql[0], sql[1], succ, error);
		function succ(t,results){
			success&&success(new DataSet(results));
		}
		function err(t,e){
			error&&error(e,sql[0],sql[1].join(','));
		}
	}
	function del(db,table,condition,success,error){
		var sql =delSQL(table, condition);
		execute(db,sql[0], sql[1], succ, error);
		function succ(t,results){
			success&&success(results.rowsAffected);
		}
		function err(t,e){
			error&&error(e,sql[0],sql[1].join(','));
		}
	}
	function scalar(db,table,field,conditions,options,success,error){
		var sql =selectSQL(table, field, conditions, options);
		execute(db,sql[0], sql[1], succ, error);
		function succ(t,results){
			if(results.rows.length>0){
				if(field.constructor==Array)field=field[0];
				success&&success(results.rows.item(0)[field]);
			}
		}
		function err(t,e){
			error&&error(e,sql[0],sql[1].join(','));
		}
	}
	function count(db,table,conditions,options,success,error){
		var sql =selectSQL(table, 'Count(*) as c', conditions, options);
		execute(db,sql[0], sql[1], succ, error);
		function succ(t,results){
			if(results.rows.length>0){
				success&&success(results.rows.item(0)['c']);
			}
		}
		function err(t,e){
			error&&error(e,sql[0],sql[1].join(','));
		}
	}
	
	
	
	
	function createTableSQL(name, cols) {
		var query = "CREATE TABLE IF NOT EXISTS " + name + "(" + cols + ");";
		return query;
	}

	function dropTableSQL(name) {
		var query = "DROP TABLE " + name + ";";
		return query;
	}
	function renameTableSQL(name, newName) {
		var query = "ALTER TABLE "+name+" RENAME TO "+newName+";";
		return query;
	}
	function addFieldsSQL(name, fields) {
		var query=[];
		var field;
		if(fields.constructor==String) fields=[fields];
		while(field=fields.pop())
			query.push("ALTER TABLE "+name+" ADD COLUMN "+field+";");
		return query;
	}
	
	
	
	function insertSQL(table, map) {
		var query = "INSERT INTO " + table + " (#k#) VALUES(#v#);", 
		keys = [], 
		holders = [], 
		values = [],
		x;
		for (x in map) map.hasOwnProperty(x) && (keys.push(x), holders.push("?"), values.push(map[x]));
		query = query.replace("#k#", keys.join(","));
		query = query.replace("#v#", holders.join(","));
		return [ query, values ];
	}
	
	function updateSQL(table, map, conditions) {
		var query = "UPDATE " + table + " SET #k##m#", keys = [], values = [], x;
		for (x in map) map.hasOwnProperty(x) && (keys.push(x + "=?"), values.push(map[x]));
		return conditions = buildConditions(conditions), values = values.concat(conditions[1]), query = query.replace("#k#", keys.join(",")), query = query.replace("#m#", conditions[0]), [ query, values ];
	}
	
	function selectSQL(table, columns, conditions, options) {
		var query = "SELECT #col# FROM " + table + "#cond#", values = [];
		return typeof columns == "undefined" ? columns = "*" : typeof columns == "object" && columns.join(","), conditions = buildConditions(conditions), values = values.concat(conditions[1]), query = query.replace("#col#", columns), query = query.replace("#cond#", conditions[0]), options && (options.limit && (query += " LIMIT ?", values.push(options.limit)), options.order && (query += " ORDER BY ?", values.push(options.order)), options.offset && (query += " OFFSET ?", values.push(options.offset))), query += ";", [ query, values ];
	}
	
	function delSQL(table, conditions) {
		var query = "DELETE FROM " + table + "#c#;";
		return conditions = buildConditions(conditions), query = query.replace("#c#", conditions[0]), [ query, conditions[1] ];
	}
	
	
	
	
	
	function execute(db,query, values, success, err) {
		values = values || [];
		if (!query || query === '') {
			return;
		}
		db.transaction(function (transaction) {
			transaction.executeSql(query, values, success, err);
		});
	}
	function buildConditions(conditions) {
		var results = [], values = [], x;
		if (typeof conditions === 'string') {
			results.push(conditions);
		} else if (typeof conditions === 'number') {
			results.push("id=?");
			values.push(conditions);
		} else if (typeof conditions === 'object') {
			for (x in conditions) {
				if (conditions.hasOwnProperty(x)) {
					if (!isNaN(x)) {
						results.push(conditions[x]);
					} else {
						results.push(x + '=?');
						values.push(conditions[x]);
					}
				}
			}
		}
		
		if (results.length > 0) {
			results = " WHERE " + results.join(' AND ');
		} else {
			results = '';
		}
	
		return [results, values];
	}
	
})(window)
