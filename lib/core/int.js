;(function() {
"use strict";

;exLIB.package('core.int', function(pack){

	pack.Category('Integer');

	;exLIB.package('core.type', function(pack){
		var t = pack.Type('int', 'Integer')
			.Inherits('core.type.scalar')
			.Color('#1edfab')
			.Tooltip('Any non floating number');
		t.Editor('input')
			.data('keydown', function(e, input){
				//console.log(e.keyCode);
				if((e.keyCode == 67 || e.keyCode == 88) && e.ctrlKey) // Ctrl+C Ctrl+X
					return;
				if([8 // back
					, 37 // left
					, 39 // right
					, 46 // delete
					, 36,35 // end - start 					
					, 96,97,98,99,100,101,102,103,104,105 //digits
					, 109 // minus
				].indexOf(e.keyCode) == -1)
					e.preventDefault();
				if(e.keyCode == 13){
					input.blur();
					this.parent(exSVG.Worksheet).focus();
				}
			});
		t.MakeLiteralNode('core.int');
		
	});
	

/******************************************************************
	Common
******************************************************************/	
	var n = pack.Node('random').ImportTpl('tpl.random', 'core.type.int', 'Int');
	n = pack.Node('min').ImportTpl('tpl.min', 'core.type.int', 'Int');
	n = pack.Node('max').ImportTpl('tpl.max', 'core.type.int', 'Int');
	n = pack.Node('clamp').ImportTpl('tpl.clamp', 'core.type.int', 'Int');
	n = pack.Node('between').ImportTpl('tpl.between', 'core.type.int', 'Int');
		
/******************************************************************
	Arithmetic Operators
******************************************************************/	
	pack.Category('Integer/Arithmetic');
	n = pack.Node('add').ImportTpl('tpl.op.add', 'core.type.int', 'Int');
	n = pack.Node('sub').ImportTpl('tpl.op.sub', 'core.type.int', 'Int');
	n = pack.Node('multiply').ImportTpl('tpl.op.mul', 'core.type.int', 'Int');
	n = pack.Node('divide').ImportTpl('tpl.op.div', 'core.type.int', 'Int');

/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Integer/Comparators');
	n = pack.Node('eq').ImportTpl('tpl.op.eq', 'core.type.int', 'Int');
	n = pack.Node('neq').ImportTpl('tpl.op.neq', 'core.type.int', 'Int');
	n = pack.Node('lt').ImportTpl('tpl.op.lt', 'core.type.int', 'Int');
	n = pack.Node('gt').ImportTpl('tpl.op.gt', 'core.type.int', 'Int');
	n = pack.Node('lte').ImportTpl('tpl.op.lte', 'core.type.int', 'Int');
	n = pack.Node('gte').ImportTpl('tpl.op.gte', 'core.type.int', 'Int');

});

}());
