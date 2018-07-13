;(function() {
"use strict";

exSVG.RereouteNode = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
        init: function(data){
			var me = this;
			exSVG.Node.prototype.init.apply(me, arguments);
			me.addClass('exReroute');
			
			var data = {id: 'reroute', type: 'core.wildcards'};
			me.mReroutePin = new exSVG.PinReroute;
			
			me.put(me.mReroutePin);
			me.mReroutePin.init(data)
				.id(me.id() + '-' + me.mReroutePin.getId())
				.setColor('#fff')
				//.addClass('input')
				//.addClass('output')
				.paint();
			me.fire('pin-add', {pin: me.mReroutePin});
			return me;
        },
		
		replaceLink: function(link){
			var me = this;
			var inp = link.getInputPin();
			var outp = link.getOutputPin();

			console.assert(outp instanceof exSVG.Pin);
			console.assert(inp instanceof exSVG.Pin);
			
			me.mReroutePin.setDataType(link.getDataType());
			link.remove();
			
			console.log('l1');
			me.mReroutePin.addClass('output');
			var l1 = me.parent(exSVG.Worksheet).createLink(me.mReroutePin);			
			me.mReroutePin.startLink(l1);
			inp.endLink(l1);
			
			console.log('l2');
			me.mReroutePin.removeClass('output');
			me.mReroutePin.addClass('input');
			var l2 = me.parent(exSVG.Worksheet).createLink(me.mReroutePin);
			me.mReroutePin.startLink(l2);
			outp.endLink(l2);

			//me.mReroutePin.removeClass('input');
			me.mReroutePin.addClass('output');

			//var l2 = me.parent(exSVG.Worksheet).createLink(me.mReroutePin, outp);
			//console.assert(l1 instanceof exSVG.Link, 'l1 argument');
			//l1.finish(inp);
			
		},
		
		paint: function(){
			var me = this;
			me.drawBackground();
			me.drawLabel();
			me.drawShape(5, 3);
			return this;
		},
		
		drawShape: function(x, y){
			var me = this;
			if(!me.mGfx.shape){
				me.mGfx.shape = me.rect(30, 20)
					.back()
					.radius(10)
					.move(x || 0, y || 0)
					.stroke('none')
			}

		},
		
		drawBackground: function(){
			this.rect(40,25)
				.fill('none')
				.stroke('none')
				.attr('pointer-events', 'all')
		},
		
		drawLabel: function(){
			var me = this;
			me.mGfx.label = me.plain('>')
				.move(13, -10)
				.font({size: 25})
				.stroke({width: 1, color: '#fff'})
				.fill('#fff')
				.back()
				.opacity(0.5)
			
		},
		
		zgetType: function(){
			
		},
		
		loadPins: function(){}
    }
});


exSVG.PinReroute = SVG.invent({
    create: 'g', 
    inherit: exSVG.Pin,
	
    extend: {
		init: function(){
			var me = this;
            exSVG.Pin.prototype.init.apply(me, arguments);
            return me;
        },
		
		//drawLabel: function(){},
		
		drawPin: function(x, y){
			var me = this;
			var color = me.getColor();
			if(!me.mGfx.pin) {
				//console.log('aaaa', me);
				me.width(me.width() + 12);
				me.mGfx.pin = me.circle(10)
					.translate(x || 0, y || 0)
					.fill(color)
					.stroke({color: color})
					.addClass('pin');
			}
			else {
				me.mGfx.pin.stroke({color: color})
					.fill(color || color);
			}
			return me;
			
		},
		
		drawPinArray: function(x, y){
			
		},
		
		drawBackground: function(){
			var me = this;
			if(!me.mGfx.bg) {
				me.rect(20,15)
				.fill('none')
				.move(10,5)
			}
		},
		
		getCenter: function(){
			var ret = exSVG.Pin.prototype.getCenter.apply(this, arguments);
			ret.y += 2;
			return ret;
		},
		
		startLink: function(){
			var me = this;
			exSVG.Pin.prototype.startLink.apply(me, arguments);
			me.addClass('output');
			me.removeClass('input');
			return me;
		},
		
		acceptLink: function(link){
			console.log('rr');
			return 0;
		}

	}
});


SVG.extend(SVG.Path, {

	findMousePoint: function(e, resolution){
		console.warn('TODO : Reroute node link');
		var me = this;
		var doc = me.doc();
		var screenPoint = me.doc().point(e);
		var resolution = resolution || 100;
		
		var len = me.length();
		var bestMatche;
		for(var a=1; a < resolution; a++){
			var pt = me.pointAt((len/(resolution+1))*a);
			var l = pt.x - screenPoint.x;
			if(bestMatche && Math.abs(pt.x - screenPoint.x) > Math.abs(bestMatche.distance))
				return bestMatche;
			if(!bestMatche || Math.abs(pt.x - screenPoint.x) < Math.abs(bestMatche.distance))
				bestMatche = {distance: pt.x - screenPoint.x, length: (len/(resolution+1))*a, point: {x: pt.x, y: pt.y}};
		}
		return bestMatche;
	}

});


SVG.extend(SVG.Doc, SVG.Nested, {

	initRerouteNode: function() {
		var me = this;
		me.initRerouteNodeEventHandlers();
		return me;
	},
	
	initRerouteNodeEventHandlers: function(){
		var me = this;
		me.doc().on('link-add.reroutenode', function(e){
			console.log('NodeReroute:link.link-add');
			var timeout;
			var link = e.detail.link;
			var oldstroke = link.stroke();

			link.on('dblclick', function(e){
				//var ret = link.findMousePoint(e, 100);
				//me.doc().circle(10).cx(ret.point.x).cy(ret.point.y);
				me.unselectNode();
				var pt = me.getLinksLayer().point(e);
				
				link.stroke({width:3});
				me.startSequence();
				var n = me.addNode('core.reroute', pt);
				console.assert(n instanceof exSVG.RereouteNode, 'node should be instanceof `exSVG.RereouteNode` but `' + n.constructor.name + '` found');
				n.replaceLink(this);
				me.stopSequence();
				
			});
			link.on('mouseenter', function(){
				timeout = setTimeout(function(){
					link.animate(100).stroke({width: 5});
				},100);
			});
			link.on('mouseleave', function(){
				clearTimeout(timeout);
				link.animate(100).stroke({width:3});
			});
			
		});
	},
		
	createLink: function(e, pin){
		//console.log('worksheet.createLink()');
		var me = this;
		var link = new exSVG.Link;
		me.mLinks.put(link);
		link.init(pin, e);
		return link;
	},
	
	getLinksLayer: function(){
		//console.log('worksheet.getLinksLayer()');
		return this.mLinks;
	}

});

exSVG.Worksheet.prototype.plugins.nodereroute = {name: 'Reroute Node', initor: 'initRerouteNode'}


}).call(this);