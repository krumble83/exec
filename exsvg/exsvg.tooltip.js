;(function() {
"use strict";

SVG.extend(SVG.Element, {
	
	tooltip: function(tooltip){
		var me = this;
		me.doc().group()
			.rect(100,20)
			.move(200,100)
			.addClass('tooltip');
			
		me.on('mouseover', function(e){

		});

		me.on('mouseout', function(e){

		});
		
	}
})

}());
