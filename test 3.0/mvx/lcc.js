require(['g', 'mvx/widget','dom/CUD'], function(g) {

console.time('construct');
var tee=[],ton=[],m=[],le=[],ca=[];
	for(var i=0;i<1000;i++){
		var teeth = g.Widget(function teeth(){}, {
			
			Render:function(){
				return '<div class="teeth">teeth</div>';
			},
			Init:function(){
				this.$elem.text('teeth--');
			},
			Destroy:function(){
				this.$elem.text(null);
			},
			Attrs: {
				count: 24,
				color:'white',
			},
			chew:function(){},
			
		});
		
		var tongue = g.Widget(function tongue(){}, {
			Render:function(){
				return '<div class="tongue">tongue</div>';
			},
			Init:function(){
				this.$elem.text('tongue--');
			},
			Destroy:function(){
				this.$elem.text(null);
			},
			Attrs: {
				color: 'red',
			},
			taste:function(){},
			lick:function(){},
		});
	
		var mouth = g.Widget(function mouth(){
			
			this.tee=this.use(teeth);
			this.ton=this.use(tongue);
			
		}, {
			
			Render:function(){
				var h=g.q('<div class="mouth">mouth</div>');
				h.append(this.tee.render());
				h.append(this.ton.render());
				return h;
			},
			Init:function(){
				this.$elem.prepend('<span>mouth--</span>');
			},
			Destroy:function(){
				this.$elem.find('span').remove();
			},
			
			Attrs: {
				color:'red',
			},
			eat:function(){},
			miao:function(){},
		});
		
		var leg = g.Widget(function leg(w){
			this.set('w',w);
		}, {
			Render:function(){
				return '<div class="leg">leg</div>';
			},
			Init:function(){
				this.$elem.text(this.get('w')+' leg');
			},
			Destroy:function(){
				this.$elem.text(null);
			},
			run:function(){},
			walk:function(){},
			
		});
		
		var cat = g.Widget(function Cat(name) {
			
			this.set('name',name);
			
			this.fl=this.use(leg,'front-left');
			this.fr=this.use(leg,'front-right');
			this.bl=this.use(leg,'back-left');
			this.br=this.use(leg,'back-left');
			
			this.mouth=this.use(mouth);
			
			
			
			
		}, {
			
			Attrs: {
				age: 4,
				weight: 60,
			},
			Render:function(){
				
				var c=g.q('<div class="cat">cat</div>');
				
				c.append(this.fl.render());
				c.append(this.fr.render());
				c.append(this.bl.render());
				c.append(this.br.render());
				c.append(this.mouth.render());
				
				
				
				return c;
			},
			Init:function(){
				
				g.q('body').html(this.render());
				
				this.$elem.prepend('my name is '+this.get('name'));
				
			},
			Destroy:function(){
				this.$elem.text(null);
			},
			
			catchMouse:function(){},
			
		});
	}
console.timeEnd('construct');
	
	console.log({
		a: cat,
	});
	console.time('new');
	for(var i=0;i<1000;i++)
		ca[i]=new cat('MiaoMiao');
	
console.timeEnd('new');

	console.log(ca);
	
console.time('init');
	for(var i=0;i<1000;i++)
		ca[i].init();
console.timeEnd('init');

































});