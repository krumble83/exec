;(function() {
"use strict";

exSVG.RereouteNode = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
        init: function(data){
			var me = this;
			
			exSVG.Node.prototype.init.apply(me, arguments);
			me.setData('title', 'Reroute Node');
			me.addClass('exReroute');
			me.getPin('out').hide();
			me.getPin('in').hide();
			return me;
        },
		
		paint: function(){
			var me = this;
			
			exSVG.Node.prototype.paint.apply(me, arguments);
			me.mInputPinGroup.move(15,10);
			me.mOutputPinGroup.move(15,10);
		},
		
		replaceLink: function(link){
			var me = this
			, inp = link.getInputPin()
			, outp = link.getOutputPin()
			, pin = me.getPin('inout')

			console.assert(outp instanceof exSVG.Pin);
			console.assert(inp instanceof exSVG.Pin);
			
			link.remove();
			pin.setDataType(outp.getDataType());
			
			me.parent(exSVG.Worksheet).createLink(inp, pin);
			me.parent(exSVG.Worksheet).createLink(outp, pin);
		},
		
		drawShape: function(x, y){
			var me = this;
			if(!me.mGfx.body){
				me.mGfx.body = me.rect(40, 30)
					.back()
					.radius(12)
					.move(x || 0, y || 0)
					.stroke('none')
					.fill('none')
					.style('pointer-events', 'all')
					
					.on('mouseenter', function(){
						this.fill('#000');
					}, me.mGfx.body, {capture:true})
					.on('mousemove', function(){
						this.fill('#000');
					}, me.mGfx.body, {capture:true})
					.on('mouseleave', function(){
						this.fill('none');
					});
					
			}
			return me;
		},
		
		drawHeader: function(){
			return this;
		}
	}
});


exSVG.PinReroute = SVG.invent({
    create: 'g', 
    inherit: exSVG.PinWildcards,
	
    extend: {
		init: function(){
			var me = this;
            exSVG.Pin.prototype.init.apply(me, arguments);
			me.addClass('output');
			me.mMaxLink = -1;
            return me;
        },
		
		drawLabel: function(){
			return this;
		},
		
		swapType: function(){
			var me = this;
			if(me.getType() == exSVG.Pin.PIN_IN)
				me.removeClass()
		},
		
		drawEditor: function(){
			return false;
		},

		acceptLink: function(otherPin){
			console.log('rrr');
			console.assert(otherPin instanceof exSVG.Pin)
			var me = this
			, ret = 0;
			
			if(otherPin.getNode() == me.getNode())
				ret += exSVG.Pin.PIN_LINK_ACCEPT_SAME_NODE;
			
			if(otherPin.isArrayDataType() != me.isArrayDataType())
				ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE_ARRAY;

			if(me.getType() == exSVG.Pin.PIN_OUT 
				&& !exLIB.isDataTypeCompatible(otherPin.getDataType(), me.getDataType()))
					ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE;
			
			else if(me.getType() == exSVG.Pin.PIN_IN 
				&& !exLIB.isDataTypeCompatible(me.getDataType(), otherPin.getDataType()))
					ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE;		

			else if(me.getType() == exSVG.Pin.PIN_INOUT && otherPin.getType() == exSVG.Pin.PIN_IN
				&& !exLIB.isDataTypeCompatible(otherPin.getDataType(), me.getDataType()))
					ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE;

			else if(me.getType() == exSVG.Pin.PIN_INOUT && otherPin.getType() == exSVG.Pin.PIN_OUT
				&& !exLIB.isDataTypeCompatible(me.getDataType(), otherPin.getDataType()))
					ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE;
					
			return ret;
		},
		
		startLink: function(target, className){
			return exSVG.Pin.prototype.startLink.call(this, target, exSVG.LinkReroute);
		}

	}
});


exSVG.LinkReroute = SVG.invent({
    inherit: exSVG.Link,

	create: function() {
		this.constructor.call(this, SVG.create('path'));
		var links = SVG.select('.exLinkStart');
		
		links.each(function(){
			this.remove();
		});
	},
	
    extend: {
		init: function(){
			var me = this;
            exSVG.Link.prototype.init.apply(me, arguments);
            return me;
        }
	}
});

exSVG.plugin(exSVG.Link, {
	
	init: function(){
		//console.log('rrr');
		var me = this;
		me.on('mouseenter', me.focus, me);
		me.on('mouseleave', me.blur, me);
		me.on('dblclick', me.addRerouteNode, me, {capture:true});
		me.on('mousedown', function(e){
			e.stopPropagation();
			e.stopImmediatePropagation();
		}, me, {capture:true});
	},
		
	focus: function(e){
		var me = this;
		//me.filter(function(add){add.gaussianBlur(1);});
		me.animate(200)
			.stroke({width: 4});
	},
	
	blur: function(e){
		var me = this;
		me.unfilter()
			.animate(300)
			.stroke({width: 2});
	},
	
	addRerouteNode: function(e){
		var me = this
		, point = me.findMousePoint(e)
		, worksheet = me.parent(exSVG.Worksheet)
		, node;

		worksheet.startSequence();
		node = worksheet.import(exLIB.getNode2('special.reroutenode'));

		//me.doc().circle(10).cx(point.point.x).cy(point.point.y);
		me.unfilter().stroke({width: 3});

		var box = node.bbox();
		node.x(point.point.x - 20);
		node.y(point.point.y - 15);
		node.replaceLink(this);
		worksheet.stopSequence();
	},
	
	findMousePoint: function(e, resolution){
		//console.log('exSVG.Link.findMousePoint()');
		var me = this
		, doc = me.doc()
		, screenPoint = me.parent(exSVG.Worksheet).point(e)
		, len = me.length()
		, bestMatch
		
		resolution = resolution || 100;
		
		for(var a=1; a < resolution; a++){
			var pt = me.pointAt((len/(resolution+1))*a);
			var l = pt.x - screenPoint.x;
			if(bestMatch && Math.abs(pt.x - screenPoint.x) > Math.abs(bestMatch.distance))
				return bestMatch;
			if(!bestMatch || Math.abs(pt.x - screenPoint.x) < Math.abs(bestMatch.distance))
				bestMatch = {distance: pt.x - screenPoint.x, length: (len/(resolution+1))*a, point: {x: pt.x, y: pt.y}};
		}
		return bestMatch;
	}

});

}).call(this);