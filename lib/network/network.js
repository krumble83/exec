;exLIB.package('network.core', function(pack){

	pack.Category('Network');

	exLIB.package('network.type', function(p){
		var ip = p.Struct('ip', 'IP Address');
		ip.Member('a', 'core.type.int', 'A');
		ip.Member('b', 'core.type.int', 'B');
		ip.Member('c', 'core.type.int', 'C');
		ip.Member('d', 'core.type.int', 'D')
		ip.MakeAccessorNodes('network.core');
	});

	var n = pack.Node('ping', 'Ping').MakeEntry().MakeExit().Category('Network');
	n.Input('target', 'network.type.ip');
	n.Input('retry', 'core.type.int').Optional();
	n.Output('success', 'core.type.bool');
	
	n = pack.Node('iptostring', 'Ip to String').Import('tpl.node.pure').Category('Network');
	n.Input('target', 'network.type.ip');
	n.Output('ipstring', 'core.type.string', 'IP String');
	
	
});
