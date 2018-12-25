;(function() {
"use strict";

exLIB.package('python.requests', function(pack){
	
	pack.Category('Python/Requests').Color('#87663f').Symbol('lib/python/requests.png');

	var s = pack.Struct('request_file', 'Requests File');
	s.Member('fileName', 'core.type.string');
	s.Member('mimeType', 'core.type.string');
	s.Member('data', 'core.type.byte').Array();
	s.MakeAccessorNodes('python.requests'); 

	

	pack.Category('Python/Requests/cookies');
	pack.Class('RequestsCookieJar', 'Python Requests RequestsCookieJar', function(){
		
		var n = this.Method('get', 'Get Cookie')
			.Import('tpl.node.pure');
		n.Output('name', 'core.type.string');
		
		var n = this.Method('set', 'Set Cookie')
			.Import('tpl.node.function')
			.MakeEntry().MakeExit();
		n.Input('name', 'core.type.string');
		n.Input('value', 'core.wildcards');
		
	});	
	
	
	
	pack.Category('Python/Requests/Response').Symbol('lib/python/response.png');
	pack.Class('response', 'Python Requests Response', function(){
		this.Member('encoding', 'core.type.string', 'Response Encoding');
		this.Member('url', 'core.type.string', 'Response Url');
		this.Member('elapsed', 'core.type.int', 'Response Elapsed Time');

		this.Member('text', 'core.type.string', 'Response Text');
		this.Member('content', 'core.type.byte', 'Response Content').Array();
		this.Member('json', 'json.jsonobject', 'Response JSON');
		this.Member('status_code', 'core.type.int', 'Response status_code');
		this.Member('headers', 'python.type.stringpair', 'Response Headers').Array();
		this.Member('cookies', 'RequestsCookieJar', 'Response Cookies');
		this.Member('history', 'python.requests.response', 'Response History').Array();
		
		var n = this.Method('iter_content', 'iter_content()')
			.MakeEntry();
		n.Input('chunk_size', 'core.type.int');
		n.Input('decode_unicode', 'core.type.bool').Optional();
		n.Output('loop', 'core.exec');
		n.Output('chunk', 'core.type.byte').Array();
		n.Output('completed', 'core.exec');
	});


	pack.Category('Python/Requests/Session').Symbol('lib/python/request.png');
	pack.Class('session', 'Python Requests Session', function(){
		var n = this.Method('get', 'Session Get').Keywords('request get,get requests').MakeEntry().MakeExit();
			n.Input('url', 'core.type.string');
			n.Input('params', 'python.type.stringpair').Array().Optional();
			n.Input('headers', 'python.type.stringpair').Array().Optional();
			n.Input('cookies', 'RequestsCookieJar').Optional();
			n.Input('timeout', 'core.type.float').Optional();
			n.Input('allow_redirects', 'core.type.bool').Optional();
			n.Input('stream', 'core.type.bool').Optional();
			n.Output('response', 'response');
			
		n = this.Method('post', 'Session Post').Keywords('request post,post requests').MakeEntry().MakeExit();
			n.Input('url', 'core.type.string');
			n.Input('data', 'python.type.stringpair').Array();
			n.Input('json', 'json.jsonobject').Optional();
			n.Input('files', 'python.requests.request_file').Array().Optional();
			n.Input('params', 'python.type.stringpair').Array().Optional();
			n.Input('headers', 'python.type.stringpair').Array().Optional();
			n.Input('cookies', 'RequestsCookieJar').Optional();
			n.Input('timeout', 'core.type.float').Optional();
			n.Input('allow_redirects', 'core.type.bool').Optional();
			n.Input('stream', 'core.type.bool').Optional();
			n.Output('response', 'response');				
	});
	
	
	pack.Category('Python/Requests').Symbol('lib/python/request.png');
	pack.Class('requests', 'Python Requests', function(){
		var n = this.StaticMethod('get', 'Requests Get').Keywords('request get,get requests').MakeEntry().MakeExit();
			n.Input('url', 'core.type.string');
			n.Input('params', 'python.type.stringpair').Array().Optional();
			n.Input('headers', 'python.type.stringpair').Array().Optional();
			n.Input('cookies', 'RequestsCookieJar').Optional();
			n.Input('timeout', 'core.type.float').Optional();
			n.Input('allow_redirects', 'core.type.bool').Optional();
			n.Input('stream', 'core.type.bool').Optional();
			n.Output('response', 'response');
			
		n = this.StaticMethod('post', 'Requests Post').Keywords('request post,post requests').MakeEntry().MakeExit();
			n.Input('url', 'core.type.string');
			n.Input('data', 'python.type.stringpair').Array();
			n.Input('json', 'json.jsonobject').Optional();
			n.Input('files', 'python.requests.request_file').Array().Optional();
			n.Input('params', 'python.type.stringpair').Array().Optional();
			n.Input('headers', 'python.type.stringpair').Array().Optional();
			n.Input('cookies', 'RequestsCookieJar').Optional();
			n.Input('timeout', 'core.type.float').Optional();
			n.Input('allow_redirects', 'core.type.bool').Optional();
			n.Input('stream', 'core.type.bool').Optional();
			n.Output('response', 'response');

		n = this.StaticMethod('session', 'Requests Create Session').Keywords('request session,session requests');
			n.Output('session', 'session');
			
	});
	
	return;
	
	pack.Type('session', 'Session Request Instance').Inherits('core.object');
	pack.Enum('method', 'Requests Method').Values(['POST', 'GET']);

	pack.Struct('session.response', 'Session Response Structure');
	pack.Type('session_auth', 'Session Authentication').Inherits('core.object');
	

	var n = pack.Node('session_make', 'Make Requests.Session()').Keywords('session,requests session').MakeEntry().MakeExit();
	n.Input('auth', 'session_auth');
	n.Output('session', 'session');


	n = pack.Node('session_get', 'Session.get()').Keywords('session get').MakeEntry().MakeExit();
	n.Input('session', 'session');
	n.Input('method', 'method');
	n.Input('url', 'core.type.string');
	n.Input('params', 'core.type.string').Array().Optional();
	n.Input('headers', 'core.type.string').Array().Optional();
	n.Input('cookies', 'core.type.string').Array().Optional();
	n.Input('data', 'core.type.string').Array().Optional();
	n.Output('response', 'python.requests.session.response');	
	
	
	
	
	n = pack.Node('session_break_response', 'Break Session Response').Keywords('session,requests session');
	n.Input('response', 'python.requests.session.response');
	n.Output('text', 'core.type.string', 'Return Value');
	n.Output('headers', 'core.type.string').Array();
	

	n = pack.Node('session_auth_make', 'Make Requests.Session() auth').Keywords('session auth,requests session auth');
	n.Input('username', 'core.type.string');
	n.Input('password', 'core.type.string');
	n.Output('session', 'python.requests.session.auth');
	
	n = pack.Node('session_auth', 'Session.auth()').Keywords('requests auth,session auth, auth requests, auth session').MakeEntry().MakeExit();
	n.Input('session', 'python.requests.session');
	n.Output('response', 'python.requests.session.response');	


	n = pack.Node('sessionresponsetext', 'Session.Response.text()').Keywords('session response text').MakeEntry().MakeExit();
	n.Input('response', 'python.requests.session.response');
	n.Output('text', 'core.type.string');		
});

})(this);