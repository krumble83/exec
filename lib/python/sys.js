;(function() {
"use strict";

exLIB.package('python.sys', function(pack){
	
	pack.Category('Python/Sys');
	
	pack.Class('sys', 'sys', function(){
		this.Member('argv', 'core.type.string').Array().Getter();
	});
	
});

})(this);
