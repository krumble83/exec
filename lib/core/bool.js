
exLIB.package('core.bool', function(pack){
	
	pack.Category('Boolean');

	exLIB.package('core.type', function(pack){
		var t = pack.Type('bool', 'Boolean')
			.Inherits('core.type.scalar')
			.Color('#940000')
			.Tooltip('True or False');
		t.Editor('bool');
		t.MakeLiteralNode('core.bool');
	});
	
	n = pack.Node('toint', 'Bool To Integer').Color('#555').Keywords('bool to int,to int');
	n.Input('bool', 'core.type.bool');
	n.Output('integer', 'core.type.int').Tooltip('Value = 0 for False, 1 for True');
	
	n = pack.Node('fromint', 'Bool From Integer').Color('#555').Keywords('bool from int,from int');
	n.Input('integer', 'core.type.int');
	n.Output('bool', 'core.type.bool');
	
	n = pack.Node('buildstring', 'BuildString (Boolean)').Color('#aaeea0').Keywords('build string, bool to string, to string, tostring');
	n.Input('prefix', 'core.type.string');
	n.Input('boolean', 'core.type.bool');
	n.Input('suffix', 'core.type.string');
	n.Output('out', 'core.type.string', 'Return Value');
	
	n = pack.Node('and', 'AND').Color('#555').Category('Boolean/Operators').Keywords('and').Subtitle('&').Ctor('NodeOp');
	n.Input('in1', 'core.type.bool');
	n.Input('in2', 'core.type.bool');
	n.Output('out', 'core.type.bool');
	n.select('category[name="Boolean"]').first().remove();
	
	n = pack.Node('not', 'NOT').Color('#555').Category('Boolean/Operators').Keywords('not,!').Subtitle('!').Ctor('NodeOp');
	n.Input('in', 'core.type.bool');
	n.Output('out', 'core.type.bool');
	n.select('category[name="Boolean"]').first().remove()
	
	n = pack.Node('or').Import('and').Keywords('or,||').Title('OR').Subtitle('||').select('category[name="Boolean"]').first().remove();
	n = pack.Node('nand').Import('and').Keywords('nand').Title('NAND').Subtitle('NAND').select('category[name="Boolean"]').first().remove();
	n = pack.Node('xand').Import('and').Keywords('xand').Title('XAND').Subtitle('XAND').select('category[name="Boolean"]').first().remove();
	n = pack.Node('nor').Import('and').Keywords('nor').Title('NOR').Subtitle('NOR').select('category[name="Boolean"]').first().remove();
	n = pack.Node('xor').Import('and').Keywords('xor').Title('XOR').Subtitle('XOR').select('category[name="Boolean"]').first().remove();
	n = pack.Node('xnor').Import('and').Keywords('xnor').Title('XNOR').Subtitle('XNOR').select('category[name="Boolean"]').first().remove();
});

