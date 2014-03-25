	if (typeof String.prototype.trim !== 'function') {
		
		String.prototype.trim = function() {
			this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, '');
			return this
		};
	}