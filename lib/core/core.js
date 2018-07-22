;(function() {
"use strict";

exLIB.package('core', function(pack){
	
	pack.Type('device', 'Device').Color('#00f');
	pack.Type('exec', 'Exec').Color('#fff').Ctor('PinExec');
	pack.Type('object', 'Object').Color('#55f');
	pack.Type('wildcards', 'Wildcards').Color('#666').Ctor('PinWildcards');
	
	pack.Node('entrypoint', 'Function Entry').Ctor('NodeEntryPoint').Color('#7f2197').Symbol('lib/img/start.png').MakeExit().Flags(F_UNIQUE | F_NODELETE | F_NOCUT);
	
	pack.Node('returnpoint', 'Function Return').Ctor('NodeEntryPoint').Color('#7f2197').Symbol('lib/img/start.png').MakeEntry().Category('/');
	
	pack.Node('macro').Color('#555').Symbol('lib/img/macro.png');
	pack.Node('operator').Ctor('NodeOp').Color('#555')//.Symbol('lib/img/operator.png');
	//pack.Node('reroute').Ctor('RereouteNode').Color('#aaeea0');

});

exLIB.package('special', function(pack){
	
	this.Type('add').Color('#fff').Ctor('PinAdd');
	
	var n = this.Node('reroutenode', 'Add reroute Node...').Ctor('RereouteNode').Category('/');
	var p = n.Input('in', 'core.wildcards').Group(1);
	p = n.Output('out', 'core.wildcards').Group(1);
	p = n.Input('inout', 'core.wildcards').Group(1);
	p.Ctor('PinReroute');

	var n = this.Node('rampnode', 'Add Ramp...').Ctor('RampNode').Category('/');
	n.Input('t0', 'core.wildcards', 'Track 1').Ctor('RampPin');
	n.Input('t1', 'core.wildcards', 'Track 2').Ctor('RampPin');
	
});


exLIB.package('tpl', function(pack){
	
/******************************************************************
	Comparators
******************************************************************/	
	pack.Node('node.function').Color('#78c8fe').Symbol('lib/img/function.png');
	pack.Node('node.pure').Color('#aaeea0').Symbol('lib/img/function.png');

	var n = pack.NodeTpl('op.eq').Import('core.operator').Symbol('lib/img/op.eq.png').Keywords('==,equal').Subtitle('==').Title('*1 == *1 (equal)');
	n.Input('a', '*1');
	n.Input('b', '*1');
	n.Output('output', 'core.type.bool').Tooltip('True if a = b');
	
	n = pack.NodeTpl('op.neq').Import('core.operator').Symbol('lib/img/op.neq.png').Keywords('!=,<>,not equal,different').Subtitle('!=').Title('*1 != *1 (not equal)');
	n.Input('a', '*1');
	n.Input('b', '*1');
	n.Output('output', 'core.type.bool').Tooltip('True if a != b');

	n = pack.NodeTpl('op.gt').Import('core.operator').Symbol('lib/img/op.gt.png').Keywords('>,gretter than').Subtitle('>').Title('*1 > *1 (gretter than)');
	n.Input('a', '*1');
	n.Input('b', '*1');
	n.Output('output', 'core.type.bool').Tooltip('True if a > b');
	
	n = pack.NodeTpl('op.lt').Import('core.operator').Symbol('lib/img/op.lt.png').Keywords('<,lower than').Subtitle('<').Title('*1 < *1 (lower than)');
	n.Input('a', '*1');
	n.Input('b', '*1');
	n.Output('output', 'core.type.bool').Tooltip('True if a < b');
	
	n = pack.NodeTpl('op.gte').Import('core.operator').Symbol('lib/img/op.gte.png').Keywords('>=,=>,gretter than or equal').Subtitle('>=').Title('*1 >= *1 (gretter than or equal)');
	n.Input('a', '*1');
	n.Input('b', '*1');
	n.Output('output', 'core.type.bool').Tooltip('True if a >= b');

	n = pack.NodeTpl('op.lte').Import('core.operator').Symbol('lib/img/op.lte.png').Keywords('<=,lower than or equal').Subtitle('<=').Title('*1 <= *1 (lower than or equal)');
	n.Input('a', '*1');
	n.Input('b', '*1');
	n.Output('output', 'core.type.bool').Tooltip('True if a <= b');


	
	
/******************************************************************
	Arithmetic Operators
******************************************************************/	
	n = pack.NodeTpl('op.add').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.add.png').Keywords('add,+').Subtitle('+').Title('*1 + *1');
	n.Input('a', '*1', ' ');
	n.Input('b', '*1', ' ');
	n.Output('output', '*1');
	n.Output('add', 'special.add', 'Add Item').attr('target', 'a').Tooltip('Add a new value.');

	n = pack.NodeTpl('op.sub').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.sub.png').Keywords('sub,-').Subtitle('-').Title('*1 - *1');
	n.Input('a', '*1', ' ');
	n.Input('b', '*1', ' ');
	n.Output('output', '*1');
	n.Output('add', 'special.add', 'Add Item').attr('target', 'a').Tooltip('Add a new value.');

	n = pack.NodeTpl('op.mul').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.mul.png').Keywords('multiply,*,x').Subtitle('x').Title('*1 x *1');
	n.Input('a', '*1', ' ');
	n.Input('b', '*1', ' ');
	n.Output('output', '*1');
	n.Output('add', 'special.add', 'Add Item').attr('target', 'a').Tooltip('Add a new value.');

	n = pack.NodeTpl('op.div').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.div.png').Keywords('divide,/').Subtitle('/').Title('*1 / *1');
	n.Input('a', '*1', ' ');
	n.Input('b', '*1', ' ');
	n.Output('output', '*1');

	n = pack.NodeTpl('op.mod').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.mod.png').Keywords('modulo,%').Subtitle('%').Title('*1 % *1');
	n.Input('a', '*1', ' ');
	n.Input('b', '*1', ' ');
	n.Output('output', '*1');
	
	
/******************************************************************
	Common
******************************************************************/	
	n = pack.NodeTpl('min', 'Min (*1)')
		.Import('tpl.node.pure')
		.Keywords('min')
		.Tooltip('Return minimum value between a and b');
	n.Input('a', '*1');
	n.Input('b', '*1');
	n.Output('return', '*1');

	n = pack.NodeTpl('max', 'Max (*1)')
		.Import('tpl.node.pure')
		.Keywords('max')
		.Tooltip('Return maximum value between a and b');
	n.Input('a', '*1');
	n.Input('b', '*1');
	n.Output('return', '*1');

	
	n = pack.NodeTpl('clamp', 'Clamp (*1)')
		.Import('tpl.node.pure')
		.Keywords('clamp,limit,range')
		.Tooltip('Return value clamped between min and max');
	n.Input('value', '*1');
	n.Input('min', '*1');
	n.Input('max', '*1');
	n.Output('return', '*1');
	
	
	n = pack.NodeTpl('between', 'Between (*1)')
		.Import('tpl.node.pure')
		.Tooltip('return True if "value" is between "min" and "max" (included)')
		.Keywords('range');
	n.Input('value', '*1');
	n.Input('min', '*1');
	n.Input('max', '*1');
	n.Output('out', 'core.type.bool').Tooltip('True if "value" is between "min" and "max"');
	
	n = pack.NodeTpl('random', 'Random (*1)')
		.Import('tpl.node.pure')
		.Tooltip('return a random value between "min" and "max" (included)')
		.Keywords('make random');
	n.Input('min', '*1');
	n.Input('max', '*1');
	n.Output('out', '*1', 'Return Value');
		
});

exLIB.package('core.type', function(pack){
	pack.Enum('enum', 'Enum').Color('#8000FF').Tooltip('Enum').Editor('select');
	
	var n = pack.Node('intToEnum', 'Int To Enum').Import('tpl.node.pure').Category('Utilities/Enum');
		n.Input('int', 'core.type.int');
		n.Output('value', 'core.type.enum');
	
	pack.Struct('struct', 'Structure').Color('#0057c8').Ctor('PinStructure');
	pack.Type('scalar').Tooltip('Any scalar value');
	
});

}());
