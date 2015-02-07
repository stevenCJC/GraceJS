require(['g', 'mvx/widget'], function(g) {

	var cell = g.Widget(function Cell() {
		this.name = '细胞';
	});

	var animal = g.Widget(function Animal() {}, {
		Css: 'widget.css',
		Attrs: {
			name: 'any thing',
		},
		Extend: cell,
		eat: function() {
			console.log(this.get('name'));
		},
	});

	var dog = g.Widget(function Dog(){}, {
		Attrs: {
			weight: 100,
			height: 50,
			name: 'wangwang'
		},
		Name: 'Dog',
		wang: function() {},
		eat: function() {
			console.log(this.get('name'));
		},
	});

	var cat = g.Widget(function Cat() {
		console.log(this.Attrs);
		this.miao();
		this.eat();
		this.use(dog);
	}, {
		Inherit: animal,
		Template: {
			widget: function(data) {
				return data.length
			},
			some: 'widget_.html',
		},
		Attrs: {
			weight: 60,
			height: 30,
			miao: 'miaomiao'
		},
		miao: function() {
			console.log(this.get('miao'));
		},
	});

	cat.extend({
		Attrs: {
			miao: '123123',
		}
	})

	//console.log(new animal());

	//console.log(new dog());
	console.log({
		a: cat,
		d:dog,
	});
	var c = new cat({
		a: 2,
		miao: 'sdfsdf',
		ww: {
			getter: function() {
				return this.attrs.weight / 1000;
			},
			setter: function(v) {
				this.attrs.weight = v * 1000;
			}
		}
	});
	console.log(c);
	c.on('change:ww', function(e) {
		console.log(e);
	});
	console.log(c.get('ww'));
	c.set({
		ww: 3
	});
	console.log(c.get('ww'));

	console.log(c.t_some({
		miao: c.get('ww')
	}));








































});