;exLIB.load('core.builder', function(ctx){


/****************************************************************************************
	Data types
****************************************************************************************/	
ctx.registerType('core.builder.package', {
	inherits: 'core.object',
	label: 'Ex Package', 
});

ctx.registerType('core.builder.pin', {
	inherits: 'core.type.struct',
	label: 'ExNode Pin',
	categories: ['Builder/Library'],
	members: [
		{id: 'id', type: 'core.type.string'},
		{id: 'type', type: 'core.type.string'},
		{id: 'label', type: 'core.type.string', optional: true},
		{id: 'group', type: 'core.type.int', optional: true},
		{id: 'optional', type: 'core.type.int', optional: true}
	]
});

/****************************************************************************************
	Selectors
****************************************************************************************/
ctx.registerNode('registerNode', {
	categories: ['Builder/Library'],
	keywords: 'register Node',
	title:'registerNode',
	inputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'name', type: 'core.type.string'},
		{id: 'category', type: 'core.type.string'},
		{id: 'package', type: 'core.builder.package'},
		{id: 'keywords', type: 'core.type.string'},
		{id: 'inputs', type: 'core.builder.pin[]'},
		{id: 'outputs', type: 'core.builder.pin[]'},
		{id: 'title', type: 'core.type.string', optional: true},
		{id: 'tooltip', type: 'core.type.string', optional: true},
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

});