define(['dom/core'], function (g) {

	g.ui.extend({

		ready: function(callback) {
			if (document.readyState === "complete" || document.readyState === "loaded"||document.readyState==="interactive") 
				callback();
			else
				document.addEventListener("DOMContentLoaded", callback, false);
			return this;
		},
		
		is:function(selector){
			return !!selector&&this.filter(selector).length>0;
		},
		
		

	});
	return $;
});
