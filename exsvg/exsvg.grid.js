;(function() {
"use strict";

var DRAGSMALL;

SVG.extend(exSVG.Worksheet, {

	initGrid: function(options) {
		var me = this
		, workSpace = (me.getWorkspace) ? me.getWorkspace() : me.doc();
		
		if(!workSpace)
			return;
		console.log(workSpace);
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
	}
});

exSVG.Worksheet.prototype.plugins.grid = {name: 'Grid', initor: 'initGrid'}

}(this));
