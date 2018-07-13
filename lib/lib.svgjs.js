;exLIB.load('svgjs', function(ctx){


/****************************************************************************************
	Data types
****************************************************************************************/	
ctx.registerType('svgjs.group', {
	inherits: 'core.object',
	label: 'Ex Package', 
});


/****************************************************************************************
	
****************************************************************************************/
ctx.registerNode('addClass', {
	categories: ['Builder/Svg.js'],
	keywords: 'add class',
	title:'addClass',
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