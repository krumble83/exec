;(function() {
"use strict";

exLIB.package('core.bool', function(pack){
	
	pack.Category('Boolean');

	exLIB.package('core.type', function(pack){
		var t = pack.Type('bool', 'Boolean')
			.Inherits('core.type.scalar')
			.Color('#940000')
			.Tooltip('True or False');
		t.Editor('bool');
		t.MakeLiteralNode('core.bool');
	});
	
	var n = pack.Node('toint', 'Bool To Integer').Color('#555').Keywords('bool to int,to int');
	n.Input('bool', 'core.type.bool');
	n.Output('integer', 'core.type.int').Tooltip('Value = 0 for False, 1 for True');
	
	n = pack.Node('fromint', 'Bool From Integer').Color('#555').Keywords('bool from int,from int');
	n.Input('integer', 'core.type.int');
	n.Output('bool', 'core.type.bool');
	
	n = pack.Node('buildstring', 'BuildString (Boolean)').Color('#aaeea0').Keywords('build string, bool to string, to string, tostring');
	n.Input('prefix', 'core.type.string');
	n.Input('boolean', 'core.type.bool');
	n.Input('suffix', 'core.type.string');
	n.Output('out', 'core.type.string', 'Return Value');
	
	
/******************************************************************
	Bitwise Operators
******************************************************************/	
	pack.Category('Boolean/Bitwise Operators');
	n = pack.Node('not').ImportTpl('tpl.op.not', 'core.type.bool', 'Bool');
	n = pack.Node('and').ImportTpl('tpl.op.and', 'core.type.bool', 'Bool');
	n = pack.Node('nand').ImportTpl('tpl.op.nand', 'core.type.bool', 'Bool');
	n = pack.Node('or').ImportTpl('tpl.op.or', 'core.type.bool', 'Bool');
	n = pack.Node('nor').ImportTpl('tpl.op.nor', 'core.type.bool', 'Bool');
	n = pack.Node('xor').ImportTpl('tpl.op.xor', 'core.type.bool', 'Bool');
	n = pack.Node('xnor').ImportTpl('tpl.op.xnor', 'core.type.bool', 'Bool');

	
/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Boolean/Comparators');
	n = pack.Node('eq').ImportTpl('tpl.op.eq', 'core.type.bool', 'Boolean');	
	n = pack.Node('neq').ImportTpl('tpl.op.neq', 'core.type.bool', 'Boolean');	
});


})(this);
