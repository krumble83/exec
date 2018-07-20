
;exLIB.package('core.float', function(pack){

	pack.Category('Float');

	;exLIB.package('core.type', function(pack){
		var t = pack.Type('float', 'Float')
			.Inherits('core.type.scalar')
			.Color('#004040')
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

	n = pack.Node('random', 'Random Float').Keywords('make random');
	n.Input('min', 'core.type.float');
	n.Input('max', 'core.type.float');
	n.Output('out', 'core.type.float', 'Return Value');

	
	
/******************************************************************
	Arithmetic Operators
******************************************************************/	

	pack.Category('Float/Arithmetic');
	n = pack.Node('add', 'Float + Float').ImportTpl('tpl.op.add', 'core.type.float', 'Float');
	n = pack.Node('sub', 'Float - Float').ImportTpl('tpl.op.sub', 'core.type.float', 'Float');
	n = pack.Node('multiply', 'Float * Float').ImportTpl('tpl.op.mul', 'core.type.float', 'Float');
	n = pack.Node('divide', 'Float / Float').ImportTpl('tpl.op.div', 'core.type.float', 'Float');
	n = pack.Node('modulo', 'Float % Float').ImportTpl('tpl.op.mod', 'core.type.float', 'Float');



/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Float/Comparators');
	n = pack.Node('equal', 'Equal (Float)').Import('tpl.node.eq');
	n.Input('a', 'core.type.float');
	n.Input('b', 'core.type.float');
	n.Output('out', 'core.type.bool');
	
	pack.Node('lt').Import('equal').Import('tpl.node.lt').Title('Lower Than (Float)');
	pack.Node('gt').Import('equal').Import('tpl.node.gt').Title('Gretter Than (Float)');
	pack.Node('lte').Import('equal').Import('tpl.node.lte').Title('Lower Than or Equal (Float)');
	pack.Node('gte').Import('equal').Import('tpl.node.gte').Title('Gretter Than or Equal (Float)');
	pack.Node('neq').Import('equal').Import('tpl.node.neq').Title('Not Equal (Float)');	
	
	
});

