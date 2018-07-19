;(function() {
"use strict";

var DRAGSMALL
, panStart = {x:null, y:null, pan:false};

exSVG.plugin(exSVG.Worksheet, {

	init: function() {
		//console.log('exSVG.Worksheet.initWorkspace()');
		var me = this
		, panEl
		, panElCursor;	
		
		me.mWorkspace = me.rect(100000,100000)
			.x(-50000)
			.y(-50000)
			.back()
			.addClass('workspace')
		me.line(0, -50000, 0, 50000).stroke({width: 1, color: '#000'}).back();
		me.line(-50000, 0, 50000, 0).stroke({width: 1, color: '#000'}).back();
		
		me.size('100%', '100%')
			.panZoom({zoomMin: 0.05, zoomMax: 1, zoomFactor: 0.08});

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


exSVG.plugin(exSVG.Node, {
	
	init: function(){
		var me = this
		, worksheet = me.parent(exSVG.Worksheet);
		
		me.on('contextmenu.workspace', function(e){
			if(panStart.pan){
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
			}
		});
	}
});

}(this));
