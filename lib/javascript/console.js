;exLIB.package('javascript.console', function(pack){

	pack.Category('Javascript/Console');

	n = pack.Node('log', 'console.log()')
		.Import('tpl.node.function')
		.Keywords('log console,console log')
		.Symbol('lib/javascript/js.png')
		.MakeEntry().MakeExit();
	n.Input('msg', 'core.type.string', 'Message');
	n.Input('param', 'core.wildcards', 'Param [0]').Group(1);
	n.Output('add', 'special.add', 'Add Param').attr('target', 'param');
	

	n = pack.Node('warn', 'console.warn()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('warn console,console warn')
		.MakeEntry().MakeExit();
	n.Input('msg', 'core.type.string', 'Message');
	n.Input('param', 'core.wildcards', 'Param [0]').Group(1);
	n.Output('add', 'special.add', 'Add Param').attr('target', 'param');

	
	n = pack.Node('error', 'console.error()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('error console,console error')
		.MakeEntry().MakeExit();
	n.Input('msg', 'core.type.string', 'Message');
	n.Input('param', 'core.wildcards', 'Param [0]').Group(1);
	n.Output('add', 'special.add', 'Add Param').attr('target', 'param');

	
	n = pack.Node('assert', 'console.assert()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('assert console,console assert')
		.MakeEntry().MakeExit();
	n.Input('assertion', 'core.type.bool');
	n.Input('msg', 'core.type.string', 'Message');
	n.Input('param', 'core.wildcards', 'Param [0]').Group(1);
	n.Output('add', 'special.add', 'Add Param').attr('target', 'param');

	
	n = pack.Node('dir', 'console.dir()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('dir console,console dir')
		.MakeEntry().MakeExit()
		.Input('object', 'core.wildcards');

	n = pack.Node('time', 'console.time()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('time console,console time')
		.MakeEntry().MakeExit()
		.Input('label', 'core.type.string');
		
	n = pack.Node('timeend', 'console.timeEnd()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('timeend console,console timeend')
		.MakeEntry().MakeExit()
		.Input('label', 'core.type.string');

		
	n = pack.Node('count', 'console.count()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('count console,console count')
		.MakeEntry().MakeExit()
		.Input('label', 'core.type.string');


	n = pack.Node('clear', 'console.clear()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('clear console,console clear')
		.MakeEntry().MakeExit();
	
	
	n = pack.Node('group', 'console.group()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('group console,console group')
		.MakeEntry().MakeExit();

	n = pack.Node('groupend', 'console.groupend()')
		.Import('tpl.node.function')
		.Symbol('lib/javascript/js.png')
		.Keywords('group console,console group')
		.MakeEntry().MakeExit();
			
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