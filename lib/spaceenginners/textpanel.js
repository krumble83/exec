;(function() {
"use strict";

exLIB.package('se', function(pack){
	
	pack.Category('Space Enginners Script');
	
	pack.Class('IMyTextPanel', 'TextPanel', function(){
		/*
		this.Member('encoding', 'core.type.string', 'Response Encoding');
		this.Member('url', 'core.type.string', 'Response Url');
		this.Member('elapsed', 'core.type.int', 'Response Elapsed Time');

		this.Member('text', 'core.type.string', 'Response Text');
		this.Member('content', 'core.type.byte[]', 'Response Content');
		this.Member('json', 'json.jsonobject', 'Response JSON');
		this.Member('status_code', 'core.type.int', 'Response status_code');
		this.Member('headers', 'python.type.stringpair[]', 'Response Headers');
		this.Member('cookies', 'RequestsCookieJar', 'Response Cookies');
		this.Member('history', 'python.requests.response[]', 'Response History');
		*/
		var n = this.Method('WritePublicText', 'WritePublicText()')
			.MakeEntry().MakeExit();
		n.Input('value', 'core.type.string');
		n.Input('append', 'core.type.bool');
		n.Output('success', 'core.type.bool');
		
		n = this.Method('GetPublicText', 'GetPublicText()');
		n.Output('text', 'core.type.string');
	});
	
});

})(this);
