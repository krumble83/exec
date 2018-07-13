;exLIB.load('python.base', function(ctx){

ctx.registerType('python.type.tuple', {
	inherits: 'core.object',
	label: 'Python tuple'
});


ctx.registerType('python.type.pair', {
	inherits: 'core.type.struct',
	categories: ['Python'],
	label: 'Python Pair',
	members: [
		{id: 'name', type: 'core.type.string'},
		{id: 'value', type: 'core.type.scalars'}
	]
});



ctx.registerNode('base', {
	import: 'core.function',
	color: '#87663f',
	symbol: 'lib/img/python.png'
});


});