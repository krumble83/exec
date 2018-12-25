;exLIB.package('javascript', function(pack){

	pack.Category('Javascript');

	var n = pack.Node('typeof', 'typeof')
		.Import('tpl.node.pure')
	n.Input('in', 'core.wildcards');
	n.Output('type', 'core.type.string');

	
	n = pack.Node('setTimeout', 'setTimeout()')
		.Import('tpl.node.function')
		.MakeEntry().MakeExit()
	n.Input('timeout', 'core.type.int');
	n.Output('execute', 'core.exec');	
	n.Output('id', 'core.type.int');

	n = pack.Node('clearTimeout', 'clearTimeout()')
		.Import('tpl.node.function')
		.MakeEntry().MakeExit()
	n.Input('id', 'core.type.int');
	
	
	n = pack.Node('setInterval', 'setInterval()')
		.Import('tpl.node.function')
		.MakeEntry().MakeExit()
	n.Input('interval', 'core.type.int');
	n.Output('execute', 'core.exec');
	n.Output('id', 'core.type.int');

	n = pack.Node('clearInterval', 'clearInterval()')
		.Import('tpl.node.function')
		.MakeEntry().MakeExit()
	n.Input('id', 'core.type.int');

	
	pack.Category('Javascript/Array');
	n = pack.Node('array.join', 'join').MakeEntry().MakeExit();
	n.Input('array', 'core.type.string').Array();
	n.Input('token', 'core.type.string');
	n.Output('out', 'core.type.string');
	
	
});
