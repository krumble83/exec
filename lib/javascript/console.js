;exLIB.package('javascript.console', function(pack){

	pack.Category('Javascript/Console').Color('#9c39da');

	n = pack.Node('log', 'console.log()')
		.Keywords('log console,console log')
		.MakeEntry().MakeExit();
	n.Input('param', 'core.wildcards', 'Param [0]').Group(1);
	n.Output('add', 'special.add', 'Add Param').attr('target', 'param');	
});



;exLIB.load('javascript.console', function(ctx){


/****************************************************************************************
	
****************************************************************************************/
ctx.registerNode('log', {
	categories: ['Javascript/console'],
	keywords: 'log console',
	title:'console.log()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'param', type: 'core.wildcards', label:'Param [0]'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'add', type: 'special.add', target: 'param', label: 'Add Param'}
	]
});

ctx.registerNode('assert', {
	categories: ['Javascript/console'],
	keywords: 'assert console',
	title:'console.assert()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'condition', type: 'core.type.bool'},
		{id: 'param1', type: 'core.wildcards'},
		{id: 'param2', type: 'core.wildcards', optional: true},
		{id: 'param3', type: 'core.wildcards', optional: true},
		{id: 'param4', type: 'core.wildcards', optional: true},
		{id: 'param5', type: 'core.wildcards', optional: true},
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('group', {
	categories: ['Javascript/console'],
	keywords: 'group console',
	title:'console.group()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'name', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});


ctx.registerNode('groupend', {
	categories: ['Javascript/console'],
	keywords: 'end group console,group end console',
	title:'console.groupEnd()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'name', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

});