define(['function/JSONClone'],
function (JSONClone) {


    //负责控制台输出的表现
    function Console(a) {
        var root = {
            name: '_ROOT_',
            parent: null,
            hasErr:false,
            block: [],
            childnode: []
        };
        this.count = 0;
        this._blocks = {'_ROOT_':root};
        this._block = '_ROOT_';
		this.filter='Text Begin.Text Begin.';
    }


    Console.prototype = {

        constructor: Console,

        block: function (name) {
            this.count++;
            var id = (new Date()).getTime();
			var node = {
				name: name,
				parent: this._block,
				hasErr:false,
				block: [],
				childnode: []
			};
			
			this.push(id);
			
			this._blocks[this._block].childnode.push(id);
			this._blocks[id] = node;
            this._block = id;
        },
        blockEnd: function () {
            this.count--;
            this._block = this._blocks[this._block].parent||'_ROOT_';
            if (!this.count) {
                this.refresh();
            }
        },

        push: function (line) {
            console.log(line);
			var block = this._blocks[this._block].block;
			
			if(line.constructor==Number){
				block.push(line);
			}else{
				block.push(JSONClone(line));
				if (!line.assert) {
					var parent = this._block;
					this._blocks[parent].hasErr = true;
					while (parent = this._blocks[parent].parent)
						this._blocks[parent].hasErr = true;
				}
			}
        },

        flush: function () {
            flush.call(this,'_ROOT_');
        },

        refresh: function () {
            this.clear();
            this.flush();
        },
		
		
        clear: function () {
            console.clear();
        },


    };
   


    function flush(node) {
        var block, childnode, i;

        block=this._blocks[node].block;
        childnode = this._blocks[node].childnode;
		
		//console.log(this._blocks[node])
		
        if (node !== '_ROOT_') {
            if (this._blocks[node].hasErr) console.group('%c' + this._blocks[node].name + '                                     ', 'color:#fff;font-family:"微软雅黑"; font-weight:normal; background-color:red;');
            else console.groupCollapsed('%c' + this._blocks[node].name, ' color:#fff; font-family:"微软雅黑"; font-weight:normal; background-color:green; ');
        }

        for (i = 0; i < block.length; i++) {
			if(block[i].constructor!=Number){
				paint.call(this,block[i], this._blocks[node].hasErr);
			}else{
				flush.call(this,block[i]);
			}
		}
		//for (i = 0; i < childnode.length; i++) flush.call(this,childnode[i]);
		
        if (node !== '_ROOT_') {
            console.groupEnd();
        }
        
    }

    function paint(line, hasErr) {
        if (!line.assert) {
            console.group('%c' + line.msg + '                                                 ',
                'color:red;   font-family:"微软雅黑"; font-weight:normal;');
            if (typeof line.ex !== 'undefined') console.info(line.ex);
            if (typeof line.ac !== 'undefined') console.warn(line.ac);
            if (typeof line.data !== 'undefined') console.warn(line.data);
            console.groupEnd();
        } else {
            /*if(hasErr) console.group('%c'+line.msg,'color:#666; font-family:"微软雅黑";');
			else */console.groupCollapsed('%c' + line.msg + '                                                 ',
                'color:green;   font-family:"微软雅黑"; font-weight:normal;');
            if (typeof line.ex !== 'undefined') console.info(line.ex);
            if (typeof line.ac !== 'undefined') console.info(line.ac);
            if (typeof line.data !== 'undefined') console.info(line.data);
            console.groupEnd();
        }
        
    }
	
	
	return Console;
    /*
    line={
	    assert:false,
        msg:'',
        ex:1,
        ac:2,
        data:{},
    
    }
    */

})