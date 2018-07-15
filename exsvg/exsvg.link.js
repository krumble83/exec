;(function() {
"use strict";

exSVG.Link = SVG.invent({
    //create: 'path', 
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
			
			me.setDataType(startPin.getDataType());
			me.stroke({color: startPin.getColor(), width: 3});
			me.mColor = startPin.getColor();
			me.addClass('exLink');
			me.data('startPin', startPin.id());
			
			if(out instanceof MouseEvent){
				// If the second argument of the function call is a mouse event
				// The link is started by the user by clicking/dragging a pin (see exPin ctor)
				me.addClass('exLinkStart');
				me.doc().fire('link-start', {link: me});
				me.initMouseEvents(out);
			}
			return me;
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
			if(this.getInputPin() == pin)
				return this.getOutputPin();
			else if(this.getOutputPin() == pin)
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
			, pinIn = me.getInputPin()
			
			if(me.mDataType == datatype)
				return;
			
			me.mDataType = datatype;
			me.setColor(exLIB.getDataType2(datatype).Color());
			if(pinIn){
				me.stroke({color: me.getColor(), width: 3});
				//me.draw();
			}
		
		},
		
		
		/*
		/* override the default svg.js method
		/* when a link is delete from the document
		/* we must tell at each pin that the link was deleted to her to update their datatype/color if needed
		*/
		
		remove: function(){
			//console.group('Link.remove()');
			var me = this
			, doc = me.doc()
			, ret
			
			console.assert(doc);
			me.parent(exSVG.Worksheet).off('export.link' + me.id());
			
			if(me.hasClass('exLinkStart')){
				console.log('link-cancel')
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
			//console.groupEnd();
			return ret;
		},
		
		
		/*
		/* override the default svg.js method
		/* when a link is inserted in the document (or reinserted via undo/redo)
		/* we must tell at each pin that a new link was added/reinserted to rebind event listeners.
		*/
		addTo: function(){
			//console.group('Link.addTo()');
			var me = this
			, ret = SVG.Path.prototype.addTo.apply(me, arguments);
			
			me.parent(exSVG.Worksheet).on('export.link' + me.id(), function(e){
				me.export(e.detail.parent);
			});			

			me.fire('add');
			SVG.off(document, '.linkStart-link' + me.id());
			me.off('cancel');
			
			// send an event to the main SVG // this event is used by undo/redo
			me.doc().fire('link-add', {link: me});
			//console.groupEnd();
			return ret;
		},

		
		/*
		/* Finish a link
		/* if second argument is a mouse event (mousemove), the link is currently drawed by the user
		/* otherwise, the link is created programmaticaly.
		*/
		finish: function(endPin, e){
			//console.group('Link.finish()');
			//console.log('link.finish', endPin);
			var me = this
			, startPin = me.getStartPin()
			, worksheet = me.parent(exSVG.Worksheet);
			
			console.assert(worksheet);
			console.assert(startPin instanceof exSVG.Pin);
			console.assert(endPin instanceof exSVG.Pin);
			console.assert(startPin.acceptLink(endPin, me) == 0, 'result: ' + startPin.acceptLink(endPin, me));
			console.assert(endPin.acceptLink(startPin, me) == 0, 'result: ' + endPin.acceptLink(startPin, me));
			console.assert(startPin.getType() != endPin.getType());
			
			// register start pin / end pin ids directly in the link node
			if(endPin.getType() == exSVG.Pin.PIN_IN){
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
			}
			//console.groupEnd();
			return me;
		},
		
		
		/*
		/* Init all mouse events
		/* these bindings are regrouped in a function in case of we want to ovveride this
		*/
		initMouseEvents: function(initialEvent){
			//console.group('Link.initMouseEvents()');
			var me = this;

			// track mousemove on the SVG document to paint link when user currently drawing new link
			SVG.on(document, 'mousemove.linkStart-link' + me.id(), function(e){
				me.draw(e);
			});
			
			SVG.on(document, 'mouseup.linkStart-link' + me.id(), function(e){
				console.log('mouseup', e.timeStamp);
				me.remove();
				//e.stopPropagation();
				//e.stopImmediatePropagation();
			});

			// avoid propagation of the mouse event to the parents
			initialEvent.stopPropagation();
			initialEvent.stopImmediatePropagation();
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
			, link;
			
			console.assert(me.parent(), 'can\'t find link parent to export');
			
			if(!graph.GetNode(me.getInputPin().getNode().id()) || !graph.GetNode(me.getOutputPin().getNode().id())){
				console.error('can\'t find node to export link');
				return;
			}
			
			link = graph.Link();
			link.Input(me.getInputPin().getNode().id(), me.getInputPin().getId());
			link.Output(me.getOutputPin().getNode().id(), me.getOutputPin().getId());
			link.attr('datatype', me.getDataType());
			link.attr('color', me.getColor());
		},

		import: function(data){

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
			, smooth = 60;
			
			// if a mouse event is passed as first argument of the function, the user currently drawing a new link
			if(e) {
				startPin = me.getStartPin();
				stoppos = me.parent(exSVG.Worksheet).point(e);
			} else {
				startPin = (me.getInputPin()) ? me.getInputPin() : me.getOutputPin();
				stoppos = (startPin.getType() == exSVG.Pin.PIN_IN) ? me.getOutputPin().getCenter() : me.getInputPin().getCenter();
			}
			
			// Calculate the path coordinates
			startpos = startPin.getCenter();
			
			// check the way of drawing (left to right, right to left, top to bottom ...)
			var w = (startpos.y > stoppos.y) ? (startpos.y - stoppos.y) / 2 : (stoppos.y - startpos.y) / 2;
			
			if(startPin.getType() == exSVG.Pin.PIN_IN){
				cp1 = {x: Math.min(startpos.x - w, startpos.x - smooth), y: startpos.y};
				cp2 = {x: Math.max(stoppos.x + w, stoppos.x + smooth), y: stoppos.y};
			}
			else if(startPin.getType() == exSVG.Pin.PIN_OUT){
				cp1 = {x: Math.max(startpos.x + w, startpos.x + smooth), y: startpos.y};
				cp2 = {x: Math.min(stoppos.x - w, stoppos.x - smooth), y: stoppos.y};				
			}
			
			//me.parent(exSVG.Worksheet).line(startpos.x, startpos.y, cp1.x, cp1.y).stroke({width:1});
			//me.parent(exSVG.Worksheet).line(stoppos.x, stoppos.y, cp2.x, cp2.y).stroke({width:1});
			
			// drawing the path
			me.plot('M' + startpos.x + ',' + startpos.y + ' C' + (cp1.x) + ',' + cp1.y + ' ' + (cp2.x) + ',' + cp2.y + ' ' + stoppos.x + ',' + stoppos.y);

			return me;
		},
	}
});


SVG.extend(exSVG.Worksheet, {

	/*
	/* this function is called by exSVG.Worksheet at load, when she as loaded all modules
	*/
	initLinks: function() {
		var me = this;
		me.mLinks = me.group().addClass('exLinks');
		if(me.getGrid())
			me.getGrid().before(me.mLinks);
			//me.mLinks.after(me.getGrid());
		if(me.mGrid)
			me.mGrid.back();
		me.initLinkEventHandlers();
		return me;
	},
	
	initLinkEventHandlers: function(){
		var me = this;
		me.doc().on('node-add.links', function(e){
			var node = e.detail.node;
			node.on('pin-add.link', function(e){
				var pin = e.detail.pin;
				pin.initPinHandlers();
			});
			
			node.select('.exPin').each(function(){
				this.initPinHandlers();
			});
			
			// cancel drawing links when user move any node			
			node.on('move-start.link', function(){
				//console.log('ko')
				SVG.select('.exLinkStart').each(function(){
					this.remove();
				});
			});			
			
		});
		
	},

	createLink: function(pin, e){
		//console.log('worksheet.createLink()', arguments[0]);
		var me = this
		, link = new exSVG.Link;
		
		me.mLinks.put(link);
		link.init.apply(link, arguments);
		if(e instanceof exSVG.Pin){
			pin.startLink(link);
			e.endLink(link);			
		}
		return link;
	},
	
	importLink0: function(data){
		
	},
	
	getLinksLayer: function(){
		//console.log('worksheet.getLinksLayer()');
		return this.mLinks;
	}

});

exSVG.Worksheet.prototype.plugins.link = {name: 'Links', initor: 'initLinks'}

}).call(this);


