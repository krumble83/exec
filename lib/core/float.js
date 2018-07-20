
;exLIB.package('core.float', function(pack){

	pack.Category('Float');

	;exLIB.package('core.type', function(pack){
		var t = pack.Type('float', 'Float')
			.Inherits('core.type.scalar')
			.Color('#9FFF44')
			.Tooltip('Any floating number');
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
					, 110 // point
				].indexOf(e.keyCode) == -1)
					e.preventDefault();
				if(e.keyCode == 13){
					input.blur();
					this.parent(exSVG.Worksheet).focus();
				}
			});
		t.MakeLiteralNode('core.float');
		
	});

	
/******************************************************************
	Common
******************************************************************/	
	n = pack.Node('random').ImportTpl('tpl.random', 'core.type.float', 'Float');
	n = pack.Node('min').ImportTpl('tpl.min', 'core.type.float', 'Float');
	n = pack.Node('max').ImportTpl('tpl.max', 'core.type.float', 'Float');
	n = pack.Node('clamp').ImportTpl('tpl.clamp', 'core.type.float', 'Float');
	n = pack.Node('between').ImportTpl('tpl.between', 'core.type.float', 'Float');
		
/******************************************************************
	Arithmetic Operators
******************************************************************/	
	pack.Category('Float/Arithmetic');
	n = pack.Node('add').ImportTpl('tpl.op.add', 'core.type.float', 'Float');
	n = pack.Node('sub').ImportTpl('tpl.op.sub', 'core.type.float', 'Float');
	n = pack.Node('multiply').ImportTpl('tpl.op.mul', 'core.type.float', 'Float');
	n = pack.Node('divide').ImportTpl('tpl.op.div', 'core.type.float', 'Float');

/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Float/Comparators');
	n = pack.Node('eq').ImportTpl('tpl.op.eq', 'core.type.float', 'Float');
	n = pack.Node('neq').ImportTpl('tpl.op.neq', 'core.type.float', 'Float');
	n = pack.Node('lt').ImportTpl('tpl.op.lt', 'core.type.float', 'Float');
	n = pack.Node('gt').ImportTpl('tpl.op.gt', 'core.type.float', 'Float');
	n = pack.Node('lte').ImportTpl('tpl.op.lte', 'core.type.float', 'Float');
	n = pack.Node('gte').ImportTpl('tpl.op.gte', 'core.type.float', 'Float');

	
});

