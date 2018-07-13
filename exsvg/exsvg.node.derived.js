;(function() {
"use strict";


exSVG.NodeMacro = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
		
		init: function(){
			var me = this;
			exSVG.Node.prototype.init.apply(me, arguments);
			me.addClass('exMacro');
			return me;
		},

		export: function(graph){
			var me = this
			, macro = graph.Macro().attr('svgid', me.id())
			, attrs = me.attr();

			for (var key in attrs) {
				if(!Object.prototype.hasOwnProperty.call(attrs, key) || key.substr(0,5) != 'data-')
					continue;
				macro.attr(key.substr(5), attrs[key]);
			}
			
			me.fire('export', {parent: macro});
			//return macro;
		},
		
		onz: function(){
			console.log('zz');
		}
	}
});




exSVG.NodeOp = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
		
		init: function(){
			var me = this;
			
			exSVG.Node.prototype.init.apply(me, arguments);
			me.setData('ctor', 'Nodeop');
			return me;
		},

		drawHeader: function(){
			var me = this
			, offset = me.bbox().w
			, inpBox
			, outBox
			, width;
			
			if(!me.mGfx.title){
				me.mGfx.title = me.plain(me.getData('subtitle') || me.getData('title'))
					.fill('#fff')
					.opacity(0.2)
					.font({size:36})
					.attr('font-weight', 'bolder')
					.stroke({width:0});
					
				me.mGfx.header = me.rect(1,1).opacity(0);
			}
			inpBox = me.mInputPinGroup.bbox();
			outBox = me.mOutputPinGroup.bbox();
			width = Math.max(inpBox.w + outBox.w, 150);
			me.mGfx.header.width(width);
			me.mGfx.title.move(width-me.mGfx.title.bbox().w - 15, 25);
		},
		
		drawShape: function(){
			var me = this;
			
			exSVG.Node.prototype.drawShape.apply(me, arguments);
			me.mGfx.body.height(me.mGfx.body.height() - 5);
			return me;
		}
	}
});


exSVG.NodeVarGetter = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
		
		init: function(){
			var me = this;
			
			exSVG.Node.prototype.init.apply(me, arguments);
			me.setData('ctor', 'Nodeop');
			return me;
		},
		
		setName: function(name){
			var me = this
			, pin = me.select('.exPin').first()
			
			me.data('varname', name);
			pin.setData('label', name);
			me.paint();
			return me;
		},
		
		paint: function(){
			var me = this
			, pin = me.select('.exPin')
			, box = pin.first().bbox();
			
			me.drawShape();
			pin.first().move(box.width+6, 12);
			return me;
		},
		
		drawShape: function(){
			var me = this
			, pin = me.select('.exPin')
			, color = pin.first().getColor()
			, box = pin.first().bbox()
			, grad;

			
			if(color instanceof SVG.Color == false)
				color = new SVG.Color(color);
			if(!me.mGfx.body){
				grad = me.gradient('linear', function(stop) {
					stop.at(0, color.darker(0.4), 0.3);
					stop.at(0.3, color.darker(0.6), 0.3);
					stop.at(0.7, color.darker(0.90), 0.3);
					stop.at(0.95, color.darker(0.8), 0.3);
					stop.at(1, color.darker(0.8), 0.3);
				}).from(0,0).to(1,0.4);

				me.mGfx.body = me.rect(box.width + 30,34)
					.back()
					.fill(grad)
					.radius(17)

				me.mGfx.body.filter(function(add) {
					var blur = add.offset(3, 3)
						.in(add.sourceAlpha)
						.gaussianBlur(3)
					add.blend(add.source, blur)
					this.size('200%','200%').move('-50%', '-50%')
				})
			}
			me.mGfx.body.width(box.width + 30);
		},
	}
});


exSVG.NodeVarSetter = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
		
		init: function(){
			var me = this;
			
			exSVG.Node.prototype.init.apply(me, arguments);
			me.setData('ctor', 'Nodeop');
			return me;
		},
		
		setName: function(name){
			var me = this
			, pin = me.select('.exPin.input').first();
			
			pin.setData('label', name);
			me.paint();
			return me;
		},

	}
});


exSVG.NodeEntryPoint = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
		
		init: function(){
			var me = this;
			
			exSVG.Node.prototype.init.apply(me, arguments);
			me.setData('ctor', 'NodeEntryPoint');
			return me;
		}
	}
});

}).call(this);