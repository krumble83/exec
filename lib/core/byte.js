

exLIB.package('core.byte', function(pack){
	
	pack.Category('Byte');

	
	;exLIB.package('core.type', function(pack){
		pack.Type('byte').Label('Byte').Color('#016e64').MakeLiteralNode('core.byte');
	});


/******************************************************************
	Common
******************************************************************/	
	n = pack.Node('random').ImportTpl('tpl.random', 'core.type.byte', 'Byte');
	n = pack.Node('min').ImportTpl('tpl.min', 'core.type.byte', 'Byte');
	n = pack.Node('max').ImportTpl('tpl.max', 'core.type.byte', 'Byte');
	n = pack.Node('clamp').ImportTpl('tpl.clamp', 'core.type.byte', 'Byte');
	n = pack.Node('between').ImportTpl('tpl.between', 'core.type.byte', 'Byte');
		
/******************************************************************
	Arithmetic Operators
******************************************************************/	
	pack.Category('Byte/Arithmetic');
	n = pack.Node('add').ImportTpl('tpl.op.add', 'core.type.byte', 'Byte');
	n = pack.Node('sub').ImportTpl('tpl.op.sub', 'core.type.byte', 'Byte');
	n = pack.Node('multiply').ImportTpl('tpl.op.mul', 'core.type.byte', 'Byte');
	n = pack.Node('divide').ImportTpl('tpl.op.div', 'core.type.byte', 'Byte');

/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Byte/Comparators');
	n = pack.Node('eq').ImportTpl('tpl.op.eq', 'core.type.byte', 'Byte');
	n = pack.Node('neq').ImportTpl('tpl.op.neq', 'core.type.byte', 'Byte');
	n = pack.Node('lt').ImportTpl('tpl.op.lt', 'core.type.byte', 'Byte');
	n = pack.Node('gt').ImportTpl('tpl.op.gt', 'core.type.byte', 'Byte');
	n = pack.Node('lte').ImportTpl('tpl.op.lte', 'core.type.byte', 'Byte');
	n = pack.Node('gte').ImportTpl('tpl.op.gte', 'core.type.byte', 'Byte');
	
	
	
	
});

