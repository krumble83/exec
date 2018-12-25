;(function() {
"use strict";

exLIB.package('json', function(pack){
	
	pack.Category('Json');
	
	pack.Type('jsonobject', 'JSON Object').Inherits('core.object');	

	
	var n = pack.Node('fromstring', 'JSON Parse String')
		.Import('tpl.node.function').MakeEntry().MakeExit();
	n.Input('string', 'core.type.string');
	n.Output('jsonObject', 'jsonobject');
	n.Output('success', 'core.type.bool');

	
	var n = pack.Node('stringify', 'JSON Stringify')
		.Import('tpl.node.function');
	n.Input('jsonObject', 'jsonobject');
	n.Output('string', 'core.type.string');

	var n = pack.Node('tojson', 'To JSON Object')
		.Import('tpl.node.function');
	n.Input('input', 'core.wildcards');
	n.Output('output', 'jsonobject');
	n.Output('success', 'core.type.bool');

	var n = pack.Node('exists', 'JSON Key Exists')
		.Import('tpl.node.function');
	n.Input('key', 'core.type.string');
	n.Output('success', 'core.type.bool');

	
	n = pack.Node('getjson', 'JSON Get as JSON')
		.Import('tpl.node.pure');
	n.Input('json', 'jsonobject');
	n.Input('key', 'core.type.string');
	n.Output('jsonObject', 'json.jsonobject');
	n.Output('success', 'core.type.bool');

	n = pack.Node('getarray', 'JSON Get as Array')
		.Import('tpl.node.pure');
	n.Input('json', 'jsonobject');
	n.Input('key', 'core.type.string');
	n.Output('jsonObject', 'json.jsonobject').Array();
	n.Output('success', 'core.type.bool');

	n = pack.Node('getstring', 'JSON Get as String')
		.Import('tpl.node.pure');
	n.Input('json', 'jsonobject');
	n.Input('key', 'core.type.string');
	n.Output('string', 'core.type.string');
	n.Output('success', 'core.type.bool');

	n = pack.Node('getint', 'JSON Get as Integer')
		.Import('tpl.node.pure');
	n.Input('json', 'jsonobject');
	n.Input('key', 'core.type.string');
	n.Output('int', 'core.type.int');
	n.Output('success', 'core.type.bool');


	n = pack.Node('getfloat', 'JSON Get as Float')
		.Import('tpl.node.pure');
	n.Input('json', 'jsonobject');
	n.Input('key', 'core.type.string');
	n.Output('float', 'core.type.float');

	n = pack.Node('getbool', 'JSON Get as Bool')
		.Import('tpl.node.pure');
	n.Input('json', 'jsonobject');
	n.Input('key', 'core.type.string');
	n.Output('bool', 'core.type.bool');
	
});

})(this);
