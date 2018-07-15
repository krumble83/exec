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

