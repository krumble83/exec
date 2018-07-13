
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




;exLIB.load('core.bool', function(ctx){

/*
ctx.registerType('core.type.bool', {
	inherits: 'core.variable',
	label: 'Boolean', 
	color: '#940000',
	editor: 'bool',
});
*/
ctx.registerNode('makeliteral', {
	categories: ['Boolean'],
	keywords: 'make bool',
	title:'Make Literal Boolean',
	color: '#555',
	inputs: [
		{id: 'value', type: 'core.type.bool'}
	],
	outputs: [
		{id: 'boolean', type: 'core.type.bool'}
	]
});

ctx.registerNode('toint', {
	categories: ['Boolean'],
	keywords: 'bool to int,to int',
	title:'Bool To Integer',
	color: '#555',
	inputs: [
		{id: 'bool', type: 'core.type.bool'}
	],
	outputs: [
		{id: 'integer', type: 'core.type.int'}
	]
});

ctx.registerNode('fromint', {
	categories: ['Boolean'],
	keywords: 'bool from int,from int',
	title:'Bool From Integer',
	color: '#555',
	inputs: [
		{id: 'integer', type: 'core.type.int'}
	],
	outputs: [
		{id: 'bool', type: 'core.type.bool'}
	]
});

ctx.registerNode('buildstring', {
	categories: ['Utilities/String'],
	keywords: 'build string, bool to string, to string, tostring',
	title:'BuildString (Boolean)',
	color: '#aaeea0',
	inputs: [
		{id: 'prefix', type: 'core.type.string'},
		{id: 'boolean', type: 'core.type.bool'},
		{id: 'suffix', type: 'core.type.string'}
	],
	outputs: [
		{id: 'out', type: 'core.type.string', label:'Return Value'}
	]
});

/************************************************************************
	Operators
************************************************************************/
ctx.registerNode('and', {
	categories: ['Boolean/Operators'],
	keywords: 'and',
	title: 'AND',
	color: '#555',
	subtitle: '&',
	inputs: [
		{id: 'in1', type: 'core.type.bool'},
		{id: 'in2', type: 'core.type.bool'}
	],
	outputs: [
		{id: 'out', type: 'core.type.bool'}
	],
	ctor: 'NodeOp'
});

ctx.registerNode('not', {
	categories: ['Boolean/Operators'],
	keywords: 'not',
	title: 'Not',
	color: '#555',
	subtitle: '!',
	inputs: [
		{id: 'in', type: 'core.type.bool'},
	],
	outputs: [
		{id: 'out', type: 'core.type.bool'}
	],
	ctor: 'NodeOp'
});

ctx.registerNode('or', {
	import: 'and',
	keywords: 'or',
	subtitle: '||',
	title:'OR'
});

ctx.registerNode('nand', {
	import: 'and',
	keywords: 'nand',
	title:'NAND'
});

ctx.registerNode('xand', {
	import: 'and',
	keywords: 'xand',
	title:'XAND'
});

ctx.registerNode('nor', {
	import: 'and',
	keywords: 'nor',
	title:'NOR'
});

ctx.registerNode('xor', {
	import: 'and',
	keywords: 'xor',
	title:'XOR'
});

ctx.registerNode('xnor', {
	import: 'and',
	keywords: 'xnor',
	title:'XNOR'
});



});
