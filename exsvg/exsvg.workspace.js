;(function() {
"use strict";

var DRAGSMALL;

SVG.extend(exSVG.Worksheet, {

	initWorkspace: function() {
		var me = this
		, panStart = {x:null, y:null, pan:false}
		, panEl
		, panElCursor;	
		
		console.log('exSVG.Worksheet.initWorkspace()');
		
		me.mWorkspace = me.rect(100000,100000)
			.x(-50000)
			.y(-50000)
			.back()
			.addClass('workspace')
		me.line(0, -50000, 0, 50000).stroke({width: 1, color: '#000'}).back();
		me.line(-50000, 0, 50000, 0).stroke({width: 1, color: '#000'}).back();
		//me.mWorkspace.back();
		
		me.size('100%', '100%')
			.panZoom({zoomMin: 0.05, zoomMax: 1, zoomFactor: 0.08});

		me.doc().on('node-add.worksheet', function(e){
			var node = e.detail.node;
			node.on('contextmenu.worksheet', function(e){
				if(panStart.pan){
					e.preventDefault();
					e.stopImmediatePropagation();
					e.stopPropagation();
				}
			});
		});
		
		me.on('panStart.workspace', function(e){
			panStart.x = e.detail.event.clientX;
			panStart.y = e.detail.event.clientY;
			panEl = e.detail.event.target;
			panElCursor = panEl.instance.style('cursor');
			panEl.instance.style('cursor', 'url("exsvg/img/pancursor.png"), default');
			me.addClass('blur');
		});
		
		me.on('panEnd.workspace', function(e){
			if (e.detail.event.clientX != panStart.x || e.detail.event.clientY != panStart.y)
				panStart.pan = true;
			else
				panStart.pan = false;
			
			e.detail.event.stopPropagation();
			e.detail.event.stopImmediatePropagation();
			e.detail.event.preventDefault();

			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			
			panEl.instance.style('cursor', panElCursor);
			me.removeClass('blur');
		});
		
		/*
		me.doc().on('mousedown', function(e){
			if(e.clientX > bound.x+bound.width)
				scrollX = 10;
			if(e.clientY > bound.y+bound.height)
				scrollY = 10;
			
			var h = selectionRect.height();
			
			viewb = me.mWorksheet.viewbox();
			console.log(h,scrollY);
			viewb.x += scrollX;
			viewb.y += scrollY;
			setTimeout(function(){
				selectionRect.width(selectionRect.width() + scrollX);
				selectionRect.height(h + scrollY);
				
			},100);
			me.mWorksheet.viewbox(viewb);
							
		});
		*/
		return me;
	},
	
	getWorkspace: function(){
		return this.mWorkspace || this;
	}
});

exSVG.Worksheet.prototype.plugins.workspace = {name: 'Panzoom', initor: 'initWorkspace'};

}(this));
