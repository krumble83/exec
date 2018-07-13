;exLIB.package('javascript', function(pack){

	pack.Category('Javascript');

	var n = pack.Node('typeof', 'typeof');
	n.Input('in', 'core.type.string');
	n.Output('type', 'core.type.string');
	
	pack.Category('Javascript/String');
	n = pack.Node('string.split', 'split').MakeEntry().MakeExit();
	n.Input('in', 'core.type.string');
	n.Input('token', 'core.type.string');
	n.Output('array', 'core.type.string[]');

	pack.Category('Javascript/Array');
	n = pack.Node('array.join', 'join').MakeEntry().MakeExit();
	n.Input('array', 'core.type.string[]');
	n.Input('token', 'core.type.string');
	n.Output('out', 'core.type.string');
	
	
});
