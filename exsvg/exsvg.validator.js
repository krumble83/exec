;(function() {
"use strict";

var validators = [];

exSVG.plugin(exSVG.Worksheet, {

	init: function() {
		var me = this;
		return me;
	},
	
	addValidator: function(validator){
		assert(typeof validator === 'function');
		validators.push(validators);
	},
	
	checkGraph: function(){
		//console.log('exSVG.Validator.checkGraph()');
		var me = this;
		
		// check for unauthoriezd duplicates
		me.getNodes();
	}
});


exSVG.plugin(exSVG.Node, {

	init: function() {
		var me = this
		, worksheet = me.parent(exSVG.Worksheet);
		me.on('add', worksheet.checkGraph, worksheet);
	}
});


}).call(this);
