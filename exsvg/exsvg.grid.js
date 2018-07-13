;(function() {
"use strict";

var DRAGSMALL;

SVG.extend(exSVG.Worksheet, {

	initGrid: function(options) {
		var me = this;
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
		
		me.mGrid = me.rect(100000,100000)
			.fill('url(#' + m.id() + ')')
			.x(-50000)
			.y(-50000)
			.back()
			.addClass('grid')
		me.line(0, -50000, 0, 50000).stroke({width: 1, color: '#000'}).back();
		me.line(-50000, 0, 50000, 0).stroke({width: 1, color: '#000'}).back();
		me.mGrid.back();
		
		me.on('zoom', function(e){
			
		});
		
		return me;
	},
	
	snapToGrid: function(x, y){
		var small = DRAGSMALL;
		return {x:parseInt(x/small)*small, y:parseInt(y/small)*small};
	},
	
	getGrid: function(){
		return this.mGrid;
	}
});

exSVG.Worksheet.prototype.plugins.grid = {name: 'Grid', initor: 'initGrid'}

}(this));
