;(function() {
"use strict";

var nodeMinwidth = 100;

exSVG.plugin(exSVG.Node, {
	
	init: function(data){
		var me = this;		
		
		me.mGfx = {};
		me.mExpand = false;
		me.mColor = new SVG.Color(me.data('color'));
		me.paint();
		
		me.on('destroy', me.destroyGfx, me);
	},
	
	expandPins: function(){
		var me = this;
		
		me.mExpand = (me.mExpand) ? false : true;
		me.paint();
	},
	
	getCenter: function(){
		var me = this
		, box = this.mGfx.body.rbox();
		box.x += box.width/2;
		box.y += box.height/2;
		var ret = me.parent(exSVG.Worksheet).point(box);
		console.log(ret);
		return ret;
	},

	paint: function(){
		//console.log('exSVG.Node.paint()');
		var me = this;

		// Hide optional pins if node is not expanded
		me.select('.exPin[data-optional="true"]').each(function(){
			if(!me.mExpand && this.getLinks().length() == 0)
				this.hide();
			else
				this.show();
		});
		
		me.drawHeader();
		me.drawPins();
		me.drawShape();
		me.drawExpand();
		me.fire('resize');
		return this;
	},

	drawShape: function(){
		var me = this
		, box
		, filter;
		
		if(!me.mGfx.body){
			var grad = SVG.getDef('exBgGradient', me, function(){
				return me.gradient('linear', function(stop) {
					stop.at({offset:0, color:'#000', opacity:0.8});
					stop.at({offset:1, color:'#111', opacity:0.5});
				}).from(0,0).to(0,1);;
			});

			me.mGfx.body = me.rect(1, 1)
				.fill(grad)
				.radius(10)
				.back();
			
			me.mGfx.body.filter(function(add) {
				var blur = add.offset(3, 3)
					.in(add.sourceAlpha)
					.gaussianBlur(3);

				add.blend('SourceGraphic', blur);
				this.size(2,2)//.move(-0.5,-0.5)
			})

			me.mGfx.body.back();				
		}

		if(me.mGfx.expand)
			me.mGfx.expand.hide();
		
		me.mGfx.body.size(1, 1);
		box = me.bbox();
		
		me.mGfx.body.size(Math.max(box.w+1, nodeMinwidth), box.h + 8);

		if(me.mGfx.expand)
			me.mGfx.expand.show();
		
		return me;
	},
	
	drawHeader: function(){
		var me = this
		, color = me.mColor
		, offset = 32
		, tBox
		, inpBox
		, outBox
		, width
		
		if(!me.mGfx.header){
			var grad = SVG.getDef('nodeHeader' + color.toHex().replace('#', '_'), me, function(){
				return me.gradient('linear', function(stop) {
					stop.at(0, color.darker(0.1));
					stop.at(0.02, color);
					stop.at(0.3, color.darker(0.45));
					stop.at(0.7, color.darker(0.4));
					stop.at(0.95, color.darker(0.8));
					stop.at(1, color.darker(0.8));
				}).from(0,0).to(1,0.4);
			});				

			me.mGfx.header = me.path()
				.fill(grad)
				.stroke('none')

			if(me.getData('symbol')){
				me.image(me.getData('symbol')).move(10,4)
				.on('mousemove', function(e){
					if(!me.getData('tooltip'))
						return;
					me.parent(exSVG.Worksheet).showTooltip(e, me.getData('id') + '<br /><br />' + me.getData('tooltip'), 10);
					e.stopPropagation();
					e.stopImmediatePropagation();
				})
				.on('mouseleave', function(){
					me.parent(exSVG.Worksheet).hideTooltip();
				});
			}
			me.on('data-change.nodegfx', function(e){
				if(e.detail.name == 'title')
					me.paint();
			});
		}

		if(!me.mGfx.title){
			me.mGfx.title = me.plain(me.getData('title'))
				.fill('#fff')
				.translate(offset, 17)
				.font({size:12})
				.stroke({width:0})
		}
		me.mGfx.title.plain(me.getData('title'));
		
		if(!me.mGfx.subtitle && me.getData('subtitle')){
			me.mGfx.subtitle = me.plain(me.getData('subtitle'))
				.fill('#bbb')
				.translate(offset, 35)
				.font({size:13, 'font-style': 'italic'})
				.stroke({width:0})
			if(me.mGfx.subtitle.bbox().w + offset + 15 > width)
				width = me.mGfx.subtitle.bbox().w + 15 + offset;
		}

		tBox = me.mGfx.title.bbox();

		if(me.mGfx.subtitle)
			width = Math.max(tBox.w, me.mGfx.subtitle.bbox().w + offset, nodeMinwidth);
		else
			width = Math.max(tBox.w + offset, nodeMinwidth);
		
		inpBox = me.mInputPinGroup.bbox();
		outBox = me.mOutputPinGroup.bbox();
		width = Math.max(inpBox.w + outBox.w , width);

		if(me.getData('subtitle'))
			me.mGfx.header.plot('m1.5,11.5c0,-5 5,-10 10,-10l' + (width) + ',0c5,0 10,5 10,10l0,30l-' + (width+20) + ',0l0,-30z')
			.move(1,1)
		else
			me.mGfx.header.plot('m1.5,11.5c0,-5 5,-10 10,-10l' + (width) + ',0c5,0 10,5 10,10l0,13l-' + (width+20) + ',0l0,-13z')
			.move(1,1)

		return me;
	},
	
	drawPins: function(startpos){
		var me = this
		, optionals = []
		, offset = 0

		if(me.mGfx.header){
			me.mInputPinGroup.move(10, me.mGfx.header.bbox().height + 15);
			me.mOutputPinGroup.move(0, me.mGfx.header.bbox().height + 15);
		}
		
		// place visibles input pins
		me.select('.exPin.input').each(function(){
			if(!this.visible())
				return;
			this.move(0, offset);
			offset += this.bbox().height+6;
		});

		
		// place hidden input pins
		me.select('.exPin.input').each(function(){
			if(this.visible())
				return;
			this.move(0, offset);
			offset += this.bbox().height+6;
		});

		
		offset = 0;
		// place visibles output pins
		me.select('.exPin.output').each(function(){
			if(!this.visible())
				return;
			this.move(0, offset);
			offset += this.bbox().height+4;
		});

		// place hidden output pins
		me.select('.exPin.output').each(function(){
			if(this.visible())
				return;
			this.move(0, offset);
			offset += this.bbox().height+4;
		});
		if(me.mGfx.header)
			me.mOutputPinGroup.move(me.mGfx.header.bbox().w-21);
		
		return me;
	},
	
	drawExpand: function(){
		var me = this
		, bodyBox;

		if(me.select('.exPin[data-optional="true"]').length() == 0)
			return;
		
		
		if(!me.mGfx.expand){
			//me.height(me.height() + 12);
			me.mGfx.expand = me.group()
				.addClass('expand')
				.x(4)
			
			me.mGfx.expand.rect(15, 16)
				.radius(7)
				.on('mousedown', function(e){
					e.stopPropagation();
					e.stopImmediatePropagation();
				})
				.on('click', function(e){
					me.mExpand = (me.mExpand) ? false : true;
					me.paint();
					e.stopPropagation();
					e.stopImmediatePropagation();
				});
				
			me.mGfx.expand.polygon('')
		}
		
		me.mGfx.body.height(me.mGfx.body.height() + 12);
		bodyBox = me.mGfx.body.bbox();

		me.mGfx.expand.select('rect').width(bodyBox.w - 8);			
		me.mGfx.expand.y(bodyBox.h - 18);

		me.mGfx.expand.select('polygon').each(function(){
			if(me.mExpand)
				this.plot('0,8 16,8 8,0');
			else
				this.plot('0,0 16,0 8,8');
			
			this.move((bodyBox.w / 2) - 8, 4);
		});

		return me;
	},
	
	destroyGfx: function(){
		return;
		this.select(':scope > *').each(function(){
			if(this.destroy)
				this.destroy();
			this.off();
		});
	}
});


}).call(this);