;(function() {
"use strict";

exLIB.package('core.byte', function(pack){
	
	pack.Category('Byte');

	
	;exLIB.package('core.type', function(pack){
		pack.Type('byte').Label('Byte').Color('#016e64').MakeLiteralNode('core.byte');
	});
	
	var n = pack.Node('tobit', 'Byte to Bit')
		.Import('tpl.node.pure');
	n.Input('byte', 'core.type.byte');
	n.Output('bit0', 'core.type.bool', 'Bit 0');
	n.Output('bit1', 'core.type.bool', 'Bit 1');
	n.Output('bit2', 'core.type.bool', 'Bit 2');
	n.Output('bit3', 'core.type.bool', 'Bit 3');
	n.Output('bit4', 'core.type.bool', 'Bit 4');
	n.Output('bit5', 'core.type.bool', 'Bit 5');
	n.Output('bit6', 'core.type.bool', 'Bit 6');
	n.Output('bit7', 'core.type.bool', 'Bit 7');
	
	
n = pack.Node('tobyte', 'Bit to Byte')
		.Import('tpl.node.pure');
	n.Input('bit0', 'core.type.bool', 'Bit 0');
	n.Input('bit1', 'core.type.bool', 'Bit 1');
	n.Input('bit2', 'core.type.bool', 'Bit 2');
	n.Input('bit3', 'core.type.bool', 'Bit 3');
	n.Input('bit4', 'core.type.bool', 'Bit 4');
	n.Input('bit5', 'core.type.bool', 'Bit 5');
	n.Input('bit6', 'core.type.bool', 'Bit 6');
	n.Input('bit7', 'core.type.bool', 'Bit 7');	
	n.Output('byte', 'core.type.byte');

/******************************************************************
	Common
******************************************************************/	
	n = pack.Node('random').ImportTpl('tpl.random', 'core.type.byte', 'Byte');
	n = pack.Node('min').ImportTpl('tpl.min', 'core.type.byte', 'Byte');
	n = pack.Node('max').ImportTpl('tpl.max', 'core.type.byte', 'Byte');
	n = pack.Node('clamp').ImportTpl('tpl.clamp', 'core.type.byte', 'Byte');
	n = pack.Node('between').ImportTpl('tpl.between', 'core.type.byte', 'Byte');
		
/******************************************************************
	Arithmetic Operators
******************************************************************/	
	pack.Category('Byte/Arithmetic');
	n = pack.Node('add').ImportTpl('tpl.op.add', 'core.type.byte', 'Byte');
	n = pack.Node('sub').ImportTpl('tpl.op.sub', 'core.type.byte', 'Byte');
	n = pack.Node('multiply').ImportTpl('tpl.op.mul', 'core.type.byte', 'Byte');
	//n = pack.Node('divide').ImportTpl('tpl.op.div', 'core.type.byte', 'Byte');

/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Byte/Comparators');
	n = pack.Node('eq').ImportTpl('tpl.op.eq', 'core.type.byte', 'Byte');
	n = pack.Node('neq').ImportTpl('tpl.op.neq', 'core.type.byte', 'Byte');
	n = pack.Node('lt').ImportTpl('tpl.op.lt', 'core.type.byte', 'Byte');
	n = pack.Node('gt').ImportTpl('tpl.op.gt', 'core.type.byte', 'Byte');
	n = pack.Node('lte').ImportTpl('tpl.op.lte', 'core.type.byte', 'Byte');
	n = pack.Node('gte').ImportTpl('tpl.op.gte', 'core.type.byte', 'Byte');
	
	
	
	
});


})(this);
