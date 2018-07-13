;(function() {
"use strict";

var defs = {};


SVG.extend(SVG.Color, {
    darker: function(amount){
        return new SVG.Color({r:parseInt(this.r * (1 - amount)), g:parseInt(this.g * (1 - amount)), b:parseInt(this.b * (1 - amount))});
    },

    lighter: function(amount){

    }
});

SVG.getDef = function(id, el, cb){
	//console.log('--', defs[id]);
	
	if(!defs[id])
		defs[id] = cb().id(id);
	return defs[id];
}


}).call(this);