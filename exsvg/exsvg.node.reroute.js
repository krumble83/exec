;(function() {
"use strict";

exSVG.RereouteNode = SVG.invent({
    create: 'g', 
    inherit: exSVG.Node,
    extend: {
        init: function(data){
			//console.log('exSVG.RereouteNode.init()');
			var me = this;
			exSVG.Node.prototype.init.apply(me, arguments);
			me.setData('title', 'Reroute Node');
			me.addClass('exReroute');

			me.getPin('out').addClass('hidden');
			me.getPin('in').addClass('hidden');
			me.mInputPinGroup.move(15,10);
			me.mOutputPinGroup.move(15,10);

			return me;
        },
		
		rerouteLink: function(link){
			//console.log('exSVG.RereouteNode.rerouteLink()');
			var me = this
			, einp = link.getInputPin()
			, eoutp = link.getOutputPin()
			, inp = me.getPin('in')
			, out = me.getPin('out')
			, inout = me.getPin('inout');

			assert(eoutp instanceof exSVG.Pin);
			assert(einp instanceof exSVG.Pin);
			
			link.remove();
			inp.setDataType(eoutp.getDataType(), true);
			
			link = me.parent(exSVG.Worksheet).createLink(einp, out);
			link.on('remove.pinreroute', function(){
				inout.removeLink(this);
			});

			link = me.parent(exSVG.Worksheet).createLink(inp, eoutp);
			link.on('remove.pinreroute', function(){
				inout.removeLink(this);
			});
			
			//bricolage ?
			inout.addClass('linked');
		},
		
		drawShape: function(x, y){
			//console.log('exSVG.RereouteNode.drawShape()');
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
		},
		
		drawPins: function(){
			var me = this;
			me.getPin('in').show();
			me.getPin('out').show();
			return;
		}
	}
});


exSVG.PinReroute = SVG.invent({
    create: 'g', 
    inherit: exSVG.PinWildcards,
	
    extend: {
		init: function(){
			//console.log('exSVG.PinReroute.init()');
			var me = this;
            exSVG.PinWildcards.prototype.init.apply(me, arguments);
			me.addClass('output');
			me.mMaxLink = -1;
            return me;
        },
		
		drawLabel: function(){
			return this;
		},
		
		drawEditor: function(){
			return this;
		},

		addLink: function(link){
			//console.log('exSVG.PinReroute.addLink()', link);
			var me = this
			, otherPin = link.getOtherPin(me) || link.getOtherPin(me.getNode().getPin('in')) || link.getOtherPin(me.getNode().getPin('out'));

			assert(link instanceof exSVG.Link, 'link should be instance of exSVG.Link');
			assert(otherPin instanceof exSVG.Pin, function(){
				console.log(otherPin);
				link.remove();
			});

			if(otherPin.getType() == exSVG.Pin.PIN_IN){
				link.data('pinOut', me.getNode().getPin('out').id());
				me.getNode().getPin('out').addLink(link);
			}
			else if(otherPin.getType() == exSVG.Pin.PIN_OUT){
				link.data('pinIn', me.getNode().getPin('in').id());
				me.getNode().getPin('in').addLink(link);
			}
			link.on('remove.pinreroute', function(){
				me.removeLink(this);
			});
			
			me.addClass('linked');
			me.paint();
			return me;
		},
		
		removeLink: function(link){
			//console.log('exSVG.PinReroute.removeLink()', link);
			var me = this;
			if(me.getNode().getLinks().length() == 0)
				me.removeClass('linked');
			link.off('.pinreroute');
		},
		
		acceptLink: function(otherPin){
			//console.log('exSVG.PinReroute.acceptLink()', otherPin);
			var me = this
			, ret = 0;

			assert(otherPin instanceof exSVG.Pin);
			
			if(otherPin.getNode() == me.getNode())
				return {code: exSVG.Pin.PIN_LINK_ACCEPT_SAME_NODE, label: '<div><img src="exsvg/img/none.png"> Both Pin are on same Node'};
			
			if(exLIB.isWildcardsDataType(me.getDataType()))
				return {code: 0, label: '<img src="exsvg/img/linkok.png"> Place a new Link'};
			
			if(otherPin.getType() == exSVG.Pin.PIN_IN
				&& !exLIB.isDataTypeCompatible(otherPin.getDataType(), me.getDataType()))
					return {code: exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE, label: '<div><img src="exsvg/img/none.png"> Datatype is not compatible'};

			else if(otherPin.getType() == exSVG.Pin.PIN_OUT
				&& !exLIB.isDataTypeCompatible(me.getDataType(), otherPin.getDataType()))
					return {code: exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE, label: '<div><img src="exsvg/img/none.png"> Datatype is not compatible'};
					
			return {code: 0, label: '<img src="exsvg/img/linkok.png"> Place a new Link'};
		},
		
		startLink: function(target, className){
			//console.log('exSVG.PinReroute.startLink()');
			var me = this
			, worksheet = me.parent(exSVG.Worksheet)
			, link
			
			//overide all pin's mousemove event listener, because Pinreroute should accept all type of pin
			worksheet.select('.exPin.linkable').on('mousemove.reroute', function(e){
				var links = worksheet.select('.exLinkStart');
				
				if(links.length() == 0 || this == me)
					return;

				worksheet.showTooltip(e, me.acceptLink(this).label, 10);
				e.stopPropagation();
				
				console.log('TODO: remove this event listener');
				
				// to prevent drag link drawing not updated when mouse cursor is moving over the pin, because of e.stopPropagation(), 
				// dispatch the mouse event directly to the link draw method
				links.last().draw(e);
			}, undefined, {capture: true});
			
			worksheet.select('.exPin.linkable').on('mouseup.reroute', function(e){
				var link = worksheet.select('.exLinkStart');

				worksheet.select('.exPin.linkable').off('.reroute');
				
				if(link.length() == 0 || this == me)
					return;

				e.stopImmediatePropagation();

				assert(link.length() == 1);
				link = link.first();
				
				if(!me.hasClass('linkable') || me.acceptLink(this).code != 0){
					console.log('Pin \'' + me.getId() + '\' dont accept link');
					link.remove();
					return;
				}
				link.setStartPin((this.getType() == exSVG.PIN_IN) ? me.getNode().getPin('out') : me.getNode().getPin('in'));
				this.endLink(link, e);
				
			}, undefined, {capture: true});
			
			console.log('ok');
			
			link = exSVG.PinWildcards.prototype.startLink.call(this, target, exSVG.LinkReroute);			
			assert(link instanceof exSVG.Link);
			
			link.on('finish', function(){
				me.off('.reroute');
			});
			link.on('cancel', function(){
				me.off('.reroute');
			});
			return link;
		},
		
		setDataType: function(datatypeid){
			//console.log('exSVG.PinReroute.setDataType()', datatypeid);
			var me = this;
			
			if(exLIB.isExecDataType(datatypeid)){
				me.getNode().getPin('in').setMaxLink(-1);
				me.getNode().getPin('out').setMaxLink(1);
			}
			else {
				me.getNode().getPin('in').setMaxLink(1);
				me.getNode().getPin('out').setMaxLink(-1);
			}
			
			return exSVG.PinWildcards.prototype.setDataType.apply(me, arguments);
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
			//console.log('exSVG.LinkReroute.init()');
			var me = this;
            exSVG.Link.prototype.init.apply(me, arguments);
            return me;
        },
		
		draw: function(e){
			//console.log('exSVG.LinkReroute.draw()', e);
			var me = this
			, startPin = me.getStartPin();
			
			if(!startPin)
				return exSVG.Link.prototype.draw.apply(this, arguments);
			
			var startpos = startPin.getCenter()
			, stoppos = me.parent(exSVG.Worksheet).point(e)
			, cp1
			, cp2
			, smooth = 60;
						
			// check the vertical way of drawing (top to bottom / bottom to top)
			var w = (startpos.y > stoppos.y) ? (startpos.y - stoppos.y) / 2 : (stoppos.y - startpos.y) / 2;
			
			// check the horizontal way of drawing (left to right / right to left)
			if(stoppos.x < startpos.x){
				cp1 = {x: Math.min(startpos.x - w, startpos.x - smooth), y: startpos.y};
				cp2 = {x: Math.max(stoppos.x + w, stoppos.x + smooth), y: stoppos.y};
			} else {
				cp1 = {x: Math.max(startpos.x + w, startpos.x + smooth), y: startpos.y};
				cp2 = {x: Math.min(stoppos.x - w, stoppos.x - smooth), y: stoppos.y};					
			}
			
			// drawing the path
			me.plot('M' + startpos.x + ',' + startpos.y + ' C' + (cp1.x) + ',' + cp1.y + ' ' + (cp2.x) + ',' + cp2.y + ' ' + stoppos.x + ',' + stoppos.y);

			return me;
		}
	}
});

exSVG.plugin(exSVG.Link, {
	
	init: function(){
		//console.log('exSVG.Link.init()[NodeReroute plugin]');
		var me = this;
		me.on('mouseenter.reroute', me.focus, me);
		me.on('mouseleave.reroute', me.blur, me);
		me.on('dblclick.reroute', me.addRerouteNode, me, {capture:true});
		me.on('mousedown.reroute', function(e){
			e.stopPropagation();
			e.stopImmediatePropagation();
		}, me, {capture:true});
	},
		
	focus: function(e){
		var me = this;
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
		//console.log('exSVG.Link.addRerouteNode()[NodeReroute plugin]');
		var me = this
		, point = me.findMousePoint(e)
		, worksheet = me.parent(exSVG.Worksheet)
		, node;

		me.unfilter().stroke({width: 3});

		worksheet.startSequence();
		node = worksheet.import(exLIB.getNode2('special.reroutenode'));
		assert(node instanceof exSVG.Node);
		if(worksheet.snapToGrid){
			var snap = worksheet.snapToGrid(point.point.x, point.point.y);
			node.move(snap.x, snap.y)
		}
		else
			console.log('coucou');
		node.rerouteLink(this);
		worksheet.stopSequence();
	},
	
	findMousePoint: function(e, resolution){
		//console.log('exSVG.Link.findMousePoint()[NodeReroute plugin]');
		var me = this
		, doc = me.doc()
		, screenPoint = me.parent(exSVG.Worksheet).point(e)
		, len = me.length()
		, bestMatch;
		
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