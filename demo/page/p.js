define(['grace', 'jquery', 'utils/chzn'], function (G, $) {
	G.Page('header',
		function () {
		this.PLObj = {}; //私有不公开的属性
		this.id = 'DD';
		//this.init();
	}, {
		Dataset : {
			'P:{id}': {
				Count : 0,
			},
			header:{
				open:true
			},
		},
		Subscribe : {
			'P:PLinit{id}' : 'action',
			'init' : function (m) {
				$('#' + this.id).html($('#' + this.id).html() + m);
			},
		},
		Util : {
			'util:PL' : function (el, p) {},
		},
		Event : {
			'click body@#{id}' : 'clickThis',
		},
		OnInit : {
			'#{id}' : '_init',
		},
		Onload : function () {},
	}, {
		loadPage : function (s, options) {},
		_init : function (el, ds) {
			var d = this.DS('header/' + this.id);
			d.on('Count', 'update', function (e) {
				console.log(e);
			})
			G.DS.on('header/', 'update', function (e) {
				console.log(e);
			})
			if (!el.length)
				this.$('body').append('<br/><a id="' + this.id + '" href="#PLinit' + this.id + ':' + this.id + '/init:OOOOOO?????">' + this.id + '</a><br/><a id="' + this.id + '" href="#PLinit' + this.id + ':' + this.id + '/init:OOOOOO?????">' + this.id + '</a>');
		},
		clickThis : function (el, e, ds) {
			this.publish('PLinit' + this.id, this.id);
		},
		action : function (m) {
			var d = this.DS('header/' + this.id);
			var c = parseInt(d.get('Count'));
			//d.set('Count',c+1);
			G.DS.set('header/' + this.id + '/', {
				Count : c + 1
			})
			this.$('#' + m).chznText(c + 1);
		}

	});

});
