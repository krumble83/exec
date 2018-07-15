

exLIB.package('core.byte', function(pack){
	
	pack.Category('Byte');

	
	;exLIB.package('core.type', function(pack){
		pack.Type('byte').Label('Byte').Color('#016e64').MakeLiteralNode('core.byte');
	});

	n = pack.Node('equal', 'Equal (Byte)').Category('Byte/Operators').Keywords('==,equal').Subtitle('==');
	n.Input('a', 'core.type.byte');
	n.Input('b', 'core.type.byte');
	n.Output('out', 'core.type.bool');

	pack.Node('lt', 'Lower Than (Byte)').Import('equal').Keywords('lt,<').Subtitle('<');
	pack.Node('gt', 'Gretter Than (Byte)').Import('equal').Keywords('gt,>').Subtitle('>');
	pack.Node('lte', 'Lower Than or Equal (Byte)').Import('equal').Keywords('lte,<=').Subtitle('<=');
	pack.Node('gte', 'Gretter Than or Equal (Byte)').Import('equal').Keywords('gte,>=').Subtitle('>=');
	pack.Node('neq', 'Not Equal (Byte)').Import('equal').Keywords('neq,!=,<>').Subtitle('!=');

});

