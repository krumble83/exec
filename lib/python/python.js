;(function() {
"use strict";

;exLIB.package('python.type', function(pack){
	
	this.Category('Python');
	
	var s = this.Struct('stringpair', 'Python Pair (String)');
	s.Member('name', 'core.type.string');
	s.Member('value', 'core.wildcards');
	s.MakeAccessorNodes('python.type'); 
	
});


})(this);
