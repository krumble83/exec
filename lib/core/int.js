
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
				if(e.keyCode == 13)
					input.blur();				
			});
		t.MakeLiteralNode('core.int');
		
	});

	n = pack.Node('random', 'Random Integer').Keywords('make random');
	n.Input('min', 'core.type.int');
	n.Input('max', 'core.type.int');
	n.Output('out', 'core.type.int', 'Return Value');
	

/******************************************************************
	Arithmetic Operators
******************************************************************/	

	pack.Category('Integer/Arithmetic');
	n = pack.Node('add', 'Int + Int').ImportTpl('tpl.op.add', 'core.type.int', 'Int');
	n = pack.Node('sub', 'Int - Int').ImportTpl('tpl.op.sub', 'core.type.int', 'Int');
	n = pack.Node('multiply', 'Int * Int').ImportTpl('tpl.op.mul', 'core.type.int', 'Int');
	//n = pack.Node('divide', 'Int / Int').ImportTpl('tpl.op.div', 'core.type.int', 'Int');

/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Integer/Comparators');
	n = pack.Node('equal', 'Equal (Int)').Import('tpl.node.eq');
	n.Input('a', 'core.type.int');
	n.Input('b', 'core.type.int');
	n.Output('out', 'core.type.bool');
	
	pack.Node('lt').Import('equal').Import('tpl.node.lt').Title('Lower Than (Int)');
	pack.Node('gt').Import('equal').Import('tpl.node.gt').Title('Gretter Than (Int)');
	pack.Node('lte').Import('equal').Import('tpl.node.lte').Title('Lower Than or Equal (Int)');
	pack.Node('gte').Import('equal').Import('tpl.node.gte').Title('Gretter Than or Equal (Int)');
	pack.Node('neq').Import('equal').Import('tpl.node.neq').Title('Not Equal (Int)');
	
});

