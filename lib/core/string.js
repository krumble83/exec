
;exLIB.package('core.string', function(pack){

	pack.Category('String');

	;exLIB.package('core.type', function(pack){
		var t = pack.Type('string', 'String')
			.Inherits('core.type.scalar')
			.Color('#f0f')
			.Tooltip('Any sequence of characters');
		t.Editor('input');
		t.MakeLiteralNode('core.string');
	});

});






















;exLIB.load('core.string', function(ctx){

ctx.registerType('core.type.string', {
	inherits: 'core.type.editable',
	label: 'String', 
	color: '#fc00d3',
	ctype: 'String'
});

ctx.registerNode('makeliteral', {
	import: 'core.function',
	categories: ['String'],
	keywords: 'make string,new string,string,create string',
	title:'Make Literal String',
	inputs: [
		{id: 'input', type: 'core.type.string'}
	],
	outputs: [
		{id: 'value', type: 'core.type.string'}
	]
});

ctx.registerNode('append', {
	import: 'core.function',
	categories: ['String'],
	keywords: 'concat,join,merge',
	title:'Append (String)',
	symbol: 'lib/img/string.png',
	inputs: [
		{id: 'a', type: 'core.type.string'},
		{id: 'b', type: 'core.type.string'}
	],
	outputs: [
		{id: 'value', type: 'core.type.string', label:'Return Value'},
		{id: 'add', type: 'special.add', label: 'Add pin', target: 'b'}
	],
	tooltip: 'Append the content of "add" to the string "value"<br />You can Append more than one value with the "Add pin" button'
});

ctx.registerNode('contains', {
	import: 'core.function',
	categories: ['String'],
	keywords: 'contains',
	title:'Contains',
	inputs: [
		{id: 'searchin', type: 'core.type.string', label: 'Search In'},
		{id: 'substring', type: 'core.type.string'},
		{id: 'case', type: 'core.type.bool', label: 'Case Sensitive', optional: true}
	],
	outputs: [
		{id: 'value', type: 'core.type.bool', label:'Return Value'}
	]
});

ctx.registerNode('replace', {
	import: 'core.function',
	categories: ['String'],
	keywords: 'replace',
	title:'Replace',
	inputs: [
		{id: 'source', type: 'core.type.string', label: 'Source'},
		{id: 'search', type: 'core.type.string'},
		{id: 'replace', type: 'core.type.string'}
	],
	outputs: [
		{id: 'value', type: 'core.type.string', label:'Return Value'}
	]
});

/******************************************************************
	Operators
******************************************************************/	
ctx.registerNode('equal', {
	import: 'core.function',
	categories: ['String/Operators'],
	keywords: 'equal',
	title:'Equal (String)',
	subtitle: '==',
	ctor: 'NodeOp',
	inputs: [
		{id: 'a', type: 'core.type.string', tooltip: 'First String value to compare to'},
		{id: 'b', type: 'core.type.string', tooltip: 'Second String value to compare to'}
	],
	outputs: [
		{id: 'out', type: 'core.type.bool', tooltip: 'Result of operation, True if string are equal, False otherwise<br /><br />Note: This version of Equal is Case Sensitive.'}
	]
});

});