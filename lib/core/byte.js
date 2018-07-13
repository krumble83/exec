

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



;exLIB.load('core.byte', function(ctx){
	
ctx.registerType('core.type.byte', {
	label: 'Byte', 
	color: '#016e64',
	ctor: 'PinInput'
});

ctx.registerNode('makeliteral', {
	categories: ['Utilities/Byte'],
	keywords: 'make byte',
	title:'Make Literal Byte',
	color: '#555',
	inputs: [
		{id: 'value', type: 'core.type.byte'}	
	],
	outputs: [
		{id: 'value', type: 'core.type.byte'}	
	]
});

/******************************************************************
	Operators
******************************************************************/	
ctx.registerNode('equal', {
	import: 'core.operator',
	categories: ['Byte/Operators'],
	keywords: '==,equal',
	title:'Equal (Byte)',
	subtitle: '==',
	inputs: [
		{id: 'a', type: 'core.type.byte'},
		{id: 'b', type: 'core.type.byte'}
	],
	outputs: [
		{id: 'out', type: 'core.type.bool'}
	]
});

ctx.registerNode('lt', {
	import: 'equal',
	keywords: 'lt,<',
	title:'Lower Than (Byte)',
	subtitle: '<'
});

ctx.registerNode('gt', {
	import: 'equal',
	keywords: 'gt,>',
	title:'Gretter Than (Byte)',
	subtitle: '>'
});

ctx.registerNode('lte', {
	import: 'equal',
	keywords: 'lte,<=',
	title:'Lower Than or Equal (Byte)',
	subtitle: '<='
});

ctx.registerNode('gte', {
	import: 'equal',
	keywords: 'gte,>=',
	title:'Gretter Than or Equal (Byte)',
	subtitle: '>='
});

ctx.registerNode('neq', {
	import: 'equal',
	keywords: 'neq,!=,<>',
	title:'Not Equal (Byte)',
	subtitle: '!='
});

});