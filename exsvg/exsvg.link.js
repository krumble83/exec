;(function() {
"use strict";

exSVG.Link = SVG.invent({
    inherit: SVG.Path,

	create: function() {
		this.constructor.call(this, SVG.create('path'));
		var links = SVG.select('.exLinkStart');
		
		links.each(function(){
			this.remove();
		});
	},
	
    extend: {
		init: function(startPin, out){
			var me = this;
			
			assert(startPin instanceof exSVG.Pin);
			
			me.setDataType(startPin.getDataType());
			me.stroke({color: startPin.getColor(), width: 2});
			me.mColor = startPin.getColor();
			me.addClass('exLink');
			me.setStartPin(startPin);
			
			if(out instanceof MouseEvent){
				// If the second argument of the function call is a mouse event
				// The link is started by the user by clicking/dragging a pin (see exPin ctor)
				me.addClass('exLinkStart');
				me.doc().fire('link-start', {link: me});
				me.initMouseEvents(out, startPin);
			}
			
			exSVG.execPlugins(this, arguments, exSVG.Link);
			return me;
        },
		
		hasFlag: function(flag){
			var flags = parseInt(this.data('flags') || 0);
			
			return flags & flag === flag;
		},

		setStartPin: function(pin){
			assert(pin instanceof exSVG.Pin);
			this.data('startPin', pin.id());
		},
		
		getStartPin: function(){
			if(!this.data('startPin'))
				return null;
			return SVG.get(this.data('startPin'));
		},
		
		getInputPin: function(){
			if(!this.data('pinIn'))
				return null;
			return SVG.get(this.data('pinIn'));
		},
		
		getOutputPin: function(){
			if(!this.data('pinOut'))
				return null;
			return SVG.get(this.data('pinOut'));
		},
		
		getOtherPin: function(pin){
			if(this.getInputPin() === pin)
				return this.getOutputPin();
			else if(this.getOutputPin() === pin)
				return this.getInputPin();
			return false;
		},
		
		getDataType: function(){
			return this.mDataType;
		},
		
		setColor: function(color){
			this.mColor = color;
			return this;
		},
		
		getColor: function(){
			return this.mColor;
		},
		
		setDataType: function(datatype){
			//console.log('exlink.setDataType', datatype);
			var me = this
			, pinIn = me.getInputPin();
			
			if(me.mDataType === datatype)
				return;
			
			me.mDataType = datatype;
			me.setColor(exLIB.getDataType2(datatype).Color());
			if(pinIn){
				me.stroke({color: me.getColor(), width: 3});
			}
			return me;
		},
		
		
		/*
		/* override the default svg.js method
		/* when a link is delete from the document
		/* we must tell at each pin that the link was deleted to her to update their datatype/color if needed
		*/	
		remove: function(){
			//console.log('exSVG.Link.remove()');
			var me = this
			, doc = me.doc()
			, ret;
			
			assert(doc);
			me.parent(exSVG.Worksheet).off('export.link' + me.id());
			
			if(me.hasClass('exLinkStart')){
				//console.log('link-cancel')
				me.parent(exSVG.Worksheet).select('.exLink, .exPin').animate(50).opacity(1);
				ret = SVG.Path.prototype.remove.apply(me, arguments);
				me.fire('cancel');
				doc.fire('link-cancel', {link: me});
				SVG.off(document, '.linkStart-link' + me.id());
				//doc.off('.linkStart' + me.id());
				return ret;
			}
			
			ret = SVG.Path.prototype.remove.apply(me, arguments);
			me.fire('remove');

			// send an event to the main SVG // this event is used by undo/redo
			doc.fire('link-remove', {link: me});
			return ret;
		},
		
		
		/*
		/* override the default svg.js method
		/* when a link is inserted in the document (or reinserted via undo/redo)
		/* we must tell at each pin that a new link was added/reinserted to rebind event listeners.
		*/
		addTo: function(){
			//console.group('exSVG.Link.addTo()');
			var me = this
			, ret = SVG.Path.prototype.addTo.apply(me, arguments);
			
			me.fire('add');
			SVG.off(document, '.linkStart-link' + me.id());
			me.off('cancel');
			
			// send an event to the main SVG // this event is used by undo/redo
			me.doc().fire('link-add', {link: me});
			return ret;
		},

		
		/*
		/* Finish a link
		/* if second argument is a mouse event (mousemove), the link is currently drawed by the user
		/* otherwise, the link is created programmaticaly.
		*/
		finish: function(endPin, e){
			//console.log('exSVG.Link.finish()');
			var me = this
			, startPin = me.getStartPin()
			, worksheet = me.parent(exSVG.Worksheet);
			
			assert(worksheet);
			assert(startPin instanceof exSVG.Pin);
			assert(endPin instanceof exSVG.Pin);
			assert(startPin.getType() !== endPin.getType(), function(){
				console.log(startPin.getId(), endPin.getId());
			});
			
			// register start pin / end pin ids directly in the link node
			if(endPin.getType() === exSVG.Pin.PIN_IN || startPin.getType() === exSVG.Pin.PIN_OUT){
				me.data('pinIn', endPin.id());
				me.data('pinOut', startPin.id());
			} else {
				me.data('pinIn', startPin.id());
				me.data('pinOut', endPin.id());
			}

			me.data('startPin', null);
			me.removeClass('exLinkStart');
			me.addClass('exLink');
			me.draw();
			
			// see addTo method where we tell at each pin that a new link was added to her
			me.addTo(worksheet.getLinksLayer());
			
			
			// If second argument of the function call is a mouse event
			// the link is currently drawed by the user
			// we send an event to indicate that drawing is finished
			// this event is currently used only in exSVG.Worksheet to shade on/off other links
			if(e instanceof MouseEvent){
				me.fire('finish');
				me.doc().fire('link-finish', {link: this});
				me.off('finish');
				worksheet.select('.exLink, .exPin').animate(50).opacity(1);
			}
			return me;
		},
		
		
		/*
		/* Init all mouse events
		/* these bindings are regrouped in a function in case of we want to ovveride this
		*/
		initMouseEvents: function(initialEvent, startPin){
			//console.group('Link.initMouseEvents()');
			var me = this
			, worksheet = me.parent(exSVG.Worksheet);

			// track mousemove on the SVG document to paint link when user currently drawing new link
			SVG.on(document, 'mousemove.linkStart-link' + me.id(), me.draw, me);			
			SVG.on(document, 'mouseup.linkStart-link' + me.id(), me.remove, me);

			// avoid propagation of the mouse event to the parents
			initialEvent.stopPropagation();
			initialEvent.stopImmediatePropagation();

			worksheet.select('.exLink:not(.exLinkStart)').animate(100).opacity(0.4);
			
			var type = startPin.getDataType();
			if(exLIB.isArrayDataType(type))
				worksheet.select('.exPin:not([data-type="' + type + '"]):not([data-type="' + exLIB.getWildcardsDataType(true) + '"])').animate(100).opacity(0.2);
			else
				worksheet.select('.exPin:not([data-type="' + type + '"]):not([data-type="' + exLIB.getWildcardsDataType() + '"])').animate(100).opacity(0.2);

			if(startPin.getType() === exSVG.Pin.PIN_IN)
				worksheet.select('.exPin.input:not(.outpout)').animate(100).opacity(0.2);
			else
				worksheet.select('.exPin.output:not(.input)').animate(100).opacity(0.2);

			worksheet.select('.exPin.output.input').animate(100).opacity(1);
			
			//console.groupEnd();
			return me;
		},

		
		/*
		/* Export Link
		/* this function is called by a listener when exSVG.Worksheet throw an 'export' event
		/* event listener is binded in exSVG.Link.addTo method and unbinded in exSVG.Link.remove
		*/
		export: function(graph){
			var me = this
			, pinIn = me.getInputPin()
			, pinOut = me.getOutputPin()
			, link = graph.Link();
			
			assert(pinIn instanceof exSVG.Pin);
			assert(pinOut instanceof exSVG.Pin);
			
			link.Input(pinIn.getNode().id(), pinIn.getId()).attr('linkref', pinIn.getNode().id() + '-' + pinIn.getId());
			link.Output(pinOut.getNode().id(), pinOut.getId()).attr('linkref', pinOut.getNode().id() + '-' + pinOut.getId());
			link.attr('datatype', me.getDataType());
			link.attr('color', me.getColor());
			

			graph.GetNode(pinIn.getNode().id()).Input(pinIn.getId()).add(new exGRAPH.Linkref().init(pinIn.getNode().id(), pinIn.getId()));
			graph.GetNode(pinOut.getNode().id()).Output(pinOut.getId()).add(new exGRAPH.Linkref().init(pinOut.getNode().id(), pinOut.getId()));

			return link;
		},

		import: function(graph){

		},

		/*
		/* drawing link
		/* if a mouse event is passed as first argument, the user currently drawing a new link
		/* otherwise the drawing is made on two node's pin (input and outpout)
		/* this function is called at :
		/*     - each node's move (listener binded in xxxxx)
		/*     - each mouse's move when a link is currently drawed by user (listener binded in xxxxxx)
		/*	   - a lot more (TODO: list them)
		*/
		draw: function(e){
			//console.log('exlink.draw', e);
			var me = this
			, startpos
			, stoppos
			, cp1
			, cp2
			, startPin
			, stopPin
			, smooth = 60;
			
			// if a mouse event is passed as first argument of the function, the user currently drawing a new link
			if(e instanceof MouseEvent) {
				startPin = me.getStartPin();
				stoppos = me.parent(exSVG.Worksheet).point(e);
			} else {
				startPin = me.getInputPin();
				stopPin = me.getOutputPin();
				stoppos = me.getOutputPin().getCenter();
			}
			
			// Calculate the path coordinates
			startpos = startPin.getCenter();
			
			// check the way of drawing (left to right, right to left, top to bottom ...)
			var w = (startpos.y > stoppos.y) ? (startpos.y - stoppos.y) / 2 : (stoppos.y - startpos.y) / 2;
			
			if(startPin.getType() === exSVG.Pin.PIN_IN || (stopPin && stopPin.getType() === exSVG.Pin.PIN_OUT)){
				cp1 = {x: Math.min(startpos.x - w, startpos.x - smooth), y: startpos.y};
				cp2 = {x: Math.max(stoppos.x + w, stoppos.x + smooth), y: stoppos.y};
			}
			else if(startPin.getType() === exSVG.Pin.PIN_OUT || (stopPin && stopPin.getType() === exSVG.Pin.PIN_IN)){
				cp1 = {x: Math.max(startpos.x + w, startpos.x + smooth), y: startpos.y};
				cp2 = {x: Math.min(stoppos.x - w, stoppos.x - smooth), y: stoppos.y};				
			}

			else{
				console.error('can\'t calculate link coords');
				return;
			}
			
			// drawing the path
			me.plot('M' + startpos.x + ',' + startpos.y + ' C' + (cp1.x) + ',' + cp1.y + ' ' + (cp2.x) + ',' + cp2.y + ' ' + stoppos.x + ',' + stoppos.y);

			return me;
		},
		
		destroy: function(){
			//this.off();
		}
	}
});


SVG.extend(exSVG.Node, {
	getLinks: function(){
		var me = this;
		return me.parent(exSVG.Worksheet).select('path[data-pinIn^="' + me.id() + '-"],path[data-pinOut^="' + me.id() + '-"]');
	}
});

exSVG.plugin(exSVG.Worksheet, {

	init: function() {
		//console.log('exSVG.Worksheet.init()[exsvg.link.js]', arguments);
		var me = this;
		me.mLinks = me.group().addClass('exLinks');
		if(me.getWorkspace)
			me.getWorkspace().back();
		return me;
	},

	createLink: function(pin, e, className){
		//console.log('worksheet.createLink()', arguments[0]);
		var me = this
		, link = new (className || exSVG.Link)();
		
		me.mLinks.put(link);
		link.init(pin, e);
		if(e instanceof exSVG.Pin){
			pin.startLink(link);
			e.endLink(link);			
		}
		return link;
	},
	
	importLink: function(linkGraph){
		//console.log(link);
		var me = this
		, worksheet = me
		, pinIn
		, pinOut;
		
		pinIn = worksheet.select('linkref[node="' + linkGraph.select('input').first().attr('node') + '"][pin="' + linkGraph.select('input').first().attr('pin') + '"]').first().parent(exSVG.Pin);
		pinOut = worksheet.select('linkref[node="' + linkGraph.select('output').first().attr('node') + '"][pin="' + linkGraph.select('output').first().attr('pin') + '"]').first().parent(exSVG.Pin);

		pinIn.select('linkref').first().remove();
		pinOut.select('linkref').first().remove();
				
		return me.createLink(pinIn, pinOut);
	},
	
	getLinksLayer: function(){
		//console.log('worksheet.getLinksLayer()');
		return this.mLinks;
	}

});


}).call(this);


