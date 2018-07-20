;(function() {
"use strict";

var DRAGSMALL;

exSVG.plugin(exSVG.Worksheet, {

	init: function(options) {
		var me = this
		, workSpace = (me.getWorkspace) ? me.getWorkspace() : me.doc();
		
		if(!workSpace)
			return;
		var options = options || {};
		options.small = options.small || 16;
		options.big = options.big || 128;
		
		me.mGridOptions = options;
		DRAGSMALL = options.small;
	
		var s = me.pattern(options.small, options.small, function(add) {
			add.path('M ' + (options.small) + ' 0 L 0 0 0 ' + (options.small)).fill('none')
		}).attr('patternUnits', 'userSpaceOnUse').addClass('smallGrid')

		var m = me.pattern(options.big, options.big, function(add) {
			add.rect(options.big, options.big).fill('url(#' + s.id() + ')')
			add.path('M ' + (options.big) + ' 0 L 0 0 0 ' + (options.big)).fill('none')
		}).attr('patternUnits', 'userSpaceOnUse').addClass('medGrid')
		
		
		workSpace.fill('url(#' + m.id() + ')')
			.removeClass('workspace')
			.addClass('grid');
		
		if(workSpace != me.doc())
			workSpace.back();
		return me;
	},
	
	snapToGrid: function(x, y){
		var small = DRAGSMALL;
		if(x.x)
			return {x:parseInt(x.x/small)*small, y:parseInt(x.y/small)*small};
		return {x:parseInt(x/small)*small, y:parseInt(y/small)*small};
	},
	
	getGrid: function(){
		return (this.getWorkspace) ? this.getWorkspace() : this;
	},
	
});

exSVG.plugin(exSVG.SelectionZ, {
	x: function(x){
		//console.log('exSVG.Node.x()');
		var me = this
		, ret
		, selection
		, snap;
		
		if(arguments.length > 0){
			snap = me.mWorksheet.snapToGrid(x,0);
			if(snap.x != x)
				ret = SVG.G.prototype.x.call(me, snap.x);
			else
				return SVG.G.prototype.x.apply(me, arguments);
			//console.log(x, snap);
			selection = me.nodes();
			selection.fire('move');
			return ret;
		}
		return SVG.G.prototype.x.apply(me, arguments);
	},
				
	y: function(y){
		//console.log('exSVG.Node.y()');
		var me = this
		, ret
		, selection
		, snap;
		
		if(arguments.length > 0){
			snap = me.mWorksheet.snapToGrid(0,y);
			if(snap.y != y)
				ret = SVG.G.prototype.y.call(me, snap.y);
			else
				return SVG.G.prototype.y.apply(me, arguments);
			//console.log(x, snap);
			selection = me.nodes();			
			selection.fire('move');
			return ret;
		}
		return SVG.G.prototype.y.apply(me, arguments);
	},

	zmove: function(){
		console.log('exnodebase.move');
		var me = this
		, ret = SVG.G.prototype.move.apply(me, arguments)
		, selection
		, snap;
		
		if(arguments.length > 0){
			selection = me.nodes();			
			selection.fire('move');
		}
		return ret;
	}
});

}(this));
