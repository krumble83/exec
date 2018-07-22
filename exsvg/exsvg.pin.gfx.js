;(function() {
"use strict";

exSVG.plugin(exSVG.Pin, {
	
	init: function(data){
		var me = this;		
		me.mGfx = me.mGfx || {};
		
		me.on('mousemove.pingfx', function(e){
			if(e.buttons === 1)
				return;

			// If no mouse button is pressed, display a tooltip when the mouse cursor is over the pin
			me.parent(exSVG.Worksheet).showTooltip(e, me.mTooltip);
		});
		
		me.on('mouseleave.pingfx', function(e){
			me.parent(exSVG.Worksheet).hideTooltip();
		});
		
		me.on('data-change', function(e){
			if(e.detail.name === 'type') {
				var t = exLIB.getDataType2(me.getDataType());
				me.setColor(t.Color());
				me.updateTooltip();
			}
			me.paint();
		});
		
		me.on('destroy', me.destroyGfx, me);
						
		me.updateTooltip();
		me.paint();
		return me;
	},
		
	setColor: function(color){
		//console.log('Pin.setColor()', color);
		var me = this;
		if(typeof color === 'string')
			me.mColor = new SVG.Color(color);
		else if(color instanceof SVG.Color)
			me.mColor = color;
		me.fire('data-change', {name: 'color', value: color});
		return me;
	},
	
	getColor: function(){
		var me = this;
		return this.mColor || '#f00';
	},
	
	getCenter: function(){
		var me = this
			,ret = me.parent(exSVG.Worksheet).point(this.mGfx.pin.rbox());

		ret.x += 5;
		ret.y += 5;
		return ret;
	},
		
	updateTooltip: function(){
		var me = this
			, dataType = exLIB.getDataType2(me.getDataType())
			, text = me.getTooltip() || dataType.Tooltip() || ''
			, type = exLIB.isArrayDataType(me.getDataType()) ? 'Array of ' + dataType.Label() : dataType.Label();

		me.mTooltip = '<span>' + me.getId() + '</span><span>' + type + '</span><span>' + text + '</span>';
		return me;
	},

	paint: function(){
		//console.log('exSVG.Pin.paint()');
		var lbox
			, pbox
			, me = this;
				
		if(me.isArrayDataType())
			pbox = me.drawPinArray();
		else
			pbox = me.drawPin();
		
		me.drawLabel(20, pbox.cy+4, me.getData('label') || ((me.getId()) ? me.getId().capitalize(true).split(/(?=[A-Z])/).join(" ") : false) || '');
		me.drawBackground();
		me.drawEditor();		
		me.fire('paint');
		return me;
	},
	
	drawEditor: function(){
		var me = this
			, dataType = exLIB.getDataType2(me.getDataType())
			, labelbox = (me.mGfx.label) ? me.mGfx.label.bbox() : {x: 0, y:0};
		
		if(me.getType() === exSVG.Pin.PIN_OUT || exLIB.isArrayDataType(me.getDataType()) || !dataType.Editor().Name()){
			if(me.mGfx.editor){
				me.mGfx.editor.destroy();
				me.mGfx.editor = null;
			}
			return;
		}
		
		if(!me.mGfx.editor){
			if(exSVG['PinEditor' + dataType.Editor().Name().capitalize()]){
				me.mGfx.editor = new exSVG['PinEditor' + dataType.Editor().Name().capitalize()];
				me.add(me.mGfx.editor);
				me.mGfx.editor.init().move(labelbox.x + labelbox.w + 25, -5).draw();
			}
			else{
				console.log("can't find editor " + 'PinEditor' + dataType.Editor().Name().capitalize());
				return;
			}
		}
		me.mGfx.editor.draw();
		return me;
	},
	
	drawBackground: function(x, y, w, h){
		var me = this
			, grad
			, color = me.getColor();
		
		if(!me.mGfx.bg){
			grad = SVG.getDef('pinFocus' + color.toHex().replace('#', '_'), me, function(){
				return me.gradient('linear', function(stop) {
					stop.at({ offset: 0.1, color: color, opacity: 0.01 });
					stop.at({ offset: 0.3, color: color, opacity: 0.4 });
					stop.at({ offset: 1, color: color, opacity: 0.01 });
				});
			});

			me.mGfx.bg = me.rect(w || me.bbox().w+18, h || me.bbox().h+6)
				.translate(-10, (y || 0) - 5)
				.fill(grad)
			me.fire('resize');
			
			me.on('data-change', function(e){
				if(e.detail.name !== 'color')
					return;
				color = me.getColor();
				grad = SVG.getDef('pinFocus' + color.toHex().replace('#', '_'), me, function(){
					return me.gradient('linear', function(stop) {
						stop.at({ offset: 0.1, color: color, opacity: 0.01 });
						stop.at({ offset: 0.3, color: color, opacity: 0.4 });
						stop.at({ offset: 1, color: color, opacity: 0.01 });
					});
				});
				me.mGfx.bg.fill(grad);
			});
		}
		if(me.mGfx.label)
			me.mGfx.bg.width(me.mGfx.label.bbox().w+36);
		else
			me.mGfx.bg.width(me.mGfx.pin.bbox().w+20);
		
		if(me.getType() === exSVG.Pin.PIN_OUT && me.mGfx.label){
			me.mGfx.bg.x(-(me.mGfx.label.bbox().w+5));
		}
		me.mGfx.bg.back();
		return me;
	},
	
	drawPin: function(x, y, size){
		//console.log('exscgpin.drawPin', this);
		var me = this
			, box
			, color = color || me.getColor();
		
		if(!me.mGfx.pin) {
			me.mGfx.pin = me.circle(size || 10)
				.translate(x || 0, y || 0)
				.fill(color)
				.stroke({color: color})
				.addClass('pin');

			box = me.mGfx.pin.bbox();
				
			me.mGfx.line = me.line((x || box.cx) + 7, (y || box.cy), (x || box.cx) + 7, y || box.cy)
				.stroke({color: color, width: 5})
				.attr('stroke-linecap', 'round')
				.attr('pointer-events', 'none');
			me.fire('resize');
		}
		me.mGfx.pin.stroke({color: color})
			.fill(color || color);
		me.mGfx.line.stroke({color: color});

		return me.mGfx.pin.bbox();
	},
	
	drawPinArray: function(x, y, color, size){
		var me = this;

		color = color || me.getColor();
		
		if(!me.mGfx.pin) {
			me.addClass('exPinArray');
			me.mGfx.pin = me.rect(11, 10)
				.translate(x || 0, y || 0)
				.style('pointer-events', 'none')
				.addClass('pin')
		}

		me.mGfx.pin.stroke({width:4, color: color || color});
		var pat = SVG.getDef('pinArrayPattern' + color.toHex().replace('#','-'), me, function(){
			return me.pattern(11, 10, function(add) {
				add.rect(5,4).move(3,3).fill(color);
			}).attr('patternUnits', 'userSpaceOnUse');
		});
		me.mGfx.pin.fill(pat);
		return me.mGfx.pin.bbox();
	},
	
	drawLabel: function(x, y, text){
		var me = this;
		if(!me.mGfx.label){
			me.mGfx.label = me.plain(text)
				.translate(x || 0, y || 0)
				.stroke('none')
				.addClass('label');
		}
		me.mGfx.label.plain(text);
		if(me.getType() === exSVG.Pin.PIN_OUT){
			me.mGfx.label.x(-(me.mGfx.label.bbox().width + 27));
		}
		return me;
	},
	
	destroyGfx: function(){
		
	}
	
});
	


}).call(this);