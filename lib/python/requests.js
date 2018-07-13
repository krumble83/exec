;exLIB.package('python.requests', function(pack){
	
	pack.Category('Python/Requests');
	pack.Color('#87663f');
	
	pack.Type('session', 'Session Request Instance').Inherits('core.object');
	pack.Enum('method', 'Requests Method').Values(['POST', 'GET']);
	pack.Struct('session.response', 'Session Response Structure');
	pack.Type('requests.session.auth', 'Session Authentication').Inherits('core.object');
	
	var n = pack.Node('session');

	n = pack.Node('session_break_response', 'Break Session Response').Keywords('session,requests session');
	n.Input('response', 'python.requests.session.response');
	n.Output('text', 'core.type.string', 'Return Value');
	n.Output('headers', 'core.type.string[]');
	
	n = pack.Node('session_make', 'Make Requests.Session()').Keywords('session,requests session').MakeEntry().MakeExit();
	n.Input('auth', 'python.requests.session.auth');
	n.Output('session', 'python.requests.session');

	n = pack.Node('session_auth_make', 'Make Requests.Session() auth').Keywords('session auth,requests session auth');
	n.Input('username', 'core.type.string');
	n.Input('password', 'core.type.string');
	n.Output('session', 'python.requests.session.auth');
	
	n = pack.Node('session_auth', 'Session.auth()').Keywords('requests auth,session auth, auth requests, auth session').MakeEntry().MakeExit();
	n.Input('session', 'python.requests.session');
	n.Output('response', 'python.requests.session.response');	

	n = pack.Node('session_get', 'Session.get()').Keywords('session get').MakeEntry().MakeExit();
	n.Input('method', 'python.requests.method');
	n.Input('session', 'python.requests.session');
	n.Input('cookies', 'core.type.string[]');
	n.Input('data', 'core.type.string[]');
	n.Output('response', 'python.requests.session.response');	

	n = pack.Node('sessionresponsetext', 'Session.Response.text()').Keywords('session response text').MakeEntry().MakeExit();
	n.Input('response', 'python.requests.session.response');
	n.Output('text', 'core.type.string');		
});


;exLIB.load('python.base', function(ctx){

ctx.registerType('python.requests.session', {
	inherits: 'core.object',
	label: 'Session Request Instance'
});

ctx.registerType('python.requests.method', {
	inherits: 'core.type.enum',
	label: 'Requests Method',
	values: ['POST', 'GET']
});

ctx.registerType('python.requests.session.response', {
	inherits: 'core.type.struct',
	categories: ['Python/Requests'],
	label: 'Session Response',
	make: false,
	members: [
		{id: 'text', type: 'core.type.string'},
		{id: 'headers', type: 'core.type.string[]'}
	]
});

ctx.registerType('python.requests.auth', {
	inherits: 'core.type.struct',
	label: 'Session Authentication',
	categories: ['Python/Requests'],
	members: [
		{id: 'username', type: 'core.type.string'},
		{id: 'password', type: 'core.type.string'}
	],
});


ctx.registerNode('session.make', {
	import: 'python.base.base',
	categories: ['Python/Requests'],
	keywords: 'session,requests session',
	title:'Make Requests.Session()',
	color: '#87663f',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'auth', type: 'python.requests.auth'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'session', type: 'python.requests.session'}
	]
});


ctx.registerNode('session.auth', {
	import: 'python.base.base',
	categories: ['Python/Requests'],
	keywords: 'requests auth,session auth, auth requests, auth session',
	title:'Session.auth()',
	color: '#87663f',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'session', type: 'python.requests.session'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'response', type: 'python.requests.session.response'}
	]
});


ctx.registerNode('session.get', {
	import: 'python.base.base',
	categories: ['Python/Requests'],
	keywords: 'get session',
	title:'Session.get()',
	color: '#87663f',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'method', type: 'python.requests.method'},
		{id: 'session', type: 'python.requests.session'},
		{id: 'url', type: 'core.type.string'},
		{id: 'cookies', type: 'python.type.pair[]', optional: true},
		{id: 'data', type: 'python.type.pair[]', optional: true}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'response', type: 'python.requests.session.response'}
	]
});

ctx.registerNode('session.update_headers', {
	import: 'python.base.base',
	categories: ['Python/Requests'],
	keywords: 'update headers,headers update,header',
	title:'Session Update headers',
	color: '#87663f',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'session', type: 'python.requests.session'},
		{id: 'headers', type: 'python.type.pair[]'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'out', type: 'python.requests.session', label: 'Session'}
	]
});

ctx.registerNode('session.responsetext', {
	import: 'python.base.base',
	categories: ['Python/Requests'],
	keywords: 'response text',
	title:'Session.Response.text()',
	color: '#87663f',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'response', type: 'python.requests.session.response'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'text', type: 'core.type.string'}
	]
});

});