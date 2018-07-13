;(function() {
"use strict";

// backup original draw function
var gfxDraw = exSVG.Pin.prototype.paint.clone();

SVG.extend(exSVG.Pin, {
	
	initPinHandlers: function(){
		var me = this;
		me.addClass('linkable');
			
		me.on('mousedown.link-handler', function(e){
			//console.log('pinBase.onMouseDown()', e.buttons);
			e.stopImmediatePropagation();
			e.stopPropagation();
			
			// If mouse button is pressed over the pin, we starting a new link
			// because only one link should be drawed at the same time,
			// before, we kill all other drawing links, in case of a bug.
			if(e.buttons == 1){
				me.parent(exSVG.Worksheet).select('.exLinkStart').each(function(){
					this.remove()}
				);
				if(!me.hasClass('linkable'))
					return;
				me.startLink(e);
			}

		});
		
		me.on('paint', function(){
			if(me.getLinks().length() > 0)
				me.addClass('linked')
			else
				me.removeClass('linked')			
		});
		
		me.on('mousemove.link-handler', function(e){
			//console.log('pinbase.onMouseMove()', e.buttons);
			if(e.buttons != 1)
				return;
			// check if we have a link currently draging/drawing
			// current dragging/drawing link have '.exLinkStart' class
			var links = me.parent(exSVG.Worksheet).select('.exLinkStart');
			if(links.length() == 0)
				return;
			if(links.last().getStartPin() == me)
				return;

			// to prevent drag link drawing not updated when mouse cursor is moving over the pin, because of e.stopPropagation(), 
			// dispatch the mouse event directly to the link draw method
			links.last().draw(e);
			
			// check if the start pin dataType is compatible with this pin
			if(!me.hasClass('linkable'))
				return;
			if(me.acceptLink(links.last().getStartPin()) > 0){
				console.log('Pin Datatype is not compatible', me.acceptLink(links.last().getStartPin()));
				me.parent(exSVG.Worksheet).showTooltip(e, '<div><img src = "exsvg/img/none.png"> DataType is not compatible</div>', 1);
			}
			else
				me.parent(exSVG.Worksheet).showTooltip(e, '<img src = "exsvg/img/linkok.png"> Pins are compatibles', 10);					
			//console.log(links);			
		});
		
		me.on('mouseup.link-handler', function(e){
			//console.log('exPin.mouseup', e.button);
			if(e.button != 0){
				e.stopImmediatePropagation();
				e.stopPropagation();
				return;
			}
			var link = SVG.select('.exLinkStart'); 
			if(link.length() == 0)
				return;
			e.stopImmediatePropagation();
			console.assert(link.length() == 1);
			
			if(!me.hasClass('linkable') || me.acceptLink(link.last().getStartPin()) != 0){
				console.log('Pin \'' + me.getId() + '\' dont accept link');
				link.last().remove();
				return;
			}
			me.endLink(link.last(), e);
		});
		
	},
	
	getLinks: function(ignore){
		ignore = (ignore) ? ':not([id="' + ignore.id() + '"])' : '';
		var me = this;
		var type = (me.getType() == exSVG.Pin.PIN_IN) ? 'pinIn' : 'pinOut';
		return me.parent(exSVG.Worksheet).select('.exLink[data-' + type + '="' + me.id() + '"]' + ignore);
	},
		
	/*
	/* start a link when user mousedown and drag this pin
	/* called from init in mousedown.pin event on pin
	*/
	startLink: function(target){
		//console.group('Pin.startLink()');
		var me = this
		, link;
		
		if(target instanceof MouseEvent){
			link = me.parent(exSVG.Worksheet).createLink(me, target);
			if(!link instanceof exSVG.Link)
				return link;
		}
		else
			link = target;
		
		link.on('cancel.pinlink' + me.id(), function(){
			this.off('.pinlink' + me.id());
			this.off('.pinlinkadd' + me.id());
		});
		
		link.on('add.pinlinkadd' + me.id(), function(){
			me.addLink(this);
		});
		//me.initLinkEvents(link);
		//console.groupEnd();
		return me;
	},
	
	endLink: function(link, e){
		//console.group('Pin.endLink()');
		console.assert(link instanceof exSVG.Link, 'link should be "exSVG.Link" instance, but "' + link.constructor.name + '" found');
		var me = this;
		
		link.on('cancel.pinlink' + me.id(), function(){
			this.off('.pinlink' + me.id());
			this.off('.pinlinkadd' + me.id());
		});
		
		link.on('add.pinlinkadd' + me.id(), function(){
			me.addLink(this);
			link.off('cancel.pinlink' + me.id());
		});
		
		link.finish(me, e);
		//console.groupEnd();
		return me;
	},
	
	acceptLink: function(otherPin){
		//console.log('pinBase.acceptLink()');
		console.assert(otherPin instanceof exSVG.Pin)
		var me = this;
		var ret = 0;
					
		if(otherPin.getType() == me.getType())
			ret += exSVG.Pin.PIN_LINK_ACCEPT_SAME_DIRECTION;

		if(otherPin.getNode() == me.getNode())
			ret += exSVG.Pin.PIN_LINK_ACCEPT_SAME_NODE;
		
		if(otherPin.isArrayDataType() != me.isArrayDataType())
			ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE_ARRAY;

		if(me.getType() == exSVG.Pin.PIN_OUT && !exLIB.isDataTypeCompatible(otherPin.getDataType(), me.getDataType()))
			ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE;
		
		else if(me.getType() == exSVG.Pin.PIN_IN && !exLIB.isDataTypeCompatible(me.getDataType(), otherPin.getDataType()))
			ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE;		
		return ret;
	},
	
	addLink: function(link){
		//console.group('Pin.addLink()');
		console.assert(link instanceof exSVG.Link, 'link should be instance of exSVGLink');
		var me = this;

		me.addClass('linked');
		me.paint();
		me.initLinkEvents(link);
		return me;
	},
	
	removeLink: function(link){
		//console.group('Pin.removeLink()');
		var me = this
		, group

		console.assert(link instanceof exSVG.Link, 'link should be instance of exSVGLink, but "' + link.constructor.name + '" found');
		
		//check if we have remaining links on this pin
		var links = me.getLinks();
		if(links.length() > 0){
			me.paint();
			return;
		}
		
		// from here, no links remaining on this pin
		me.removeClass('linked');
		me.paint();
		//console.groupEnd();
		return me;
	},

	initLinkEvents: function(link){
		//console.warn('Pin.initLinkEvents()');
		var me = this;
		
		me.getNode().on('move.linknode' + link.id(), function(e){
			//console.log('nodemove', this.id())
			// track node move's to redraw the link.
			link.draw();
		});
		
		me.getNode().on('resize.linknode' + link.id(), function(e){
			//console.log('nodemove', this.id())
			// track node resize to redraw the link.
			link.draw();
		});

		me.getNode().on('before-remove.linknode' + link.id(), function(e){
			// remove this link if the node of start pin is removed
			link.remove();
		});
		
		link.on('remove.linknode' + me.id(), function(){
			me.removeLink(this);
			me.getNode().off('.linknode' + link.id());
			link.off('.linknode' + me.id());
		});
		return me;
	},

});

}).call(this);