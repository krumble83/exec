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
