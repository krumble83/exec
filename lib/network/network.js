;exLIB.package('network.core', function(pack){

	pack.Category('Network');

	exLIB.package('network.type', function(p){
		var ip = p.Struct('ip', 'IP Address');
		ip.Pin('a', 'core.type.int', 'A');
		ip.Pin('b', 'core.type.int', 'B');
		ip.Pin('c', 'core.type.int', 'C');
		ip.Pin('d', 'core.type.int', 'D')
		ip.MakeAccessorNodes('network.core');
	});

	var n = pack.Node('ping', 'Ping').MakeEntry().MakeExit().Category('Network');
	n.Input('target', 'network.type.ip');
	n.Input('retry', 'core.type.int').Optional();
	n.Output('success', 'core.type.bool');
	
	n = pack.Node('iptostring', 'Ip to String').Category('Network');
	n.Input('target', 'network.type.ip');
	n.Output('ipstring', 'core.type.string', 'IP String');
	
	
});


;exLIB.load('network.base', function(ctx){
	
ctx.registerType('network.type.ip', {
	inherits: 'core.type.struct',
	label: 'IP Address',
	categories: ['Network'],
	members: [
		{id: '1', type: 'core.type.int'},
		{id: '2', type: 'core.type.int'},
		{id: '3', type: 'core.type.int'},
		{id: '4', type: 'core.type.int'}
	]
});


ctx.registerNode('network.ping', {
	import: 'core.function',
	categories: ['Network'],
	keywords: 'wifi,connect',
	title:'Ping',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'target', type: 'network.type.ip'},
		{id: 'retry', type: 'core.type.int', optional: true}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'},
	]
});


});
