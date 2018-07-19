;(function() {
"use strict";

exSVG.RampNode = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
        init: function(data){
			var me = this;
			exSVG.Node.prototype.init.apply(me, arguments);
			me.addClass('exRamp');
			
			me.on('menu', me.onMenu, me);
			me.back();
			
			return me;
        },
		
		paint: function(){			
			var me = this;
			
			if(!me.mGfx)
				return;
						
			me.drawBody();
			me.drawPins();
			me.drawBody();
			me.drawHandlers();
		},
		
		drawBody: function(){
			var me = this
			, box = me.rbox();
			
			if(!me.mGfx.body){
				me.mGfx.body = me.rect(150, 10)
					.fill({opacity: 0.5, color: '#000'})
					.radius(7)
					.opacity(0.7)
			}
			me.mGfx.body.height(1);
			me.mGfx.body.height(box.height + 3).back();
		},
		
		drawHandlers: function(){
			var me = this;
			
			if(!me.mGfx.rhandler){
				me.mGfx.rhandler = me.rect(5, 10)
					.dmove(me.mGfx.body.width()-5, 0)
					.opacity(0)
					.style({'pointer-events': 'all'})
					.addClass('handler')
					.on('mousedown', function(e){
						e.stopPropagation();
					}).draggable(function(x, y){
						return {x: Math.max(x, 150), y:0};
					}).on('dragmove', function(e){
						me.width(this.x());
					});
			}
			me.mGfx.rhandler.height(me.mGfx.body.height());
		},
		
		width: function(width){
			var me = this
			, ret = SVG.G.prototype.width.apply(me, arguments);
			
			if(width){
				me.mGfx.body.width(width);
				me.mOutputPinGroup.move(me.mGfx.body.width()-20, 0);
				me.mGfx.rhandler.x(width);
				me.fire('resize');
			}
			return ret;
		},
		
		drawPins: function(){
			var me = this
			, offset = 8;
			
			me.select('.exPin.input').each(function(){
				this.move(0, offset);
				offset += 18;
			});

			me.mInputPinGroup.move(6,0).front();
			me.mOutputPinGroup.move(me.mGfx.body.width()-20, 0).front();
			
			offset = 8;
			me.select('.exPin.output').each(function(){
				this.move(0, offset);
				offset += 18;
			});
			
		},
		
		drawLink: function(input, output){
			var me = this;
			
			console.assert(input instanceof exSVG.Pin);
			console.assert(output instanceof exSVG.Pin);
			
			var link = me.parent(exSVG.Worksheet).createLink(input, output, exSVG.RampLink);
			return;
			
			var link = new exSVG.RampLink();
			link.init(input);
			input.startLink(link);
			output.endlink(link);
			link.before(me);
		},
		
		importInput: function(data){
			var me = this
			, a = 0
			, input
			, output
			
			input = exSVG.Node.prototype.importInput.apply(me, arguments);
			console.assert(input instanceof exSVG.Pin);
			input.setMaxLink(2);

			var o = new exGRAPH.Output();
			o.init('o_' + data.Id(), 'core.wildcards', data.Label()).Ctor('RampPin');
			output = me.importOutput(o);
			console.assert(output instanceof exSVG.Pin);
			output.setMaxLink(2);
			me.drawLink(input, output);
			return input;
		},
		
		onMenu: function(e){
			var me = this
			, menu = e.detail.menu;
			
			menu.sep();
			menu.addTitleItem('Tracks');
			menu.addItem('Add new Track', 'track_add', function(){
				//this.remove();
			});
		},
		
		addTrack: function(){
			var me = this;
		}
	}
});


exSVG.RampPin = SVG.invent({
    create: 'g', 
    inherit: exSVG.PinWildcards,
	
    extend: {
		init: function(){
			var me = this;
            exSVG.Pin.prototype.init.apply(me, arguments);
			
			me.on('menu', me.onMenu, me);
			
            return me;
        },
		
		onMenu: function(e){
			var me = this
			, menu = e.detail.menu;
			
			menu.sep();
			menu.addTitleItem('Track');
			menu.addItem('Rename Track', 'track_rename', function(){
				//this.remove();
			});
			
			menu.addItem('Remove Track', 'track_remove', function(){
				//this.remove();
			});
			
			var move = menu.addSubMenu('Move Track...');
			move.addItem('Up', 'track_moveup', function(){
				//this.remove();
			});
			
			move.addItem('Down', 'track_movedown', function(){
				//this.remove();
			});
			
			move.addItem('Top', 'track_movetop', function(){
				//this.remove();
			});

			move.addItem('Bottom', 'track_movebottom', function(){
				//this.remove();
			});
			
			menu.addItem('New Track', 'track_new', function(){
				//this.remove();
			});
			
		}
	}
});


exSVG.RampLink = SVG.invent({
    inherit: exSVG.Link,
	create: 'path',
	
    extend: {
		init: function(){
			var me = this;
            exSVG.Link.prototype.init.apply(me, arguments);
			me.style({'pointer-events': 'all'});
			
			me.on('mouseenter', me.focus, me, {capture: true});
			//console.log('zz');
			
            return me;
        },
		
		focus: function(){
			console.log('coucou');
		}
	}
});


}).call(this);