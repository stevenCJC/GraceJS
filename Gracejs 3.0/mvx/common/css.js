define(['g','_/is','ui/ui','ui/cud'], function (g) {
	
	var css={
		__blacklist__:['_cssInit'],
		_cssInit:function(){
			if(this.Css){
				if(g.is.array(this.Css)) 
					for (var i=0,l=this.Css.length;i<l;i++)
						this.loadCss(this.Css[i]);
				else this.loadCss(this.Css);
			}
		},
		
		loadCss:function(path){
			var id=path.replace(/\W/ig,'');
			if(!g.q('[_="'+id+'"]').length)
				g.q('head').append('<link rel="stylesheet" _id="'+id+'" type="text/css" href="'+path+'">')
		},
		
	};
	
	
	
	return css;
});